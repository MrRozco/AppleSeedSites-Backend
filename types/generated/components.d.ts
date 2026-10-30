import type { Schema, Struct } from '@strapi/strapi';

export interface ElementsBullet extends Struct.ComponentSchema {
  collectionName: 'components_custom_bullet_points';
  info: {
    description: 'Short line with an optional icon (a check mark is used when empty).';
    displayName: 'Bullet point';
    icon: 'check';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images'>;
    text: Schema.Attribute.RichText;
  };
}

export interface ElementsContactLink extends Struct.ComponentSchema {
  collectionName: 'components_custom_contact_links';
  info: {
    description: 'Phone, email or address line. Leave the URL empty for plain text (e.g. the service area).';
    displayName: 'Contact item';
    icon: 'phone';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images'>;
    label: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ElementsFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_layout_faq_items';
  info: {
    displayName: 'FAQ item';
    icon: 'question';
  };
  attributes: {
    answer: Schema.Attribute.RichText;
    question: Schema.Attribute.String;
  };
}

export interface ElementsFeatureCard extends Struct.ComponentSchema {
  collectionName: 'components_custom_features_cards';
  info: {
    displayName: 'Feature card';
    icon: 'dashboard';
  };
  attributes: {
    buttons: Schema.Attribute.Component<'elements.link', true>;
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
  };
}

export interface ElementsLink extends Struct.ComponentSchema {
  collectionName: 'components_layout_buttons';
  info: {
    description: 'A button or link. URL: a path (/pricing), an #anchor, or a full https:// address (opens in a new tab).';
    displayName: 'Link';
    icon: 'link';
  };
  attributes: {
    label: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ElementsListItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_features';
  info: {
    description: 'One line of text in a checklist.';
    displayName: 'List item';
    icon: 'check';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ElementsPricingCard extends Struct.ComponentSchema {
  collectionName: 'components_layout_pricing_cards';
  info: {
    description: 'Price is a number; Price text replaces it when empty (e.g. "Custom").';
    displayName: 'Pricing card';
    icon: 'priceTag';
  };
  attributes: {
    bullets: Schema.Attribute.Component<'elements.bullet', true>;
    buttons: Schema.Attribute.Component<'elements.link', true>;
    description: Schema.Attribute.Text;
    pointsIntro: Schema.Attribute.String;
    price: Schema.Attribute.Decimal;
    priceText: Schema.Attribute.String;
    setupFee: Schema.Attribute.Decimal;
    title: Schema.Attribute.String;
  };
}

export interface ElementsProject extends Struct.ComponentSchema {
  collectionName: 'components_layout_portfolio_cards';
  info: {
    description: 'Tag example: "Landscaping \u00B7 Bethesda, MD". Result: one measurable outcome.';
    displayName: 'Portfolio project';
    icon: 'picture';
  };
  attributes: {
    buttonLabel: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    result: Schema.Attribute.String;
    tag: Schema.Attribute.String;
    title: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface ElementsStat extends Struct.ComponentSchema {
  collectionName: 'components_layout_stats';
  info: {
    description: 'A big number with a label, e.g. 0.8s / Average load time.';
    displayName: 'Stat';
    icon: 'chartBubble';
  };
  attributes: {
    label: Schema.Attribute.String;
    value: Schema.Attribute.String;
  };
}

export interface ElementsStep extends Struct.ComponentSchema {
  collectionName: 'components_layout_steps';
  info: {
    displayName: 'Step';
    icon: 'arrowRight';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface ElementsTestimonial extends Struct.ComponentSchema {
  collectionName: 'components_custom_cards';
  info: {
    description: 'A client quote. Business: e.g. "CybroSecurity, MD". Icon: the client\'s logo (optional; a quote mark is shown when empty).';
    displayName: 'Testimonial';
    icon: 'quote';
  };
  attributes: {
    business: Schema.Attribute.String;
    icon: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String;
    quote: Schema.Attribute.Text;
  };
}

export interface ElementsTrustItem extends Struct.ComponentSchema {
  collectionName: 'components_layout_trust_items';
  info: {
    description: 'Small proof point under the hero buttons. Turn on "stars" to show a 5-star rating instead of the icon.';
    displayName: 'Trust item';
    icon: 'shield';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images'>;
    stars: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    text: Schema.Attribute.String;
  };
}

export interface FormsLeadFormFields extends Struct.ComponentSchema {
  collectionName: 'components_forms_lead_form_fields';
  info: {
    description: 'Labels for the lead form on /contact and in every Lead form section. Need options: JSON array of { "value", "label" }; values must be Lead \u2192 need values.';
    displayName: 'Lead form fields';
    icon: 'pencil';
  };
  attributes: {
    businessLabel: Schema.Attribute.String;
    contactLabel: Schema.Attribute.String;
    contactPlaceholder: Schema.Attribute.String;
    messageLabel: Schema.Attribute.String;
    nameLabel: Schema.Attribute.String;
    needLabel: Schema.Attribute.String;
    needOptions: Schema.Attribute.JSON;
    privacyText: Schema.Attribute.String;
    submitLabel: Schema.Attribute.String;
    underButtonText: Schema.Attribute.String;
    websiteLabel: Schema.Attribute.String;
    websitePlaceholder: Schema.Attribute.String;
  };
}

export interface NavigationButton extends Struct.ComponentSchema {
  collectionName: 'components_menu_menu_buttons';
  info: {
    description: 'A highlighted button in the navbar.';
    displayName: 'Menu button';
    icon: 'cursor';
  };
  attributes: {
    label: Schema.Attribute.String;
    style: Schema.Attribute.Enumeration<['primary', 'secondary']> &
      Schema.Attribute.DefaultTo<'primary'>;
    url: Schema.Attribute.String;
  };
}

export interface NavigationDropdown extends Struct.ComponentSchema {
  collectionName: 'components_menu_dropdowns';
  info: {
    description: 'With mega menu columns it opens a mega menu; otherwise it lists the links.';
    displayName: 'Dropdown';
    icon: 'arrowDown';
  };
  attributes: {
    label: Schema.Attribute.String;
    links: Schema.Attribute.Component<'navigation.link', true>;
    sections: Schema.Attribute.Relation<'oneToMany', 'api::section.section'>;
  };
}

export interface NavigationLink extends Struct.ComponentSchema {
  collectionName: 'components_menu_menu_links';
  info: {
    displayName: 'Menu link';
    icon: 'link';
  };
  attributes: {
    label: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface NavigationMegaLink extends Struct.ComponentSchema {
  collectionName: 'components_menu_links';
  info: {
    displayName: 'Mega menu link';
    icon: 'link';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Media<'images'>;
    label: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface PricingAddOns extends Struct.ComponentSchema {
  collectionName: 'components_pricing_add_ons';
  info: {
    description: 'Heading for the Add-ons collection, plus the call-to-action band shown under it.';
    displayName: 'Add-ons';
    icon: 'plus';
  };
  attributes: {
    cta: Schema.Attribute.Component<'shared.cta', false>;
    title: Schema.Attribute.String;
  };
}

export interface PricingComparison extends Struct.ComponentSchema {
  collectionName: 'components_pricing_comparisons';
  info: {
    description: 'Rows of the plan comparison table. Each plan fills in its values under Plans \u2192 Comparison values.';
    displayName: 'Comparison table';
    icon: 'grid';
  };
  attributes: {
    features: Schema.Attribute.Component<'pricing.comparison-feature', true>;
    title: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Compare every feature'>;
  };
}

export interface PricingComparisonFeature extends Struct.ComponentSchema {
  collectionName: 'components_pricing_comparison_features';
  info: {
    description: 'Key must be unique and match plan.comparisonValues.featureKey (lowercase, numbers and dashes).';
    displayName: 'Comparison row';
    icon: 'bulletList';
  };
  attributes: {
    key: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PricingComparisonValue extends Struct.ComponentSchema {
  collectionName: 'components_pricing_comparison_values';
  info: {
    description: "This plan's value for one comparison row. Use \u2713 or \u2014 for yes/no.";
    displayName: 'Comparison value';
    icon: 'check';
  };
  attributes: {
    featureKey: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PricingCostComparison extends Struct.ComponentSchema {
  collectionName: 'components_pricing_cost_comparisons';
  info: {
    description: '"What a website really costs". A row whose option mentions AppleSeed is highlighted.';
    displayName: 'Cost comparison';
    icon: 'chartPie';
  };
  attributes: {
    rows: Schema.Attribute.Component<'pricing.cost-row', true>;
    title: Schema.Attribute.String;
  };
}

export interface PricingCostRow extends Struct.ComponentSchema {
  collectionName: 'components_pricing_cost_rows';
  info: {
    displayName: 'Cost row';
    icon: 'bulletList';
  };
  attributes: {
    option: Schema.Attribute.String;
    outcome: Schema.Attribute.String;
    price: Schema.Attribute.String;
  };
}

export interface PricingHero extends Struct.ComponentSchema {
  collectionName: 'components_pricing_heroes';
  info: {
    description: 'Page heading, the upfront / zero-down toggle labels, and the note under the plan cards.';
    displayName: 'Pricing hero';
    icon: 'priceTag';
  };
  attributes: {
    belowCardsNote: Schema.Attribute.Text;
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    title: Schema.Attribute.String;
    upfrontLabel: Schema.Attribute.String;
    zeroDownLabel: Schema.Attribute.String;
  };
}

export interface PricingPlanFinder extends Struct.ComponentSchema {
  collectionName: 'components_pricing_plan_finders';
  info: {
    description: '"Which plan is right for me?" rows.';
    displayName: 'Plan finder';
    icon: 'search';
  };
  attributes: {
    matches: Schema.Attribute.Component<'pricing.plan-match', true>;
    title: Schema.Attribute.String;
  };
}

export interface PricingPlanMatch extends Struct.ComponentSchema {
  collectionName: 'components_pricing_plan_matchs';
  info: {
    description: "Plan slug must match a Plan's slug (e.g. spark). The link is optional.";
    displayName: 'Plan match';
    icon: 'arrowRight';
  };
  attributes: {
    linkLabel: Schema.Attribute.String;
    linkUrl: Schema.Attribute.String;
    planSlug: Schema.Attribute.String;
    situation: Schema.Attribute.String;
  };
}

export interface SectionsFaq extends Struct.ComponentSchema {
  collectionName: 'components_custom_faqs';
  info: {
    description: 'Frequently asked questions. Also published to Google as FAQ structured data.';
    displayName: 'FAQ';
    icon: 'question';
  };
  attributes: {
    button: Schema.Attribute.Component<'elements.link', false>;
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    items: Schema.Attribute.Component<'elements.faq-item', true>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsFeatures extends Struct.ComponentSchema {
  collectionName: 'components_custom_features';
  info: {
    description: 'A heading with a grid of cards (icon, title, text, link).';
    displayName: 'Feature cards';
    icon: 'apps';
  };
  attributes: {
    button: Schema.Attribute.Component<'elements.link', false>;
    cards: Schema.Attribute.Component<'elements.feature-card', true>;
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: 'components_custom_heroes';
  info: {
    description: "Top of the page. The title is the page's only H1. The first button is the main call to action.";
    displayName: 'Hero';
    icon: 'star';
  };
  attributes: {
    buttons: Schema.Attribute.Component<'elements.link', true>;
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
    trustItems: Schema.Attribute.Component<'elements.trust-item', true>;
  };
}

export interface SectionsLeadForm extends Struct.ComponentSchema {
  collectionName: 'components_custom_lead_forms';
  info: {
    description: 'The free website plan form. Field labels come from the Contact page single type; submissions are saved as Leads.';
    displayName: 'Lead form';
    icon: 'envelop';
  };
  attributes: {
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    submitLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Get My Free Plan'>;
    successText: Schema.Attribute.Text &
      Schema.Attribute.DefaultTo<"We'll reach out within 1 business day by email or phone.">;
    successTitle: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Thanks! Your free plan is on its way.'>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsOurWork extends Struct.ComponentSchema {
  collectionName: 'components_custom_our_works';
  info: {
    description: "Client projects. Each card links to the client's live site. The optional button shows below the cards.";
    displayName: 'Portfolio';
    icon: 'briefcase';
  };
  attributes: {
    button: Schema.Attribute.Component<'elements.link', false>;
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    projects: Schema.Attribute.Component<'elements.project', true>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsPerformance extends Struct.ComponentSchema {
  collectionName: 'components_custom_performances';
  info: {
    description: 'Text, bullet points and stat tiles, with an optional image.';
    displayName: 'Performance & stats';
    icon: 'chartCircle';
  };
  attributes: {
    bullets: Schema.Attribute.Component<'elements.bullet', true>;
    button: Schema.Attribute.Component<'elements.link', false>;
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    stats: Schema.Attribute.Component<'elements.stat', true>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsPricing extends Struct.ComponentSchema {
  collectionName: 'components_custom_pricings';
  info: {
    description: 'On the homepage the cards come from the Plans collection; the cards here are only used when no plans are published. The button is shown centred below the cards.';
    displayName: 'Pricing';
    icon: 'priceTag';
  };
  attributes: {
    button: Schema.Attribute.Component<'elements.link', false>;
    cards: Schema.Attribute.Component<'elements.pricing-card', true>;
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SectionsSteps extends Struct.ComponentSchema {
  collectionName: 'components_custom_steps';
  info: {
    description: 'Numbered process (e.g. "Live in 3 simple steps"). Numbers follow the order of the steps.';
    displayName: 'Steps';
    icon: 'bulletList';
  };
  attributes: {
    button: Schema.Attribute.Component<'elements.link', false>;
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    steps: Schema.Attribute.Component<'elements.step', true>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsTestimonials extends Struct.ComponentSchema {
  collectionName: 'components_custom_testimonials';
  info: {
    description: 'Client quotes.';
    displayName: 'Testimonials';
    icon: 'quote';
  };
  attributes: {
    button: Schema.Attribute.Component<'elements.link', false>;
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    testimonials: Schema.Attribute.Component<'elements.testimonial', true>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsTextGallery extends Struct.ComponentSchema {
  collectionName: 'components_custom_business_sections';
  info: {
    description: 'Rich text beside a carousel of images. Anchor ID lets buttons link to this section (e.g. ecommerce \u2192 #ecommerce).';
    displayName: 'Text + image carousel';
    icon: 'landscape';
  };
  attributes: {
    anchorId: Schema.Attribute.String;
    body: Schema.Attribute.RichText;
    bullets: Schema.Attribute.Component<'elements.bullet', true>;
    buttons: Schema.Attribute.Component<'elements.link', true>;
    imageRight: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    images: Schema.Attribute.Media<'images', true>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsTextImage extends Struct.ComponentSchema {
  collectionName: 'components_custom_about_sections';
  info: {
    description: 'Rich text with an optional image beside it. Without an image it becomes a centred reading column (privacy policy, terms).';
    displayName: 'Text + image';
    icon: 'layout';
  };
  attributes: {
    body: Schema.Attribute.RichText;
    bullets: Schema.Attribute.Component<'elements.bullet', true>;
    button: Schema.Attribute.Component<'elements.link', false>;
    image: Schema.Attribute.Media<'images'>;
    imageRight: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    title: Schema.Attribute.String;
  };
}

export interface SharedChecklist extends Struct.ComponentSchema {
  collectionName: 'components_shared_checklists';
  info: {
    description: 'A heading with a list of check-marked items.';
    displayName: 'Checklist';
    icon: 'bulletList';
  };
  attributes: {
    items: Schema.Attribute.Component<'elements.list-item', true>;
    title: Schema.Attribute.String;
  };
}

export interface SharedCta extends Struct.ComponentSchema {
  collectionName: 'components_shared_ctas';
  info: {
    description: 'Deep-blue band with a heading, text and up to two buttons.';
    displayName: 'Call to action band';
    icon: 'cursor';
  };
  attributes: {
    description: Schema.Attribute.Text;
    primaryLabel: Schema.Attribute.String;
    primaryUrl: Schema.Attribute.String;
    secondaryLabel: Schema.Attribute.String;
    secondaryUrl: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SharedGuarantee extends Struct.ComponentSchema {
  collectionName: 'components_shared_guarantees';
  info: {
    description: 'A single highlighted promise.';
    displayName: 'Guarantee';
    icon: 'shield';
  };
  attributes: {
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedPageIntro extends Struct.ComponentSchema {
  collectionName: 'components_shared_page_intros';
  info: {
    description: 'Heading block at the top of a page.';
    displayName: 'Page intro';
    icon: 'hashtag';
  };
  attributes: {
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: 'Search and social preview. Aim for a title under 60 characters and a description under 160. Share image: 1200\u00D7630.';
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text;
    metaTitle: Schema.Attribute.String;
    noIndex: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'elements.bullet': ElementsBullet;
      'elements.contact-link': ElementsContactLink;
      'elements.faq-item': ElementsFaqItem;
      'elements.feature-card': ElementsFeatureCard;
      'elements.link': ElementsLink;
      'elements.list-item': ElementsListItem;
      'elements.pricing-card': ElementsPricingCard;
      'elements.project': ElementsProject;
      'elements.stat': ElementsStat;
      'elements.step': ElementsStep;
      'elements.testimonial': ElementsTestimonial;
      'elements.trust-item': ElementsTrustItem;
      'forms.lead-form-fields': FormsLeadFormFields;
      'navigation.button': NavigationButton;
      'navigation.dropdown': NavigationDropdown;
      'navigation.link': NavigationLink;
      'navigation.mega-link': NavigationMegaLink;
      'pricing.add-ons': PricingAddOns;
      'pricing.comparison': PricingComparison;
      'pricing.comparison-feature': PricingComparisonFeature;
      'pricing.comparison-value': PricingComparisonValue;
      'pricing.cost-comparison': PricingCostComparison;
      'pricing.cost-row': PricingCostRow;
      'pricing.hero': PricingHero;
      'pricing.plan-finder': PricingPlanFinder;
      'pricing.plan-match': PricingPlanMatch;
      'sections.faq': SectionsFaq;
      'sections.features': SectionsFeatures;
      'sections.hero': SectionsHero;
      'sections.lead-form': SectionsLeadForm;
      'sections.our-work': SectionsOurWork;
      'sections.performance': SectionsPerformance;
      'sections.pricing': SectionsPricing;
      'sections.steps': SectionsSteps;
      'sections.testimonials': SectionsTestimonials;
      'sections.text-gallery': SectionsTextGallery;
      'sections.text-image': SectionsTextImage;
      'shared.checklist': SharedChecklist;
      'shared.cta': SharedCta;
      'shared.guarantee': SharedGuarantee;
      'shared.page-intro': SharedPageIntro;
      'shared.seo': SharedSeo;
    }
  }
}
