'use strict';

/**
 * One-time content restructure (October 2026).
 *
 * Strapi runs this once, BEFORE it syncs the database to the new schemas, so it can move data
 * the sync would otherwise drop. Component tables keep their names (collectionName didn't change),
 * so only the component UIDs, a few column names and the link rows need updating:
 *
 *   1. merge duplicate components into one (shared.link → elements.link, shared.faq → elements.faq-item…)
 *   2. stash fields that move into new components (page title/description → seo, pricing page
 *      headings → section components…). src/restructure.ts applies the stash right after the sync,
 *      once the new component tables exist.
 *   3. collapse light/dark icon pairs into one icon (the site is dark-only)
 *   4. rename columns, component fields and media fields
 *   5. move components to their new categories (custom.hero → sections.hero…)
 *
 * A fresh database (no tables yet) has nothing to move and is skipped.
 */

const STASH = 'strapi_restructure_stash';

/** Old component UID → new UID. */
const UIDS = {
  'custom.hero': 'sections.hero',
  'custom.features': 'sections.features',
  'custom.about-section': 'sections.text-image',
  'custom.business-section': 'sections.text-gallery',
  'custom.our-work': 'sections.our-work',
  'custom.performance': 'sections.performance',
  'custom.testimonials': 'sections.testimonials',
  'custom.pricing': 'sections.pricing',
  'custom.steps': 'sections.steps',
  'custom.faq': 'sections.faq',
  'custom.lead-form': 'sections.lead-form',
  'layout.button': 'elements.link',
  'custom.bullet-point': 'elements.bullet',
  'custom.features-card': 'elements.feature-card',
  'custom.card': 'elements.testimonial',
  'custom.contact-link': 'elements.contact-link',
  'layout.faq-item': 'elements.faq-item',
  'layout.portfolio-card': 'elements.project',
  'layout.pricing-cards': 'elements.pricing-card',
  'layout.stat': 'elements.stat',
  'layout.step': 'elements.step',
  'layout.trust-item': 'elements.trust-item',
  'shared.feature': 'elements.list-item',
  'menu.menu-link': 'navigation.link',
  'menu.menu-button': 'navigation.button',
  'menu.dropdown': 'navigation.dropdown',
  'menu.link': 'navigation.mega-link',
};
const newUid = (uid) => UIDS[uid] || uid;

/** [table, old column, new column] */
const COLUMNS = [
  ['components_custom_heroes', 'header', 'title'],
  ['components_custom_heroes', 'text', 'description'],
  ['components_custom_features', 'body', 'description'],
  ['components_custom_business_sections', 'tag', 'anchor_id'],
  ['components_custom_performances', 'heading', 'title'],
  ['components_custom_pricings', 'heading', 'title'],
  ['components_layout_buttons', 'title', 'label'],
  ['components_custom_features_cards', 'body', 'description'],
  ['components_custom_cards', 'testimonial', 'quote'],
  ['components_custom_cards', 'subname', 'business'],
  ['components_custom_contact_links', 'text', 'label'],
  ['components_layout_portfolio_cards', 'button_text', 'button_label'],
  ['components_layout_stats', 'number', 'value'],
  ['components_layout_stats', 'text', 'label'],
  ['components_menu_menu_links', 'title', 'label'],
  ['components_menu_menu_buttons', 'text', 'label'],
  ['components_menu_menu_buttons', 'type', 'style'],
  ['components_menu_dropdowns', 'title', 'label'],
  ['components_menu_links', 'name', 'label'],
  ['components_pricing_plan_matchs', 'link_href', 'link_url'],
  ['components_shared_ctas', 'heading', 'title'],
  ['components_shared_ctas', 'body', 'description'],
  ['components_shared_ctas', 'primary_href', 'primary_url'],
  ['components_shared_ctas', 'secondary_href', 'secondary_url'],
  ['components_shared_guarantees', 'heading', 'title'],
  ['components_shared_guarantees', 'body', 'description'],
  ['footers', 'menu_header', 'links_title'],
  ['footers', 'contact_header', 'contact_title'],
  ['sections', 'heading', 'title'],
];

