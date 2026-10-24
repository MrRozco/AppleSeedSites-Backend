/**
 * Seeds placeholder content for the new design components into the homepage and footer.
 *
 *   npm run seed:placeholders                 (local SQLite database only)
 *   npm run seed:placeholders -- --allow-remote   (any database configured in .env)
 *
 * Safe to run more than once. It only fills fields that are empty and adds sections that
 * are missing; it never overwrites content an editor has written. Text in [square brackets]
 * is placeholder copy from the design that still needs a real value before launch.
 */
const { compileStrapi, createStrapi } = require("@strapi/strapi");

const PLACEHOLDERS = {
  heroButtons: [
    { title: "Get My Free Website Plan", url: "#get-plan" },
    { title: "See Pricing", url: "#pricing" },
  ],
  heroTrust: [
    { stars: true, text: "[on Google]" },
    { stars: false, text: "Serving the entire DMV" },
    { stars: false, text: "[No long-term contracts]" },
  ],
  paths: {
    __component: "custom.features",
    title: "Where’s your business today?",
    featuresCard: [
      {
        title: "No website yet?",
        body: "Customers search before they call. If they can’t find you, they call someone else. We’ll get you online and on Google Maps fast.",
        button: [{ title: "Get a Free Homepage Preview", url: "#get-plan" }],
      },
      {
        title: "Website not working?",
        body: "Slow, outdated, or invisible on Google? We’ll audit your site for free and show you exactly what’s costing you customers.",
        button: [{ title: "Get a Free Site Audit", url: "#get-plan" }],
      },
    ],
  },
  steps: {
    __component: "custom.steps",
    title: "Live in 3 simple steps",
    step: [
      { title: "Free 15-minute call", body: "Tell us about your business, and we’ll recommend the right plan." },
      { title: "We design and build", body: "Review a draft, request changes, and approve. No guesswork." },
      { title: "Launch and grow", body: "We handle hosting, security, and updates. You focus on customers." },
    ],
    button: { title: "Book My Free Call", url: "/contact" },
  },
  pricingCards: {
    spark: { setupFee: 797 },
    momentum: { setupFee: 997, pointsIntro: "Everything in Spark, plus:" },
    elevate: { setupFee: 1997, pointsIntro: "Everything in Momentum, plus:" },
  },
  testimonialsButton: { title: "Read our Google reviews", url: "https://g.page/r/REPLACE-WITH-REVIEW-LINK" },
  faq: {
    __component: "custom.faq",
    title: "Questions? We’ve got answers.",
    button: { title: "Ask us anything", url: "/contact" },
    faqItem: [
      { question: "How much does a website cost?", answer: "<p>Plans start at $99/month plus a one-time $797 setup fee. Hosting, security, and updates are included, so there are no surprise bills.</p>" },
      { question: "How long does it take?", answer: "<p>Most sites launch in [2–3 weeks], depending on the plan and how quickly we get your content.</p>" },
      { question: "Do I own my website?", answer: "<p>[Your actual terms: who owns the domain and content, and what happens if they leave.]</p>" },
      { question: "Can I cancel?", answer: "<p>[Your terms, e.g. “Yes. After your first X months, cancel anytime with 30 days’ notice.”]</p>" },
      { question: "Can I update the site myself?", answer: "<p>On the Elevate plan, you can edit anything yourself in minutes, no code needed. On every plan, just email us a change and we’ll handle it.</p>" },
      { question: "What areas do you serve?", answer: "<p>We serve small businesses across the DMV, including Washington, DC; Rockville, Silver Spring, Bethesda, and [Southern Maryland towns] in Maryland; and Arlington, Alexandria, Fairfax, Tysons, and Reston in Virginia. We also work remotely with businesses anywhere.</p>" },
    ],
  },
  leadForm: {
    __component: "custom.lead-form",
    title: "Ready to get more customers from your website?",
    description: "Get a free website plan. No pressure, no obligation. We reply within [1 business day].",
    submitLabel: "Get My Free Plan",
    successTitle: "Thanks! Your free plan is on its way.",
    successText: "We’ll reach out within [1 business day] by email or phone.",
  },
  footerServiceArea: { text: "Proudly serving Washington, DC, Maryland & Virginia" },
};

/* ---------- helpers ---------- */

const isEmpty = (v) => v == null || v === "" || (Array.isArray(v) && v.length === 0);

/** Deep populate for every component, dynamic zone and media field of a schema. */
function populateFor(strapi, schema) {
  const populate = {};
  for (const [name, attr] of Object.entries(schema.attributes)) {
    if (attr.type === "media" || attr.type === "relation") populate[name] = true;
    if (attr.type === "component") populate[name] = { populate: populateFor(strapi, strapi.components[attr.component]) };
    if (attr.type === "dynamiczone") {
      populate[name] = { on: Object.fromEntries(attr.components.map((uid) => [uid, { populate: populateFor(strapi, strapi.components[uid]) }])) };
    }
  }
  return populate;
}

