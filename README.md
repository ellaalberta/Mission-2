# Table Time Competitive Pricing Intelligence

A static, accessible dashboard built from Mission 1 research. Four competitors, 16 pricing records, three paid representative benchmarks. No backend, keys, database, paid APIs or runtime dependencies. Native JavaScript modules and CSS make this small dataset reliable and easy to maintain. Google Fonts is optional; system fonts work offline.

## Run and build

Node 20+ is required only for development and building. No dependency installation is required.

```
npm test
npm run build
npm run preview
```

Preview: http://127.0.0.1:4187/Mission-2/ . Deploy the contents of `dist/`. Every asset uses a relative path; hash navigation supports refreshes under the GitHub Pages repository path.

## Publishing

Repository: https://github.com/ellaalberta/Mission-2

The included GitHub Actions workflow tests, builds and deploys `dist/`. In repository Settings → Pages, select **GitHub Actions** as the source. Push to `main` or manually run **Deploy pricing dashboard**. Expected URL: https://ellaalberta.github.io/Mission-2/ . This expected URL is not proof of successful publication.

## Data and methodology

`data/competitor_data.json` is an unchanged copy of the Mission 1 dataset, researched October 27, 2026. It was cross-checked against all five Excel worksheets and the Word report. The root and Phase 1 workbook copies differ in bytes but have identical cell values. No conflicting research values were found.

The representative cohort is P04, P10, P15: Waitwhile Business, Waitlist Me Pro and TablesReady Business on annual billing. Annual totals are divided by 12. Statistics: min 47.99, max 79, median 55, mean 60.663333 (USD/month equivalent). Occuspace is excluded because its institutional amount is unavailable. Seven paid annual offers supply tier ranges and the all-tier distribution. The full table retains all 16 records. Null never means zero; free plans, monthly billing duplicates and quote-only records do not enter comparable statistics. Optional messaging fees remain notes, not product offers.

Currency and billing time are normalized, but usage capacity and functionality are not equivalent. The explorer compares a per-hall proposed pilot price with software references; it is not a matched procurement quotation. Availability was not recorded and is not invented. Regular prices are advertised standard rates, not proven historical transaction prices. No temporary promotions were observed.

The explorer starts at $80, midpoint of the preliminary $60–$100 software-only range. Presets use the representative minimum, median and maximum. Prices outside the observed endpoints are below/above the researched range; inside, below/above the median are budget/premium oriented. Equal to the median is labeled separately. Comparable means equal to the cent. No demand, elasticity, sales, revenue or profit forecast is produced.

Position labels and opportunities come from Mission 1. Proposed differentiation is explicitly a hypothesis. Update the JSON and rerun validation/build to refresh the research. If IDs or cohort scope change, review the positioning mapping in `src/analytics.js` and accompanying narrative.

## Structure

- `src/analytics.js`: validation, normalization, statistics and positioning.
- `src/app.js`: navigation, charts, filters, comparisons and explorer.
- `src/style.css`: responsive dark interface with reduced-motion support.
- `tests/analytics.test.mjs`: meaningful calculations and integrity tests.
- `scripts/`: static production build and local preview server.
- `.github/workflows/pages.yml`: GitHub Pages deployment.

Source links open in new tabs with `noopener noreferrer`. Rendered research text is escaped. The static application does not collect information or send research to any analytics service.
