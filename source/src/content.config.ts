import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const scenarioId = z.enum(['services', 'distribution', 'manufacturing']);

/** Case studies: one Markdown file per case in src/content/cases/. */
const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: ({ image }) =>
    z.object({
      /** Page title; " | Evenmont" is appended, so keep it to 49 characters. */
      title: z.string().max(49),
      description: z.string().max(160),
      /** Sample content: shows a "Sample" label and triggers the build warning. */
      placeholder: z.boolean().default(false),
      /** Invented for the pre-release preview: no label on the site, but listed by the build report. */
      demo: z.boolean().default(false),
      scenario: scenarioId,
      order: z.number().default(0),
      company: z.string(),
      profile: z.object({ industry: z.string(), size: z.string(), state: z.string() }),
      result: z.object({ number: z.string(), label: z.string() }),
      headline: z.string(),
      beforeAfter: z.object({ before: z.string(), after: z.string() }),
      apps: z.array(z.string()),
      integrations: z.array(z.string()).default([]),
      timeline: z.string(),
      pricingModel: z.string(),
      quote: z.object({ text: z.string(), name: z.string(), role: z.string(), photo: image().optional() }),
      cover: image(),
      coverAlt: z.string(),
      results: z
        .array(z.object({ metric: z.string(), before: z.string(), after: z.string(), measured: z.string() }))
        .default([]),
      /** Screens with client data blurred. Without `image`, an on-brand SVG mock of `kind` is shown. */
      screenshots: z
        .array(
          z.object({
            image: image().optional(),
            kind: z.enum(['projects', 'timesheets', 'inventory', 'orders', 'production', 'costing']).default('projects'),
            caption: z.string(),
          }),
        )
        .default([]),
      whatsNext: z.string().optional(),
      /** Shows the "Talk to this client" call to action. Only with the client's permission. */
      referenceCall: z.boolean().default(false),
      /** Co-delivery with the client's accountant: listed as proof on /partners. */
      coDelivery: z.boolean().default(false),
      accountantQuote: z.object({ text: z.string(), name: z.string(), firm: z.string() }).optional(),
    }),
});

/** FAQ lists: one JSON file per page in src/content/faq/. */
const faq = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/faq' }),
  schema: z.object({
    title: z.string(),
    items: z.array(z.object({ q: z.string(), a: z.string() })).min(1),
  }),
});

/** The three scenarios (services, distribution, manufacturing). */
const scenarios = defineCollection({
  loader: file('src/content/scenarios.json'),
  schema: z.object({
    id: scenarioId,
    order: z.number(),
    name: z.string(),
    tab: z.string(),
    chip: z.string(),
    profile: z.string(),
    seo: z.object({ title: z.string().max(60), description: z.string().max(160) }),
    h1: z.string(),
    sumPhrase: z.string(),
    sub: z.string(),
    pains: z.array(z.string()).length(3),
    outcomes: z.array(z.string()),
    beforeAfter: z.array(z.object({ today: z.string(), after: z.string(), icon: z.string().optional() })),
    apps: z.array(z.string()),
    integrations: z.array(z.string()),
    card: z.object({ apps: z.string(), outcome: z.string() }),
    package: z.string(),
    image: z.string(),
    imageAlt: z.string(),
  }),
});

const packageSchema = z.object({
  id: z.string(),
  name: z.string(),
  for: z.string(),
  includes: z.array(z.string()),
  price: z.number().nullable(),
  priceLabel: z.string().optional(),
  unit: z.string().optional(),
  scenario: scenarioId.optional(),
});

/** ⚑ Business terms: prices, fees, timelines, promises — one file, one entry ("terms"). */
const terms = defineCollection({
  loader: file('src/content/terms.json', {
    parser: (text) => ({ terms: JSON.parse(text) }),
  }),
  schema: z.object({
    vars: z.record(z.string(), z.string()),
    process: z.object({
      steps: z.array(z.object({ id: z.string(), name: z.string(), get: z.string(), time: z.string(), price: z.string() })).length(5),
      note: z.string(),
    }),
    packages: z.array(packageSchema),
    licensesNote: z.string(),
    guarantees: z.array(z.string()),
    calculator: z.object({ people: z.number(), hours: z.number(), rate: z.number(), weeks: z.number() }),
    partner: z.object({
      feeRate: z.number().min(0).max(1),
      whatYouGet: z.array(z.string()),
      economics: z.array(
        z.object({ label: z.string(), projectLabel: z.string(), projectAmount: z.number(), keepMonths: z.number() }),
      ),
      coDelivery: z.string(),
    }),
    whiteLabel: z.object({
      commercials: z.array(z.object({ title: z.string(), text: z.string() })),
      payment: z.string(),
      capacity: z.string(),
    }),
    comparison: z.object({
      columns: z.array(z.string()).length(4),
      rows: z.array(
        z.object({
          label: z.string(),
          values: z.array(z.string()).length(4),
          marks: z.array(z.enum(['yes', 'no', 'partial'])).length(4).optional(),
          kind: z.enum(['check', 'cost', 'time', 'dots', 'text']).default('text'),
          scores: z.array(z.number().min(0).max(3)).length(4).optional(),
        }),
      ),
    }),
  }),
});

export const collections = { cases, faq, scenarios, terms };
