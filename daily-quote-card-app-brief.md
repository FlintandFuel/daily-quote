# APP BRIEF — Daily Quote Card Generator

**Client:** Psychologist / personal brand (WhatsApp Status growth tool)
**Built by:** Flint and Fuel Creative
**Purpose:** Generate a daily quote-on-image card, ready to download and post to WhatsApp Status, with zero manual work required from the client.

---

## 1. Project Overview

A single-page mobile-first PWA. The client opens one saved link (added to her phone home screen like an app icon). The app checks whether today's card has already been generated — if not, she's given a simple choice: **write her own quote** or **get one generated**. She taps **Download**, then posts the image to WhatsApp Status herself.

The focus of the tool is the quote, not the image. Quotes need to feel specific and original — not the generic "believe in yourself" style content that's everywhere. When she asks for a generated quote, she can optionally name a theme (e.g. "boundaries," "burnout," "self-worth") and the quote is written for that theme specifically, avoiding cliché phrasing. The image is secondary — a free stock photo (Unsplash/Pexels), not AI-generated.

No login screen, no dashboard, no settings menu buried in tabs.

---

## 2. Tech Stack

- **Hosting:** Firebase Hosting (Spark/free plan — no billing account needed)
- **Data:** Firestore (free tier) — quote bank, used-quote/image log, client preferences
- **Frontend:** React + Vite + Tailwind (consistent with existing stack), deployed as a PWA (installable to home screen, works fully in-browser)
- **Compositing:** HTML5 Canvas, client-side — renders quote text over the background image, exports as PNG at **1080×1920** (WhatsApp Status' native vertical ratio)
- **Image source:** Unsplash or Pexels API (free) — keyword search by category or by mood-matched keywords extracted from the quote. Stock only for the first draft; no AI image generation.
- **Quote source:** Client's own text input (typed fresh each day) OR an LLM API call (Claude), generated per-day on request, optionally themed to a topic she specifies
- No Cloud Functions, no Cloud Scheduler, no Blaze plan required.

---

## 3. Data Model (Firestore)

**`quotes` collection** — history log (not a queue; every quote used is recorded here, mainly so generated quotes don't repeat and she can look back at what she's posted)
- `id`, `text`, `source` ("client" | "ai"), `topic` (optional string, e.g. "boundaries"), `dateUsed`

**`dailyCards` collection** — log of what's been generated
- `date` (YYYY-MM-DD), `quoteId`, `imageKeyword`, `imageUrl`, `createdAt`

**`settings` document** (single doc, client preferences)
- `defaultCategory` (e.g. "flowers", "ocean", "nature" — used when auto-match is overridden)
- `brandName` (optional, string)
- `logoUrl` (optional, string)

---

## 4. Core Logic

### On app open:
1. Check `dailyCards` for today's date.
2. **If exists:** load and display that card immediately.
3. **If not,** present the choice:
   - **"Write my own quote"** — a text box, she types it directly, done.
   - **"Get a quote for me"** — an optional topic field (e.g. "boundaries," "burnout," "people-pleasing"). Calls the LLM API with a prompt that explicitly instructs it to avoid generic/cliché wisdom-quote phrasing, write in a grounded psychologist's voice, and address the given topic specifically if one was entered. Checks against the `quotes` history log to avoid repeating recent phrasing/themes.
4. Once the quote is set (either way):
   - Extract 1–2 mood/theme keywords from the quote to drive image search — **unless** she's manually picked a category via the toggle (see below).
   - Search Unsplash/Pexels for a matching vertical-orientation stock image.
   - Composite quote text over the image via Canvas.
   - Save the result to `dailyCards`, log the quote to `quotes`.
   - Display the card.

### Manual override:
- A small toggle/button ("Change background") lets her pick a category (flower, ocean, view, etc.) instead of the auto-matched one, and regenerate just the image layer (quote stays the same) before downloading.

---

## 5. Screens

**Step 1 — Quote choice** (shown only when today's card doesn't exist yet):
- Two large buttons: **"Write my own"** / **"Get a quote for me"**
- If "Write my own": a plain text box + "Continue"
- If "Get a quote for me": an optional topic field (placeholder text like "e.g. boundaries, burnout — or leave blank") + "Generate"

**Step 2 — Card preview:**
- Full-bleed preview of the card (image + quote rendered together)
- **Download** button (primary, large, thumb-friendly)
- **Change background** (secondary, small) — opens a simple category picker (chips: Flowers / Ocean / Nature / Sky / Abstract / Surprise me)
- **Regenerate quote** (secondary) — in case an AI-generated quote misses the mark, she can try again without starting over
- Optional small settings icon (gear) for brand name/logo toggle — hidden by default to keep the main screen uncluttered

---

## 6. Branding (optional, client-controlled)

- Toggle: show/hide her name or handle on the card (small, bottom corner)
- Toggle: show/hide a logo image (she supplies the file; stored via Firebase Storage or a static asset if simpler)
- Both off by default — quote and image only, unless she turns them on

---

## 7. Non-Functional Requirements

- Must work reliably on mobile Safari/Chrome (she'll use it exclusively on her phone)
- Installable as a PWA (manifest + icon) so it behaves like a native app from her home screen
- No login/auth — single-client tool, link itself is the access control
- Entire flow (open app → see card → download) should take under 10 seconds on a normal connection
- Graceful fallback if Pexels/LLM API calls fail (show a default neutral background + retry option, never a blank/broken screen)

---

## 8. API Integrations Needed

- **Unsplash or Pexels API** — free tier, requires API key (client or Cornelius registers one)
- **LLM API** (Claude) — used whenever she chooses "get a quote for me"; low-volume, negligible cost
- No WhatsApp API integration — final posting step is manual by design (WhatsApp doesn't support third-party Status posting)

---

## 9. Phase 2 Ideas (not in initial build)

- AI-generated (rather than stock) background images for a fully unique look
- Push notification / reminder when a new card is ready
- Multiple card "styles" or templates to rotate through
- Simple analytics (cards generated, days used)

---

## 10. Open Items to Confirm With Client

- Her name/handle exact wording for optional branding
- Whether she has a logo file, or needs one designed
- Preferred default image categories (confirm the "Surprise me" list of categories she'd want in rotation)
- Rough size of her initial quote list (affects how soon AI fallback kicks in)
