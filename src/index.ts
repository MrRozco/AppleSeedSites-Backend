import type { Core } from '@strapi/strapi';
import { errors } from '@strapi/utils';
import { applyRestructureStash } from './restructure';
import { grantPublicReadAccess } from './public-permissions';

export default {
  /**
   * Runs before the app is initialized.
   * - Finishes the one-time content restructure right after the schema sync (see src/restructure.ts).
   * - Document Service middleware: the pricing page's comparison-table rows are matched to each
   *   plan's comparisonValues by `key`, so keys must be unique on the page.
   */
  register({ strapi }: { strapi: Core.Strapi }) {
    strapi.hook('strapi::content-types.afterSync').register(() => applyRestructureStash(strapi));

    strapi.documents.use(async (context, next) => {
      if (
        context.uid === 'api::pricing-page.pricing-page' &&
        (context.action === 'create' || context.action === 'update')
      ) {
        const rows = (context.params as { data?: { comparison?: { features?: Array<{ key?: string }> } } })?.data
          ?.comparison?.features;
        if (Array.isArray(rows)) {
          const seen = new Set<string>();
          for (const row of rows) {
            const key = row?.key?.trim();
            if (!key) continue;
            if (seen.has(key)) {
              throw new errors.ValidationError(`Comparison feature key "${key}" is used more than once. Keys must be unique.`);
            }
            seen.add(key);
          }
        }
      }
      return next();
    });
  },

  /** Runs before the app starts: make sure the site can read its content. */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await grantPublicReadAccess(strapi);
  },
};
