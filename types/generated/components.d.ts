import type { Schema, Struct } from '@strapi/strapi';

export interface CustomAboutSection extends Struct.ComponentSchema {
  collectionName: 'components_custom_about_sections';
  info: {
    displayName: 'aboutSection';
  };
  attributes: {
    body: Schema.Attribute.RichText;
    bulletPoint: Schema.Attribute.Component<'custom.bullet-point', true>;
    button: Schema.Attribute.Component<'layout.button', false>;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    imageRight: Schema.Attribute.Boolean;
    title: Schema.Attribute.String;
  };
}

export interface CustomBulletPoint extends Struct.ComponentSchema {
  collectionName: 'components_custom_bullet_points';
  info: {
    displayName: 'bulletPoint';
  };
  attributes: {
    darkIcon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    lightIcon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    text: Schema.Attribute.RichText;
  };
}

export interface CustomBusinessSection extends Struct.ComponentSchema {
  collectionName: 'components_custom_business_sections';
  info: {
    displayName: 'businessSection';
  };
  attributes: {
    body: Schema.Attribute.RichText;
    bulletPoint: Schema.Attribute.Component<'custom.bullet-point', true>;
    button: Schema.Attribute.Component<'layout.button', true>;
    imageRight: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    sliderImages: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    tag: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface CustomCard extends Struct.ComponentSchema {
  collectionName: 'components_custom_cards';
  info: {
    displayName: 'card';
  };
  attributes: {
    darkIcon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    lightIcon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    name: Schema.Attribute.String;
    subname: Schema.Attribute.String;
    testimonial: Schema.Attribute.Text;
  };
}

export interface CustomContactLink extends Struct.ComponentSchema {
  collectionName: 'components_custom_contact_links';
  info: {
    displayName: 'contactLink';
  };
  attributes: {
    darkIcon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    lightIcon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    text: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface CustomContactSection extends Struct.ComponentSchema {
  collectionName: 'components_custom_contact_sections';
  info: {
    displayName: 'contactSection';
  };
  attributes: {
    bulletPoint: Schema.Attribute.Component<'custom.bullet-point', true>;
    darkIcon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    description: Schema.Attribute.Text;
    embed: Schema.Attribute.Text;
    lightIcon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    link: Schema.Attribute.Component<'custom.contact-link', true>;
    subtitle: Schema.Attribute.String;
    supportingTitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface CustomFaq extends Struct.ComponentSchema {
  collectionName: 'components_custom_faqs';
  info: {
    description: 'Frequently asked questions. Also published to Google as FAQ structured data.';
    displayName: 'faq';
  };
  attributes: {
    button: Schema.Attribute.Component<'layout.button', false>;
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    faqItem: Schema.Attribute.Component<'layout.faq-item', true>;
    title: Schema.Attribute.String;
  };
}

export interface CustomFeatures extends Struct.ComponentSchema {
  collectionName: 'components_custom_features';
  info: {
    displayName: 'features';
  };
  attributes: {
    body: Schema.Attribute.Text;
    button: Schema.Attribute.Component<'layout.button', false>;
    eyebrow: Schema.Attribute.String;
    featuresCard: Schema.Attribute.Component<'custom.features-card', true>;
    title: Schema.Attribute.String;
  };
}

export interface CustomFeaturesCard extends Struct.ComponentSchema {
  collectionName: 'components_custom_features_cards';
  info: {
    displayName: 'featuresCard';
  };
  attributes: {
    body: Schema.Attribute.Text;
    button: Schema.Attribute.Component<'layout.button', true>;
    icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    title: Schema.Attribute.String;
  };
}

export interface CustomHero extends Struct.ComponentSchema {
  collectionName: 'components_custom_heroes';
  info: {
    displayName: 'hero';
  };
  attributes: {
    button: Schema.Attribute.Component<'layout.button', true>;
    eyebrow: Schema.Attribute.String;
    header: Schema.Attribute.String;
    heroImage: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    text: Schema.Attribute.Text;
    trust: Schema.Attribute.Component<'layout.trust-item', true>;
  };
}

export interface CustomLeadForm extends Struct.ComponentSchema {
  collectionName: 'components_custom_lead_forms';
  info: {
    description: 'Free website plan form. The fields (name, business, email or phone, has a website) are fixed in the frontend; submissions are saved as Leads.';
    displayName: 'leadForm';
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

export interface CustomOurWork extends Struct.ComponentSchema {
  collectionName: 'components_custom_our_works';
  info: {
    displayName: 'ourWork';
  };
  attributes: {
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    portfolioCard: Schema.Attribute.Component<'layout.portfolio-card', true>;
    title: Schema.Attribute.String;
  };
}

export interface CustomPerformance extends Struct.ComponentSchema {
  collectionName: 'components_custom_performances';
  info: {
    displayName: 'performance';
  };
  attributes: {
    bulletPoint: Schema.Attribute.Component<'custom.bullet-point', true>;
    button: Schema.Attribute.Component<'layout.button', false>;
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    stat: Schema.Attribute.Component<'layout.stat', true>;
  };
}

export interface CustomPricing extends Struct.ComponentSchema {
  collectionName: 'components_custom_pricings';
  info: {
    displayName: 'Pricing';
  };
  attributes: {
    card: Schema.Attribute.Component<'layout.pricing-cards', true>;
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String;
  };
}

export interface CustomSteps extends Struct.ComponentSchema {
  collectionName: 'components_custom_steps';
  info: {
    description: 'Numbered process (e.g. "Live in 3 simple steps"). Numbers come from the order of the steps.';
    displayName: 'steps';
  };
  attributes: {
    button: Schema.Attribute.Component<'layout.button', false>;
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    step: Schema.Attribute.Component<'layout.step', true>;
    title: Schema.Attribute.String;
  };
}

export interface CustomTestimonials extends Struct.ComponentSchema {
  collectionName: 'components_custom_testimonials';
  info: {
    displayName: 'Testimonials';
  };
  attributes: {
    button: Schema.Attribute.Component<'layout.button', false>;
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    testimonialCards: Schema.Attribute.Component<'custom.card', true>;
    title: Schema.Attribute.String;
  };
}

export interface LayoutButton extends Struct.ComponentSchema {
  collectionName: 'components_layout_buttons';
  info: {
    displayName: 'button';
  };
  attributes: {
    title: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface LayoutFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_layout_faq_items';
  info: {
    displayName: 'faqItem';
  };
  attributes: {
    answer: Schema.Attribute.RichText;
    question: Schema.Attribute.String;
  };
}

export interface LayoutPortfolioCard extends Struct.ComponentSchema {
  collectionName: 'components_layout_portfolio_cards';
  info: {
    displayName: 'portfolioCard';
  };
  attributes: {
    buttonText: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    result: Schema.Attribute.String;
    tag: Schema.Attribute.String;
    title: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface LayoutPricingCards extends Struct.ComponentSchema {
  collectionName: 'components_layout_pricing_cards';
  info: {
    displayName: 'pricingCards';
  };
  attributes: {
    bulletPoint: Schema.Attribute.Component<'custom.bullet-point', true>;
    cta: Schema.Attribute.Component<'layout.button', true>;
    description: Schema.Attribute.Text;
    pointsIntro: Schema.Attribute.String;
    price: Schema.Attribute.Decimal;
    priceText: Schema.Attribute.String;
    setupFee: Schema.Attribute.Decimal;
    title: Schema.Attribute.String;
  };
}

export interface LayoutStat extends Struct.ComponentSchema {
  collectionName: 'components_layout_stats';
  info: {
    displayName: 'stat';
  };
  attributes: {
    number: Schema.Attribute.String;
    text: Schema.Attribute.String;
  };
}

export interface LayoutStep extends Struct.ComponentSchema {
  collectionName: 'components_layout_steps';
  info: {
    displayName: 'step';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface LayoutTrustItem extends Struct.ComponentSchema {
  collectionName: 'components_layout_trust_items';
  info: {
    description: 'Small proof point under the hero buttons. Turn on "stars" to show a 5-star rating instead of the icon.';
    displayName: 'trustItem';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images'>;
    stars: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    text: Schema.Attribute.String;
  };
}

export interface MenuDropdown extends Struct.ComponentSchema {
  collectionName: 'components_menu_dropdowns';
  info: {
    displayName: 'Dropdown';
    icon: 'arrowDown';
  };
  attributes: {
    menuLink: Schema.Attribute.Component<'menu.menu-link', true>;
    sections: Schema.Attribute.Relation<'oneToMany', 'api::section.section'>;
    title: Schema.Attribute.String;
  };
}

export interface MenuLink extends Struct.ComponentSchema {
  collectionName: 'components_menu_links';
  info: {
    displayName: 'link';
    icon: 'link';
  };
  attributes: {
    darkIcon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    description: Schema.Attribute.Text;
    LightIcon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    name: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface MenuMenuButton extends Struct.ComponentSchema {
  collectionName: 'components_menu_menu_buttons';
  info: {
    displayName: 'menuButton';
    icon: 'cursor';
  };
  attributes: {
    text: Schema.Attribute.String;
    type: Schema.Attribute.Enumeration<['primary', 'secondary']>;
    url: Schema.Attribute.String;
  };
}

export interface MenuMenuLink extends Struct.ComponentSchema {
  collectionName: 'components_menu_menu_links';
  info: {
    displayName: 'menuLink';
    icon: 'link';
  };
  attributes: {
    title: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'custom.about-section': CustomAboutSection;
      'custom.bullet-point': CustomBulletPoint;
      'custom.business-section': CustomBusinessSection;
      'custom.card': CustomCard;
      'custom.contact-link': CustomContactLink;
      'custom.contact-section': CustomContactSection;
      'custom.faq': CustomFaq;
      'custom.features': CustomFeatures;
      'custom.features-card': CustomFeaturesCard;
      'custom.hero': CustomHero;
      'custom.lead-form': CustomLeadForm;
      'custom.our-work': CustomOurWork;
      'custom.performance': CustomPerformance;
      'custom.pricing': CustomPricing;
      'custom.steps': CustomSteps;
      'custom.testimonials': CustomTestimonials;
      'layout.button': LayoutButton;
      'layout.faq-item': LayoutFaqItem;
      'layout.portfolio-card': LayoutPortfolioCard;
      'layout.pricing-cards': LayoutPricingCards;
      'layout.stat': LayoutStat;
      'layout.step': LayoutStep;
      'layout.trust-item': LayoutTrustItem;
      'menu.dropdown': MenuDropdown;
      'menu.link': MenuLink;
      'menu.menu-button': MenuMenuButton;
      'menu.menu-link': MenuMenuLink;
    }
  }
}
