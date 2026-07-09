// Very small mood/theme lexicon used to pick an image search keyword from
// quote text. Good enough for a first draft; a real build would likely lean
// on the LLM call itself to return a keyword alongside the quote.

const MOOD_MAP = [
  { match: /\b(rest|slow|breath|quiet|stillness|calm|pause)\b/i, keyword: "calm water" },
  { match: /\b(boundar|no\b|enough|worth|protect)\b/i, keyword: "stone wall" },
  { match: /\b(grief|loss|grieve|mourn|heal)\b/i, keyword: "autumn leaves" },
  { match: /\b(storm|hard|struggle|weight|heavy|tired|burnout|exhaust)\b/i, keyword: "stormy sky" },
  { match: /\b(grow|bloom|becom|change|new)\b/i, keyword: "flower field" },
  { match: /\b(light|hope|morning|dawn|clear)\b/i, keyword: "sunrise" },
  { match: /\b(ocean|tide|wave|current)\b/i, keyword: "ocean waves" },
  { match: /\b(root|ground|steady|foundation)\b/i, keyword: "forest floor" },
];

const FALLBACKS = ["nature texture", "soft clouds", "quiet forest", "ocean horizon"];

export function extractKeyword(quoteText) {
  for (const { match, keyword } of MOOD_MAP) {
    if (match.test(quoteText)) return keyword;
  }
  return FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
}
