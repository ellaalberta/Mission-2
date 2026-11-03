# Table Time Pricing and Cost Laboratory

Mission 3 adds a browser-only pricing laboratory at `/Mission-2/laboratory/`. The existing Mission 2 dashboard remains at the repository root. The original venture website at https://ellaalberta.github.io/Creative-website/ is not modified.

## Using the laboratory

1. Review the venture assumptions and 22 suggested expenses. Published supplier rates are distinguished from estimates, illustrative placeholders, and student edits.
2. Edit costs, billing periods, allocations, plan prices, and assumed average active dining halls.
3. Inspect break-even, price sensitivity, cost categories, volume scenarios, and the original competitor research.
4. Evaluate your pricing decision. Revise inputs as needed; any input change invalidates the prior review and confirmation.
5. Write your own justification, acknowledge major warnings if present, and confirm.
6. Prepare the Word report and JSON, then click each **Save** link. Both use the exact confirmed snapshot. The laboratory never confirms a decision automatically.

Your model is stored locally in this browser. Export the working configuration for backup; import restores inputs and requires a fresh evaluation. The full decision exports contain private financial assumptions. Only `publicWebsiteData` is intended for future public pricing-page integration. No user inputs are sent to a server.

## Model

- All operating results are monthly USD accrual estimates. Annual subscriptions and annual fixed/per-hall costs are divided by 12.
- Quantity means average active dining halls, not new customers or student users. Monthly and annual plans use the same hall unit.
- Recurring fixed costs, per-hall costs, revenue-percentage fees, and per-payment fees are supported. Payment fees assume one charge per hall billing period.
- Startup cash is separate. An optional positive amortization life adds straight-line monthly cost with zero residual; no accounting or tax eligibility is implied.
- Shared fixed overhead is allocated by revenue, hall count, or equally for product reporting. Business totals count each expense once.
- Multi-plan break-even retains the entered quantity mix. Rounded equivalent halls are not an exact integer purchasing mix. At zero multi-plan volume, the mix is undefined. Nonpositive contribution never yields finite break-even.
- Price sensitivity holds volumes constant. Volume and operating scenarios are assumptions, not forecasts.
- Risk classifications are explicit teaching rules, not probabilities of failure. Base operating loss or undefined/nonpositive weighted contribution is classified as financially unsustainable under the selected assumptions. Stress tests use 20% lower volume and 10% higher costs.

## Data and evidence

`data/competitors.json` is the original Mission 1 dataset: 4 competitors, 16 offers, and 3 priced comparable indirect representatives. Prices were checked October 27, 2026. The direct competitor Occuspace remains quote-only. Different capacities and product scopes are disclosed.

`data/defaults.js` contains venture-specific assumptions and sources checked October 30, 2026:

- Cloudflare Workers paid minimum: https://developers.cloudflare.com/workers/platform/pricing/
- Supabase Pro starting rate: https://supabase.com/pricing
- US domestic card fees: https://stripe.com/pricing
- BLS software developer wage reference: https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm

Labor hours, insurance, support, integration, data access and other operating amounts are estimates or illustrative placeholders. Published wages are not contractor quotes. The initial $80 price and 10-hall volume are unconfirmed scenarios.

## Development

No installation, API keys, paid API, backend, or database is needed for this application. It uses native ES modules, SVG charts, and vendored `docx` 9.6.1 (license in `vendor/DOCX-LICENSE`). Fonts are optional Google Fonts with system fallbacks. Future venture cloud costs are modeled expenses; the laboratory itself does not call those services.

From this directory, with Node 22 or newer:

```sh
npm test
npm run build
npm run preview
```

The preview uses http://127.0.0.1:4188/. Production assets use relative URLs for subdirectory deployment. The root repository workflow tests both applications and packages this directory into `dist/laboratory/`.

`?test=1` opens an isolated QA session that does not load or save normal browser storage. QA confirmations are test fixtures and must never be used as the student's decision.
