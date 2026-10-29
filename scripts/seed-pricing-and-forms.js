/**
 * Seeds placeholder content for pricing and the lead-form system:
 * plans, add-ons, and the pricing-page, lead-form and thank-you-page single types.
 * Also removes any public access to leads (read access for the site is granted on every
 * startup by src/public-permissions.ts).
 *
 *   npm run seed:pricing                (local development)
 *   npm run seed:pricing -- --force     (required when NODE_ENV=production or the DB isn't local SQLite)
 *
 * Idempotent: plans are upserted by slug, add-ons by name, single types in place. Running it
 * again overwrites those entries with the placeholder content below and publishes them.
 * It never runs automatically: it is not called from bootstrap, build or deploy.
 */
const { compileStrapi, createStrapi } = require("@strapi/strapi");

const FORCE = process.argv.includes("--force");

/* ---------- placeholder content ---------- */

const features = (list) => list.map((text) => ({ text }));

const COMPARISON = [
  // key, label, Spark, Elevate, Momentum
  ["pages", "Pages", "Up to 5", "Up to 10 + blog", "Up to 20 + service/location pages"],
  ["self-edit", "Edit it yourself", "—", "✓", "✓"],
  ["changes", "Changes done for you", "2/mo", "5/mo", "Priority, same business day"],
  ["gbp", "Google Business Profile", "Setup", "Setup + optimization", "Ongoing management"],
  ["seo", "SEO", "On-page basics", "+ monthly report", "Ongoing local SEO"],
  ["integrations", "Integrations", "Contact form", "1", "2 + custom"],
  ["graphics", "Custom graphics", "~10 at launch", "+ 5/mo", "+ 10/mo + 1 video"],
  ["strategy", "Strategy call", "—", "—", "Quarterly"],
  ["hosting", "Hosting, SSL, backups, security", "✓", "✓", "✓"],
];
const valuesFor = (col) => COMPARISON.map((row) => ({ featureKey: row[0], value: row[col] }));

const PLANS = [
  {
    name: "Spark",
    slug: "spark",
    bestFor: "Service businesses getting online: landscapers, cleaners, groomers, contractors",
    monthlyPrice: 99,
    setupFee: 797,
    zeroDownMonthly: 166,
    zeroDownMonths: 12,
    includesPrevious: null,
    badge: null,
    isHighlighted: false,
    ctaLabel: "Choose Spark",
    sortOrder: 1,
    features: features([
      "Custom-designed website, up to 5 pages",
      "Mobile-first design that loads in about a second",
      "Google Business Profile setup",
      "Click-to-call and contact form on every page",
      "On-page SEO and Google-ready setup",
      "Custom AI graphics at launch (about 10)",
      "Hosting, SSL, backups, and security updates",
      "2 change requests a month, done for you",
    ]),
    teaserFeatures: features(["Up to 5 pages", "Google Business Profile setup", "2 changes a month, done for you"]),
    comparisonValues: valuesFor(2),
  },
  {
    name: "Elevate",
    slug: "elevate",
    bestFor: "Restaurants, salons, gyms, and growing businesses that want to make their own updates",
    monthlyPrice: 199,
    setupFee: 1297,
    zeroDownMonthly: 308,
    zeroDownMonths: 12,
    includesPrevious: "Everything in Spark, plus:",
    badge: "Most Popular",
    isHighlighted: true,
    ctaLabel: "Choose Elevate",
    sortOrder: 2,
    features: features([
      "Up to 10 pages, plus a blog",
      "Edit your menu, prices, and photos yourself from a simple dashboard",
      "1 integration: booking, quotes, or online ordering",
      "Google Business Profile optimization",
      "Monthly performance report",
      "5 new custom graphics a month",
      "5 change requests a month, done for you",
    ]),
    teaserFeatures: features(["Up to 10 pages + blog", "Edit it yourself", "Booking or ordering built in"]),
    comparisonValues: valuesFor(3),
  },
  {
    name: "Momentum",
    slug: "momentum",
    bestFor: "Businesses competing for the top of Google Maps in their area",
    monthlyPrice: 349,
    setupFee: 1997,
    zeroDownMonthly: 516,
    zeroDownMonths: 12,
    includesPrevious: "Everything in Elevate, plus:",
    badge: null,
    isHighlighted: false,
    ctaLabel: "Choose Momentum",
    sortOrder: 3,
    features: features([
      "Up to 20 pages, plus service and location pages",
      "Ongoing local SEO: citations, rank tracking, and 2 new local pages or posts a month",
      "Google Business Profile management",
      "2 integrations, plus custom features",
      "10 new graphics and 1 short promo video a month",
      "Priority support with same-business-day changes",
      "Quarterly strategy call",
    ]),
    teaserFeatures: features(["Up to 20 pages", "Ongoing local SEO", "Priority support"]),
    comparisonValues: valuesFor(4),
  },
];

