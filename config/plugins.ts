export default ({ env }) => ({
  oembed: {
    enabled: true,
  },
  /*
   * Lead notification emails (src/api/lead/content-types/lead/lifecycles.ts) need a real email
   * provider. Until one is set up here, new leads log a warning instead of sending an email.
   * Example with Nodemailer (npm install @strapi/provider-email-nodemailer):
   *
   * email: {
   *   config: {
   *     provider: 'nodemailer',
   *     providerOptions: {
   *       host: env('SMTP_HOST'),
   *       port: env.int('SMTP_PORT', 587),
   *       auth: { user: env('SMTP_USERNAME'), pass: env('SMTP_PASSWORD') },
   *     },
   *     settings: {
   *       defaultFrom: env('EMAIL_FROM'),
   *       defaultReplyTo: env('EMAIL_FROM'),
   *     },
   *   },
   * },
   */
});