/** Turns populated output back into update input: media → id, relations → ids, metadata dropped. */
function toInput(value) {
  if (Array.isArray(value)) return value.map(toInput);
  if (value && typeof value === "object") {
    if (value.mime && value.url) return value.id;
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (["documentId", "createdAt", "updatedAt", "publishedAt", "locale", "localizations"].includes(k)) continue;
      out[k] = v && typeof v === "object" && !Array.isArray(v) && v.documentId && !v.__component ? v.id : toInput(v);
    }
    return out;
  }
  return value;
}

async function updateSingleType(strapi, uid, mutate) {
  const schema = strapi.contentTypes[uid];
  const populate = populateFor(strapi, schema);
  const docs = strapi.documents(uid);
  const doc = await docs.findFirst({ populate, status: "draft" });
  if (!doc) {
    console.log(`- ${uid}: no entry yet, skipped`);
    return;
  }
  const data = toInput(doc);
  const changes = mutate(data);
  if (!changes.length) {
    console.log(`- ${uid}: already has everything, nothing to do`);
    return;
  }
  delete data.id;
  await docs.update({ documentId: doc.documentId, data, status: "draft" });
  if (schema.options?.draftAndPublish) await docs.publish({ documentId: doc.documentId });
  console.log(`- ${uid}:`);
  changes.forEach((c) => console.log(`    ${c}`));
}

/* ---------- content changes ---------- */

function seedHomepage(home) {
  const changes = [];
  const content = Array.isArray(home.content) ? home.content : (home.content = []);
  const find = (type, pred = () => true) => content.find((c) => c.__component === type && pred(c));
  const indexOf = (type) => content.findIndex((c) => c.__component === type);

  const hero = find("custom.hero");
  if (hero) {
    if (isEmpty(hero.button)) {
      hero.button = PLACEHOLDERS.heroButtons;
      changes.push("hero: added CTA buttons");
    }
    if (isEmpty(hero.trust)) {
      hero.trust = PLACEHOLDERS.heroTrust;
      changes.push("hero: added trust row");
    }
  }

  if (!find("custom.features", (c) => c.title === PLACEHOLDERS.paths.title)) {
    content.splice(indexOf("custom.hero") + 1, 0, PLACEHOLDERS.paths);
    changes.push("added \"Where’s your business today?\" features section after the hero");
  }

  if (!find("custom.steps")) {
    const afterWork = indexOf("custom.our-work");
    content.splice(afterWork >= 0 ? afterWork + 1 : content.length, 0, PLACEHOLDERS.steps);
    changes.push("added steps section");
  }

  const pricing = find("custom.pricing");
  for (const card of pricing?.card || []) {
    const extra = PLACEHOLDERS.pricingCards[(card.title || "").trim().toLowerCase()];
    if (!extra) continue;
    for (const [field, value] of Object.entries(extra)) {
      if (isEmpty(card[field])) {
        card[field] = value;
        changes.push(`pricing "${card.title}": set ${field}`);
      }
    }
  }

  const testimonials = find("custom.testimonials");
  if (testimonials && isEmpty(testimonials.button)) {
    testimonials.button = PLACEHOLDERS.testimonialsButton;
    changes.push("testimonials: added reviews button");
  }

  if (!find("custom.faq")) {
    content.push(PLACEHOLDERS.faq);
    changes.push("added FAQ section");
  }
  if (!find("custom.lead-form")) {
    content.push(PLACEHOLDERS.leadForm);
    changes.push("added lead form section");
  }
  return changes;
}

function seedFooter(footer) {
  const links = Array.isArray(footer.contactLink) ? footer.contactLink : (footer.contactLink = []);
  if (links.some((l) => l.text === PLACEHOLDERS.footerServiceArea.text)) return [];
  links.push(PLACEHOLDERS.footerServiceArea);
  return ["footer: added service-area line (contact item without a link)"];
}

/* ---------- run ---------- */

async function main() {
  const ctx = await compileStrapi();
  const strapi = await createStrapi(ctx).load();
  strapi.log.level = "error";

  const client = strapi.config.get("database.connection.client");
  if (!["sqlite", "better-sqlite3"].includes(client) && !process.argv.includes("--allow-remote")) {
    console.error(`Refusing to seed a "${client}" database. Re-run with --allow-remote if that's intended.`);
    await strapi.destroy();
    process.exit(1);
  }

  console.log(`Seeding placeholders into the ${client} database…`);
  await updateSingleType(strapi, "api::homepage.homepage", seedHomepage);
  await updateSingleType(strapi, "api::footer.footer", seedFooter);
  console.log("Done. Text in [brackets] still needs a real value.");

  await strapi.destroy();
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
