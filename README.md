# SWG Financial — Shearwater GeoServices D&A Dashboard

Interactive quarterly Depreciation & Amortisation dashboard for Shearwater GeoServices (2024–2026), built with React + Vite and deployed on Vercel.

## Features

- **D&A by Asset Class** — stacked bar chart showing vessel, seismic equipment, ROU, and MC library amortisation by quarter
- **Total D&A Trend** — line chart comparing total D&A vs. D&A excluding Multi-Client amortisation
- **Balance Sheet Values** — tangible asset carrying values over time
- **Depr. per Vessel/Day** — normalised daily depreciation rates per fleet vessel-day
- **Data Table** — full quarterly breakdown with annual totals

## Tech Stack

- [React 18](https://react.dev/)
- [Vite 6](https://vitejs.dev/)
- [Recharts](https://recharts.org/)

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Deployment (Vercel)

This project is configured for Vercel deployment out of the box. Simply connect your GitHub repository to Vercel — it will auto-detect the Vite framework and deploy with the correct settings.

The `vercel.json` file contains SPA rewrite rules to ensure client-side routing works correctly.

Financial Information SWG