const ADD_ONS = [
  {
    name: "Local SEO Boost",
    price: 249,
    priceSuffix: "per-month",
    priceNote: null,
    description: "Google Business Profile management, citations, 1 local page or post a month, and a rank report. For Spark and Elevate.",
    link: { label: "How local SEO works", url: "/seo" },
    sortOrder: 1,
  },
  {
    name: "AI Media Pack",
    price: 99,
    priceSuffix: "per-month",
    priceNote: null,
    description: "10 custom graphics and 1 short promo video every month.",
    link: { label: "See examples", url: "/ai" },
    sortOrder: 2,
  },
  {
    name: "Landing page",
    price: 497,
    priceSuffix: "one-time",
    priceNote: "Standalone pages add $19/mo hosting",
    description: "One focused page for an ad, promo, or event.",
    link: { label: "Explore landing pages", url: "/landing-page" },
    sortOrder: 3,
  },
  {
    name: "Full website audit",
    price: 297,
    priceSuffix: "one-time",
    priceNote: null,
    description: "A deep report with competitor benchmarks and a ranked fix list. Credited in full toward setup if you sign within 30 days.",
    link: { label: "What's in an audit", url: "/web-ops" },
    sortOrder: 4,
  },
  {
    name: "Extra pages (Spark)",
    price: 100,
    priceSuffix: "each",
    priceNote: null,
    description: "Add a page anytime.",
    link: null,
    sortOrder: 5,
  },
];

