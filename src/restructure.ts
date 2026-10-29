import type { Core } from '@strapi/strapi';

/**
 * Second half of database/migrations/2026.10.29T00.00.00.restructure-content.js.
 *
 * The migration runs before the schema sync and stashes fields that move into components that
 * don't exist yet (page title/description → seo, pricing page headings → pricing.hero…).
 * This runs right after the sync: it creates those components, links them to their page and
 * re-links the child components the migration detached. Then it drops the stash.
 */
const STASH = 'strapi_restructure_stash';

interface Link {
  type: string;
  id: number;
}
interface Op {
  parent: string;
  parentId: number;
  field: string;
  component: string;
  data: Record<string, unknown>;
  children?: { field: string; links: Link[] }[];
}

type Meta = ReturnType<Core.Strapi['db']['metadata']['get']>;
type Knex = Core.Strapi['db']['connection'];

/** Link table of a component / dynamic zone attribute, with its column names. */
function joinTableOf(meta: Meta, field: string) {
  const jt = (meta.attributes[field] as any)?.joinTable;
  if (!jt) throw new Error(`[restructure] ${meta.uid}.${field} is not a component field`);
  return {
    name: jt.name as string,
    entity: (jt.joinColumn?.name ?? 'entity_id') as string,
    id: (jt.morphColumn?.idColumn?.name ?? 'cmp_id') as string,
    type: (jt.morphColumn?.typeColumn?.name ?? 'component_type') as string,
    order: (jt.orderColumnName ?? 'order') as string,
  };
}

async function insertId(knex: Knex, table: string, row: Record<string, unknown>) {
  const [res] = await knex(table).insert(row, ['id']);
  return typeof res === 'object' ? (res as { id: number }).id : (res as number);
}

export async function applyRestructureStash(strapi: Core.Strapi) {
  const knex = strapi.db.connection;
  if (!(await knex.schema.hasTable(STASH))) return;

  const rows = await knex(STASH).select('payload').orderBy('id');
  const ops: Op[] = rows.map((r: { payload: string }) => JSON.parse(r.payload));

  await knex.transaction(async (trx) => {
    for (const op of ops) {
      const parent = strapi.db.metadata.get(op.parent);
      const component = strapi.db.metadata.get(op.component);

      const row: Record<string, unknown> = {};
      for (const [name, attr] of Object.entries(component.attributes) as [string, any][]) {
        const value = op.data[name] ?? attr.default;
        if (attr.columnName === undefined || value === null || value === undefined) continue;
        // JSON goes in as text: Postgres would turn a JS array into a Postgres array.
        row[attr.columnName ?? name] = attr.type === 'json' && typeof value !== 'string' ? JSON.stringify(value) : value;
      }
      const id = await insertId(trx, component.tableName, row);

      const link = joinTableOf(parent, op.field);
      await trx(link.name).insert({ [link.entity]: op.parentId, [link.id]: id, [link.type]: op.component, field: op.field, [link.order]: 1 });

      for (const child of op.children ?? []) {
        const childLink = joinTableOf(component, child.field);
        for (const [i, c] of child.links.entries()) {
          await trx(childLink.name).insert({
            [childLink.entity]: id,
            [childLink.id]: c.id,
            [childLink.type]: c.type,
            field: child.field,
            [childLink.order]: i + 1,
          });
        }
      }
    }
    await trx.schema.dropTable(STASH);
  });

  strapi.log.info(`[restructure] Moved ${ops.length} groups of fields into their new components.`);
}
