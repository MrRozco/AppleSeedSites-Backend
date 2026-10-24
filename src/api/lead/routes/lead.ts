/**
 * lead router
 * Only "create" is exposed over the API (used by the website's /api/lead route).
 * Leads are read and managed in the Strapi admin.
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::lead.lead', {
  only: ['create'],
});
