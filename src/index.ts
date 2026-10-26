import type { Core } from '@strapi/strapi';
import { errors } from '@strapi/utils';

export default {
  /**
   * Runs before the app is initialized.
   * Document Service middleware: the pricing page's comparison-table rows are matched to each
   * plan's comparisonValues by `key`, so keys must be unique on the page.
   */
  register({ strapi }: { strapi: Core.Strapi }) {
    strapi.documents.use(async (context, next) => {
      if (
        context.uid === 'api::pricing-page.pricing-page' &&
        (context.action === 'create' || context.action === 'update')
      ) {
        const rows = (context.params as { data?: { comparisonFeatures?: Array<{ key?: string }> } })?.data
          ?.comparisonFeatures;
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

  bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {},
};