/** [owner's link table, old field, new field] for component and dynamic zone fields. */
const COMPONENT_FIELDS = [
  ['components_custom_heroes_cmps', 'button', 'buttons'],
  ['components_custom_heroes_cmps', 'trust', 'trustItems'],
  ['components_custom_features_cmps', 'featuresCard', 'cards'],
  ['components_custom_about_sections_cmps', 'bulletPoint', 'bullets'],
  ['components_custom_business_sections_cmps', 'bulletPoint', 'bullets'],
  ['components_custom_business_sections_cmps', 'button', 'buttons'],
  ['components_custom_our_works_cmps', 'portfolioCard', 'projects'],
  ['components_custom_performances_cmps', 'stat', 'stats'],
  ['components_custom_performances_cmps', 'bulletPoint', 'bullets'],
  ['components_custom_testimonials_cmps', 'testimonialCards', 'testimonials'],
  ['components_custom_pricings_cmps', 'card', 'cards'],
  ['components_custom_steps_cmps', 'step', 'steps'],
  ['components_custom_faqs_cmps', 'faqItem', 'items'],
  ['components_custom_features_cards_cmps', 'button', 'buttons'],
  ['components_layout_pricing_cards_cmps', 'bulletPoint', 'bullets'],
  ['components_layout_pricing_cards_cmps', 'cta', 'buttons'],
  ['components_menu_dropdowns_cmps', 'menuLink', 'links'],
  ['footers_cmps', 'footerLink', 'links'],
  ['footers_cmps', 'contactLink', 'contactLinks'],
  ['navbars_cmps', 'NavbarItems', 'items'],
];

/** [old owner UID, old field, new field] for media fields. */
const MEDIA_FIELDS = [
  ['custom.hero', 'heroImage', 'image'],
  ['custom.business-section', 'sliderImages', 'images'],
];

/** [old owner UID, fields in order of preference, new field]: keep the first upload found. */
const MEDIA_COLLAPSE = [
  ['custom.bullet-point', ['darkIcon', 'lightIcon'], 'icon'],
  ['custom.card', ['darkIcon', 'lightIcon'], 'icon'],
  ['custom.contact-link', ['darkIcon', 'lightIcon'], 'icon'],
  ['menu.link', ['darkIcon', 'LightIcon'], 'icon'],
  ['api::navbar.navbar', ['darkLogo', 'lightLogo'], 'logo'],
];

/** CMS page tables whose title/description become the page's seo component. */
const PAGES = {
  homepages: 'api::homepage.homepage',
  abouts: 'api::about.about',
  ais: 'api::ai.ai',
  e_commerces: 'api::e-commerce.e-commerce',
  landing_pages: 'api::landing-page.landing-page',
  medium_businesses: 'api::medium-business.medium-business',
  small_businesses: 'api::small-business.small-business',
  seos: 'api::seo.seo',
  templates: 'api::template.template',
  testimonials: 'api::testimonial.testimonial',
  web_ops: 'api::web-op.web-op',
  privacy_policies: 'api::privacy-policy.privacy-policy',
  terms_of_services: 'api::terms-of-service.terms-of-service',
};

/* ---------- helpers ---------- */

async function listTables(knex) {
  const client = String(knex.client.config.client);
  if (client.includes('sqlite')) {
    const rows = await knex.raw("select name from sqlite_master where type = 'table'");
    return rows.map((r) => r.name);
  }
  if (client === 'pg' || client === 'postgres') {
    const res = await knex.raw('select table_name as name from information_schema.tables where table_schema = current_schema()');
    return res.rows.map((r) => r.name);
  }
  const [rows] = await knex.raw('select table_name as name from information_schema.tables where table_schema = database()');
  return rows.map((r) => r.name || r.NAME);
}

async function insertId(knex, table, row) {
  const [res] = await knex(table).insert(row, ['id']);
  return typeof res === 'object' ? res.id : res;
}

