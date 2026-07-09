# Daily Quote Card

Mobile-first PWA that generates a daily quote-on-image card for WhatsApp
Status. See [daily-quote-card-app-brief.md](daily-quote-card-app-brief.md)
for the full product brief.

## Status: first draft

The UI/UX flow, canvas compositing, and PWA install are fully working.
Data and external APIs are stubbed behind swappable modules so the app
runs end-to-end with zero API keys:

- `src/lib/store.js` — `localStorage` standing in for Firestore
  (`quotes`, `dailyCards`, `settings` collections, same shape as the brief).
- `src/lib/quoteGenerator.js` — stub for the Claude API call. Returns a
  themed quote from a small curated bank instead of a real LLM request.
- `src/lib/imageSearch.js` — real Pexels keyword search when
  `VITE_PEXELS_API_KEY` is set, falling back to seeded Picsum images
  otherwise so the app still runs with zero setup.

Swap each remaining stub's implementation for the real service later —
callers only depend on the shapes documented at the top of each file.

## Run it

```bash
npm install
npm run dev
```

### Real stock photos (optional)

Get a free key at [pexels.com/api](https://www.pexels.com/api/), then:

```bash
cp .env.example .env.local
# edit .env.local and paste the key into VITE_PEXELS_API_KEY
```

Restart `npm run dev` after adding the key. Without it, backgrounds come
from Picsum (random, not keyword-matched) instead of Pexels.

## Build

```bash
npm run build
```