const PRICING_PAGE = {
  hero: {
    eyebrow: "Pricing",
    title: "Simple monthly plans. No surprise bills.",
    description: "Every plan includes hosting, security, backups, and updates. Pay setup upfront, or start with $0 down.",
    upfrontLabel: "Pay setup upfront",
    zeroDownLabel: "$0 down",
    belowCardsNote:
      "A change request is any edit under 30 minutes; bigger changes are quoted first. Month-to-month after setup. Cancel with 30 days' notice.",
  },
  planFinder: {
    title: "Which plan is right for me?",
    matches: [
      {
        situation: "A landscaper, cleaner, groomer, or contractor who needs calls",
        planSlug: "spark",
        linkLabel: "See service business websites",
        linkUrl: "/small-business",
      },
      {
        situation: "A restaurant, salon, or gym whose menu, prices, or schedule change often",
        planSlug: "elevate",
        linkLabel: "See restaurant, salon & gym websites",
        linkUrl: "/medium-business",
      },
      {
        situation: "Competing with other local businesses for the top of Google Maps",
        planSlug: "momentum",
        linkLabel: "See how local SEO works",
        linkUrl: "/seo",
      },
      { situation: "Not sure", planSlug: null, linkLabel: "Get My Free Website Plan", linkUrl: "/contact?from=pricing-help" },
    ],
  },
  comparison: {
    title: "Compare every feature",
    features: COMPARISON.map(([key, label]) => ({ key, label })),
  },
  addOns: {
    title: "Add-ons",
    cta: {
      title: "Online stores",
      description: "Custom stores start at $2,497 setup + $249/month. Every store is quoted after a free call.",
      primaryLabel: "Get an E-Commerce Quote",
      primaryUrl: "/contact?intent=store&from=pricing",
      secondaryLabel: "See e-commerce websites",
      secondaryUrl: "/e-commerce",
    },
  },
  costComparison: {
    title: "What a website really costs",
    rows: [
      { option: "Do it yourself", price: "$20–$40/mo, plus 30–60 hours of your time", outcome: "A template site you maintain yourself" },
      { option: "Traditional agency", price: "$3,000–$7,000+ upfront", outcome: "A finished site, then hourly bills for every change" },
      { option: "AppleSeed Sites", price: "From $99/mo", outcome: "A custom site, plus a developer who keeps it fast and updated" },
    ],
  },
  guarantee: {
    title: "Love your design, or you don't pay setup.",
    description: "If you're not happy with your homepage design after 2 rounds of revisions, I'll refund your setup fee in full.",
  },
  faq: {
    title: "Pricing questions",
    items: [
      [
        "What counts as a change request?",
        "Any edit that takes under 30 minutes: new hours, photos, prices, text, or a new team member. Bigger work, like a new page or feature, is quoted before I start.",
      ],
      [
        "What happens if I cancel?",
        "Once setup is paid, cancel with 30 days' notice. Your domain and content stay yours, and you can buy the site's code for a one-time fee equal to your setup fee.",
      ],
      [
        "How does $0 down work?",
        "Your setup fee is spread over your first 12 months. After that, you pay the regular monthly price. Cancel early and you owe only the unpaid part of the setup fee.",
      ],
      ["Do I own my domain and content?", "Yes. Your domain is registered in your name, and your text, photos, and logo are always yours."],
      ["Can I switch plans?", "Yes. Upgrade anytime; you pay only the difference in setup. Downgrades take effect next billing month."],
      ["Are hosting and SSL extra?", "No. Hosting, SSL, backups, and security updates are included in every plan."],
      ["How long until my site is live?", "About 2 weeks for Spark, 3 for Elevate, and 4 for Momentum, once I have your content."],
    ].map(([question, answer]) => ({ question, answer })),
  },
  closingCta: {
    title: "Not sure which plan fits?",
    description: "Tell me about your business and I'll recommend one, free.",
    primaryLabel: "Get My Free Website Plan",
    primaryUrl: "/contact?from=pricing",
    secondaryLabel: "Call (240) 276-0695",
    secondaryUrl: "tel:+12402760695",
  },
  seo: {
    metaTitle: "Website Pricing for DMV Small Businesses | AppleSeed Sites",
    metaDescription: "Custom websites from $99/month with hosting, security and updates included. Pay setup upfront or choose $0 down.",
    noIndex: false,
  },
};

const LEAD_FORM = {
  hero: {
    eyebrow: "Free, no obligation",
    title: "Get your free website plan.",
    description:
      "Tell me about your business. Within 1 business day, I'll reply with a recommended plan, price, and timeline. No pressure.",
  },
  form: {
    nameLabel: "Name",
    contactLabel: "Email or phone",
    contactPlaceholder: "How should I reach you?",
    businessLabel: "Business name",
    websiteLabel: "Current website",
    websitePlaceholder: "Leave blank if you don't have one",
    needLabel: "What do you need?",
    needOptions: [
      { value: "new-website", label: "New website" },
      { value: "fix-site", label: "Fix my current site" },
      { value: "online-store", label: "Online store" },
      { value: "landing-page", label: "Landing page" },
      { value: "local-seo", label: "Local SEO" },
      { value: "site-review", label: "Free site review" },
      { value: "not-sure", label: "Not sure yet" },
    ],
    messageLabel: "Anything else I should know?",
    submitLabel: "Get My Free Website Plan",
    underButtonText: "I reply within 1 business day.",
    privacyText: "By submitting, you agree to our Privacy Policy.",
  },
  nextSteps: {
    title: "What happens next",
    steps: [
      { title: "I review your business", body: "I look at your business, your competitors, and your current site if you have one." },
      { title: "You get a plan", body: "A recommended plan, price, and timeline, by email or on a quick call." },
      { title: "You decide", body: "Nothing starts until you say go. No pressure, no follow-up spam." },
    ],
  },
  seo: {
    metaTitle: "Get a Free Website Plan | AppleSeed Sites, Maryland",
    metaDescription: "Tell me about your business and get a free website plan within 1 business day. Or call (240) 276-0695.",
    noIndex: false,
  },
};

