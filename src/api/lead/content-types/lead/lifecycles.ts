/**
 * Lead lifecycles: email a notification for every new lead.
 *
 * Sends to LEAD_NOTIFY_EMAIL through the Strapi email plugin when a real provider is configured
 * in config/plugins.ts. Without one (the built-in default is "sendmail", which doesn't work on
 * Strapi Cloud) it logs a warning instead. The email is sent in the background and every error
 * is caught, so a mail problem can never fail the request that created the lead.
 */

type Lead = Record<string, unknown> & { id?: number; documentId?: string };

const FIELDS: Array<[keyof Lead, string]> = [
  ['name', 'Name'],
  ['contact', 'Contact'],
  ['business', 'Business'],
  ['website', 'Website'],
  ['need', 'Need'],
  ['plan', 'Plan'],
  ['template', 'Template'],
  ['intent', 'Intent'],
  ['sourcePage', 'Source page'],
  ['utmSource', 'UTM source'],
  ['utmMedium', 'UTM medium'],
  ['utmCampaign', 'UTM campaign'],
  ['message', 'Message'],
];

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);

function emailProvider(): string | undefined {
  return strapi.config.get('plugin::email.provider') as string | undefined;
}

async function notify(lead: Lead) {
  const to = process.env.LEAD_NOTIFY_EMAIL;
  if (!to) {
    strapi.log.warn(`[lead] New lead ${lead.documentId}: LEAD_NOTIFY_EMAIL is not set, no notification sent.`);
    return;
  }
  const provider = emailProvider();
  if (!provider || provider === 'sendmail') {
    strapi.log.warn(
      `[lead] New lead ${lead.documentId}: no email provider is configured in config/plugins.ts, no notification sent. Check the Strapi admin.`,
    );
    return;
  }

  const rows = FIELDS.filter(([key]) => lead[key] != null && lead[key] !== '').map(([key, label]) => [
    label,
    String(lead[key]),
  ]);
  const text = rows.map(([label, value]) => `${label}: ${value}`).join('\n');
  const html = `<table>${rows
    .map(([label, value]) => `<tr><th align="left" valign="top">${label}</th><td>${escapeHtml(value).replace(/\n/g, '<br>')}</td></tr>`)
    .join('')}</table>`;

  await strapi
    .plugin('email')
    .service('email')
    .send({
      to,
      subject: `New lead: ${lead.business || lead.name}${lead.plan ? ` (${lead.plan})` : ''}`,
      text,
      html,
    });
}

export default {
  afterCreate(event: { result: Lead }) {
    // Not awaited: the API response never waits on, or fails because of, the email.
    notify(event.result).catch((error: Error) => {
      strapi.log.warn(`[lead] Could not send the notification email for lead ${event.result?.documentId}: ${error.message}`);
    });
  },
};
