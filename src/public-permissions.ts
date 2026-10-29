import type { Core } from '@strapi/strapi';

/**
 * Read access the Next.js site needs, granted to the Public role on every startup.
 * Role permissions live in the database, not in code, so a new environment (or a new
 * content type) would otherwise answer the site with 403 until someone ticks the boxes.
 * Only adds what's missing; never removes anything. Leads stay private.
 */
const SINGLE_TYPES = [
  'homepage',
  'about',
  'ai',
  'e-commerce',
  'landing-page',
  'medium-business',
  'small-business',
  'seo',
  'template',
  'testimonial',
  'web-op',
  'privacy-policy',
  'terms-of-service',
  'pricing-page',
  'lead-form',
  'thank-you-page',
  'navbar',
  'footer',
];
const COLLECTION_TYPES = ['plan', 'add-on', 'section'];

export const PUBLIC_ACTIONS = [
  ...SINGLE_TYPES.map((name) => `api::${name}.${name}.find`),
  ...COLLECTION_TYPES.flatMap((name) => [`api::${name}.${name}.find`, `api::${name}.${name}.findOne`]),
];

export async function grantPublicReadAccess(strapi: Core.Strapi) {
  const role = await strapi.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
  if (!role) return;

  const permissions = strapi.db.query('plugin::users-permissions.permission');
  const existing = await permissions.findMany({ where: { role: role.id }, select: ['action'] });
  const have = new Set(existing.map((p: { action: string }) => p.action));
  const missing = PUBLIC_ACTIONS.filter((action) => !have.has(action));

  for (const action of missing) await permissions.create({ data: { action, role: role.id } });
  if (missing.length) strapi.log.info(`[permissions] Public role can now read: ${missing.join(', ')}`);
}