const THANK_YOU_PAGE = {
  hero: {
    title: "Got it. I'll be in touch within 1 business day.",
    description: "Want to skip the wait? Book a 15-minute call now.",
  },
  schedulerUrl: "https://cal.com/PLACEHOLDER",
  prepare: {
    title: "What to have ready for our call",
    items: features([
      "Your business name and services",
      "A few websites you like",
      "Your logo and photos, if you have them",
      "Your current website login, if you have one",
    ]),
  },
  links: [
    { label: "Browse live templates", url: "/templates" },
    { label: "Read client results", url: "/testimonials" },
  ],
  seo: { metaTitle: "Thanks | AppleSeed Sites", metaDescription: null, noIndex: true },
};

/* ---------- helpers ---------- */

const hasDraftAndPublish = (strapi, uid) => Boolean(strapi.contentTypes[uid].options?.draftAndPublish);

async function save(strapi, uid, existing, data, label) {
  const docs = strapi.documents(uid);
  const doc = existing
    ? await docs.update({ documentId: existing.documentId, data, status: "draft" })
    : await docs.create({ data, status: "draft" });
  if (hasDraftAndPublish(strapi, uid)) await docs.publish({ documentId: doc.documentId });
  console.log(`  ${existing ? "updated" : "created"} ${label}`);
}

async function upsertBy(strapi, uid, field, data) {
  const existing = await strapi.documents(uid).findFirst({ filters: { [field]: data[field] }, status: "draft" });
  await save(strapi, uid, existing, data, `${uid} "${data[field]}"`);
}

async function upsertSingle(strapi, uid, data) {
  const existing = await strapi.documents(uid).findFirst({ status: "draft" });
  await save(strapi, uid, existing, data, uid);
}

/** Leads are written only by the site's API token; the Public role must never read them. */
async function removePublicLeadAccess(strapi) {
  const role = await strapi.db.query("plugin::users-permissions.role").findOne({ where: { type: "public" } });
  if (!role) return;
  const permissions = strapi.db.query("plugin::users-permissions.permission");
  const leadPerms = await permissions.findMany({ where: { action: { $startsWith: "api::lead.lead." }, role: role.id } });
  for (const p of leadPerms) {
    await permissions.delete({ where: { id: p.id } });
    console.log(`  removed Public ${p.action}`);
  }
}

/* ---------- run ---------- */

async function main() {
  if (process.env.NODE_ENV === "production" && !FORCE) {
    console.error("Refusing to seed with NODE_ENV=production. Re-run with --force if you really mean it.");
    process.exit(1);
  }

  const ctx = await compileStrapi();
  const strapi = await createStrapi(ctx).load();
  strapi.log.level = "error";

  const client = strapi.config.get("database.connection.client");
  if (!["sqlite", "better-sqlite3"].includes(client) && !FORCE) {
    console.error(`Refusing to seed a "${client}" database (not local SQLite). Re-run with --force if that's intended.`);
    await strapi.destroy();
    process.exit(1);
  }

  console.log(`Seeding pricing and forms into the ${client} database…`);
  for (const plan of PLANS) await upsertBy(strapi, "api::plan.plan", "slug", plan);
  for (const addOn of ADD_ONS) await upsertBy(strapi, "api::add-on.add-on", "name", addOn);
  await upsertSingle(strapi, "api::pricing-page.pricing-page", PRICING_PAGE);
  await upsertSingle(strapi, "api::lead-form.lead-form", LEAD_FORM);
  await upsertSingle(strapi, "api::thank-you-page.thank-you-page", THANK_YOU_PAGE);
  console.log("Permissions:");
  await removePublicLeadAccess(strapi);
  console.log("Done.");

  await strapi.destroy();
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
