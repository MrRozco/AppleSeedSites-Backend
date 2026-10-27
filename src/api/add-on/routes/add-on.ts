/**
 * add-on router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::add-on.add-on', {
  only: ['find','findOne'],
});