const parseJson = (value) => {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

/** Strapi Blocks → Markdown, for FAQ answers moving to the rich text (Markdown) FAQ item. */
function blocksToMarkdown(blocks) {
  const inline = (nodes = []) =>
    nodes
      .map((n) => {
        if (n.type === 'link') return `[${inline(n.children)}](${n.url})`;
        let t = n.text || '';
        if (!t.trim()) return t;
        if (n.code) t = `\`${t}\``;
        if (n.bold) t = `**${t}**`;
        if (n.italic) t = `_${t}_`;
        if (n.strikethrough) t = `~~${t}~~`;
        return t;
      })
      .join('');
  return (Array.isArray(blocks) ? blocks : [])
    .map((b) => {
      switch (b.type) {
        case 'heading':
          return `${'#'.repeat(b.level || 3)} ${inline(b.children)}`;
        case 'list':
          return (b.children || [])
            .map((item, i) => `${b.format === 'ordered' ? `${i + 1}.` : '-'} ${inline(item.children)}`)
            .join('\n');
        case 'quote':
          return `> ${inline(b.children)}`;
        case 'code':
          return '```\n' + inline(b.children) + '\n```';
        case 'image':
          return b.image?.url ? `![${b.image.alternativeText || ''}](${b.image.url})` : '';
        default:
          return inline(b.children);
      }
    })
    .filter((s) => s.trim())
    .join('\n\n');
}

/* ---------- steps ---------- */

/**
 * Copies every `from` component linked in `cmpsTables` into the `to` table and points the
 * link rows at the copy. The old rows are dropped with their table by the schema sync.
 */
async function merge(knex, cmpsTables, { fromUid, fromTable, toUid, toTable, map }) {
  for (const cmpsTable of cmpsTables) {
    const links = await knex(cmpsTable).where('component_type', fromUid);
    for (const link of links) {
      const source = await knex(fromTable).where('id', link.cmp_id).first();
      if (!source) {
        await knex(cmpsTable).where('id', link.id).del();
        continue;
      }
      const id = await insertId(knex, toTable, map(source));
      await knex(cmpsTable).where('id', link.id).update({ cmp_id: id, component_type: toUid });
    }
  }
}

async function mergeDuplicates(knex, tables) {
  const cmpsTables = tables.filter((t) => t.endsWith('_cmps'));
  if (tables.includes('components_shared_links')) {
    await merge(knex, cmpsTables, {
      fromUid: 'shared.link',
      fromTable: 'components_shared_links',
      toUid: 'layout.button',
      toTable: 'components_layout_buttons',
      map: (r) => ({ title: r.label, url: r.href }),
    });
  }
  // Footer links become elements.link; navbar links stay navigation.link.
  if (tables.includes('footers_cmps')) {
    await merge(knex, ['footers_cmps'], {
      fromUid: 'menu.menu-link',
      fromTable: 'components_menu_menu_links',
      toUid: 'layout.button',
      toTable: 'components_layout_buttons',
      map: (r) => ({ title: r.title, url: r.url }),
    });
  }
  if (tables.includes('components_shared_next_steps')) {
    await merge(knex, cmpsTables, {
      fromUid: 'shared.next-step',
      fromTable: 'components_shared_next_steps',
      toUid: 'layout.step',
      toTable: 'components_layout_steps',
      map: (r) => ({ title: r.title, body: r.text }),
    });
  }
  if (tables.includes('components_shared_faqs')) {
    await merge(knex, cmpsTables, {
      fromUid: 'shared.faq',
      fromTable: 'components_shared_faqs',
      toUid: 'layout.faq-item',
      toTable: 'components_layout_faq_items',
      map: (r) => ({ question: r.question, answer: blocksToMarkdown(parseJson(r.answer)) }),
    });
  }
}

/** Removes an owner row's links for `field` and returns them (new UIDs, in order). */
async function takeLinks(knex, cmpsTable, entityId, field) {
  const links = await knex(cmpsTable).where({ entity_id: entityId, field }).orderBy('order').orderBy('id');
  await knex(cmpsTable).where({ entity_id: entityId, field }).del();
  return links.map((l) => ({ type: newUid(l.component_type), id: l.cmp_id }));
}

const hasData = (op) =>
  Object.values(op.data).some((v) => v !== null && v !== undefined && v !== '') ||
  (op.children || []).some((c) => c.links.length > 0);

async function stashMovedFields(knex, tables) {
  const ops = [];
  const push = (op) => hasData(op) && ops.push(op);

  for (const [table, uid] of Object.entries(PAGES)) {
    if (!tables.includes(table)) continue;
    for (const row of await knex(table).select('id', 'title', 'description')) {
      push({ parent: uid, parentId: row.id, field: 'seo', component: 'shared.seo', data: { metaTitle: row.title, metaDescription: row.description } });
    }
  }

  if (tables.includes('pricing_pages')) {
    const uid = 'api::pricing-page.pricing-page';
    const t = 'pricing_pages_cmps';
    for (const r of await knex('pricing_pages')) {
      push({
        parent: uid, parentId: r.id, field: 'hero', component: 'pricing.hero',
        data: {
          eyebrow: r.eyebrow, title: r.heading, description: r.subheading,
          upfrontLabel: r.toggle_upfront_label, zeroDownLabel: r.toggle_zero_down_label, belowCardsNote: r.below_cards_note,
        },
      });
      push({ parent: uid, parentId: r.id, field: 'planFinder', component: 'pricing.plan-finder', data: { title: r.which_plan_heading }, children: [{ field: 'matches', links: await takeLinks(knex, t, r.id, 'whichPlan') }] });
      push({ parent: uid, parentId: r.id, field: 'comparison', component: 'pricing.comparison', data: { title: 'Compare every feature' }, children: [{ field: 'features', links: await takeLinks(knex, t, r.id, 'comparisonFeatures') }] });
      push({ parent: uid, parentId: r.id, field: 'addOns', component: 'pricing.add-ons', data: { title: r.add_ons_heading }, children: [{ field: 'cta', links: await takeLinks(knex, t, r.id, 'ecommerce') }] });
      push({ parent: uid, parentId: r.id, field: 'costComparison', component: 'pricing.cost-comparison', data: { title: r.cost_comparison_heading }, children: [{ field: 'rows', links: await takeLinks(knex, t, r.id, 'costComparison') }] });
      push({ parent: uid, parentId: r.id, field: 'faq', component: 'sections.faq', data: { title: r.faq_heading }, children: [{ field: 'items', links: await takeLinks(knex, t, r.id, 'faqs') }] });
    }
  }

  if (tables.includes('lead_forms')) {
    const uid = 'api::lead-form.lead-form';
    for (const r of await knex('lead_forms')) {
      push({ parent: uid, parentId: r.id, field: 'hero', component: 'shared.page-intro', data: { eyebrow: r.eyebrow, title: r.heading, description: r.subheading } });
      push({
        parent: uid, parentId: r.id, field: 'form', component: 'forms.lead-form-fields',
        data: {
          nameLabel: r.name_label, contactLabel: r.contact_label, contactPlaceholder: r.contact_placeholder,
          businessLabel: r.business_label, websiteLabel: r.website_label, websitePlaceholder: r.website_placeholder,
          needLabel: r.need_label, needOptions: parseJson(r.need_options), messageLabel: r.message_label,
          submitLabel: r.submit_label, underButtonText: r.under_button_text, privacyText: r.privacy_text,
        },
      });
      push({ parent: uid, parentId: r.id, field: 'nextSteps', component: 'sections.steps', data: { title: r.next_steps_heading }, children: [{ field: 'steps', links: await takeLinks(knex, 'lead_forms_cmps', r.id, 'nextSteps') }] });
    }
  }

  if (tables.includes('thank_you_pages')) {
    const uid = 'api::thank-you-page.thank-you-page';
    for (const r of await knex('thank_you_pages')) {
      push({ parent: uid, parentId: r.id, field: 'hero', component: 'shared.page-intro', data: { title: r.heading, description: r.body } });
      push({ parent: uid, parentId: r.id, field: 'prepare', component: 'shared.checklist', data: { title: r.prepare_heading }, children: [{ field: 'items', links: await takeLinks(knex, 'thank_you_pages_cmps', r.id, 'prepareList') }] });
    }
  }

  if (!ops.length) return;
  if (!(await knex.schema.hasTable(STASH))) {
    await knex.schema.createTable(STASH, (t) => {
      t.increments('id');
      t.text('payload');
    });
  }
  for (const op of ops) await knex(STASH).insert({ payload: JSON.stringify(op) });
}

async function collapseMedia(knex) {
  for (const [relatedType, fields, target] of MEDIA_COLLAPSE) {
    // Leftovers from an older schema that already used the target name: hidden today, so drop them.
    await knex('files_related_mph').where({ related_type: relatedType, field: target }).del();
    const rows =await knex('files_related_mph').where('related_type', relatedType).whereIn('field', fields);
    const byOwner = new Map();
    for (const row of rows) {
      if (!byOwner.has(row.related_id)) byOwner.set(row.related_id, []);
      byOwner.get(row.related_id).push(row);
    }
    for (const list of byOwner.values()) {
      list.sort((a, b) => fields.indexOf(a.field) - fields.indexOf(b.field));
      const [keep, ...drop] = list;
      await knex('files_related_mph').where('id', keep.id).update({ field: target, order: 1 });
      if (drop.length) await knex('files_related_mph').whereIn('id', drop.map((r) => r.id)).del();
    }
  }
}

async function renameFields(knex, tables) {
  for (const [table, from, to] of COLUMNS) {
    if (!tables.includes(table)) continue;
    if (!(await knex.schema.hasColumn(table, from)) || (await knex.schema.hasColumn(table, to))) continue;
    await knex.schema.alterTable(table, (t) => t.renameColumn(from, to));
  }
  for (const [table, from, to] of COMPONENT_FIELDS) {
    if (tables.includes(table)) await knex(table).where('field', from).update({ field: to });
  }
  for (const [relatedType, from, to] of MEDIA_FIELDS) {
    await knex('files_related_mph').where({ related_type: relatedType, field: from }).update({ field: to });
  }
}

async function moveComponents(knex, tables) {
  for (const table of tables.filter((t) => t.endsWith('_cmps'))) {
    for (const [from, to] of Object.entries(UIDS)) {
      await knex(table).where('component_type', from).update({ component_type: to });
    }
  }
  for (const [from, to] of Object.entries(UIDS)) {
    await knex('files_related_mph').where('related_type', from).update({ related_type: to });
  }
}

module.exports = {
  async up(knex) {
    const tables = await listTables(knex);
    // Fresh database, or already restructured.
    if (!tables.includes('components_custom_heroes') || tables.includes('components_shared_page_intros')) return;

    await mergeDuplicates(knex, tables);
    await stashMovedFields(knex, tables);
    if (tables.includes('files_related_mph')) await collapseMedia(knex);
    await renameFields(knex, tables);
    await moveComponents(knex, tables);
  },

  async down() {
    throw new Error('The content restructure cannot be undone automatically. Restore a database backup instead.');
  },
};
