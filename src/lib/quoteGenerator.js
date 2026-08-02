// Stubbed LLM call. Swap the body of `generateQuote` for a real Claude API
// request (server-side, so the key never ships to the client) — callers
// only depend on the { text, topic, length } shape and the avoidRepeats
// contract. `buildQuotePrompt` is the real prompt to send as the user
// message when that swap happens; it's exercised here to pick a
// length-appropriate quote from the curated bank in the meantime.

export const LENGTH_PRESETS = [
  { id: "short", label: "Short", lines: 1, wordsMin: 6, wordsMax: 10 },
  { id: "medium", label: "Medium", lines: 2, wordsMin: 12, wordsMax: 18 },
  { id: "long", label: "Long", lines: 3, wordsMin: 20, wordsMax: 28 },
];

export const DEFAULT_LENGTH = "short";

export function getLengthPreset(length) {
  return LENGTH_PRESETS.find((p) => p.id === length) ?? LENGTH_PRESETS[0];
}

// The prompt sent to the LLM for "Get a quote for me". Relevance to the
// topic is checked before originality — a quote that's original but only
// loosely related to the topic is a miss, not a stylistic choice.
export function buildQuotePrompt({ topic, length = DEFAULT_LENGTH, recentTexts = [] }) {
  const preset = getLengthPreset(length);

  const topicClause = topic
    ? `Topic: "${topic}"

Priority order:
1. Relevance first. The quote must clearly and specifically speak to "${topic}" — a reader should recognise the topic instantly, not have to search for the connection. A quote that's original but only loosely related to the topic is a failure, even if it's well written; relevance is checked before originality.
2. Within that constraint, be as original and specific as possible.`
    : `No topic was given. Write a general reflective quote instead — still grounded and specific, not a topic-free platitude.`;

  const recentClause = recentTexts.length
    ? `\n\nAvoid repeating the phrasing, structure, or central idea of these recent quotes:\n${recentTexts
        .slice(0, 15)
        .map((t) => `- ${t}`)
        .join("\n")}`
    : "";

  return `You are writing a single short quote for a psychologist's personal-brand daily quote card.

Voice: grounded, direct, psychologist-informed — like a sharp observation from someone who actually works with people, not a poster. Avoid generic or cliché wisdom-quote phrasing ("believe in yourself", "live laugh love") and aphorisms vague enough to apply to anyone.

${topicClause}

Length: exactly ${preset.lines} line${preset.lines > 1 ? "s" : ""}, approximately ${preset.wordsMin}–${preset.wordsMax} words total. Write directly to this target — don't write a longer quote and truncate it, and don't pad a shorter one to hit the count.${recentClause}

Return only the quote text. No quotation marks, no attribution, no preamble.`;
}

const POOLS = {
  boundaries: [
    "A boundary isn't a wall you build to keep people out. It's a door you get to choose who walks through.",
    "You don't owe anyone access to you just because they asked nicely.",
    "Saying no to one thing is saying yes to something else. Usually yourself.",
    "Guilt isn't proof that you did something wrong. Sometimes it's proof that you did something new.",
    "The people who respect your boundaries were never the ones testing them.",
    "Boundaries aren't punishment.",
    "A boundary held once is a rule. Held every time it's tested, it's actually yours — not just something you said once and hoped would stick.",
  ],
  burnout: [
    "Burnout isn't a productivity problem. It's a body that's been ignored for too long.",
    "You can't rest your way out of a life that never stops asking for more. Something has to change, not just you.",
    "Tired isn't a character flaw. It's data.",
    "The exhaustion isn't in your head. It's in your calendar.",
    "Recovery doesn't start with a holiday. It starts with saying the truth out loud.",
    "Rest isn't the reward.",
    "Burnout doesn't announce itself. It just quietly removes one thing you loved at a time, until the calendar's full and none of it is joy anymore.",
  ],
  "self-worth": [
    "Your worth was never up for a performance review.",
    "You don't have to earn the right to take up space. You already have it.",
    "Confidence isn't the absence of doubt. It's deciding the doubt doesn't get the final vote.",
    "You're allowed to outgrow the version of yourself other people found convenient.",
    "Self-worth isn't built by proving something. It's built by no longer needing to.",
    "You are not a draft.",
    "Self-worth isn't loud, and it isn't a mood. It's the quiet thing that stays intact whether or not the room happens to notice you.",
  ],
  "people-pleasing": [
    "Being liked by everyone isn't a personality trait. It's a survival strategy, and it's costing you something.",
    "You weren't put here to make things easier for people who never ask how you're doing.",
    "The version of you that says yes to everything isn't the most loved. Just the most tired.",
    "Disappointing someone isn't the same as hurting them.",
    "Peace was never meant to cost you yourself.",
    "Their comfort isn't your job.",
    "People-pleasing feels like kindness from the inside, but it's really a quiet bet that your needs are the ones allowed to lose.",
  ],
  grief: [
    "Grief doesn't ask permission to show up on an ordinary Tuesday.",
    "You're not stuck. You're carrying something heavy and walking anyway.",
    "There's no finish line to healing, just a life that makes a little more room to breathe in.",
    "Missing someone isn't a setback in your healing. It's proof of what mattered.",
    "Grief is love with nowhere left to go.",
    "Grief doesn't shrink on a schedule. It just learns, slowly, to share the room with a life that keeps moving anyway.",
  ],
  anxiety: [
    "Anxiety isn't a weakness. It's a nervous system that learned to expect the worst, early and often.",
    "You're allowed to be a work in progress and still be doing enough.",
    "Calm isn't the absence of fear. It's choosing to move anyway.",
    "The racing thoughts are loud because they think they're protecting you. They're just out of date.",
    "Your body isn't overreacting.",
    "Anxiety isn't proof something's wrong with you. It's an old alarm system, still shouting about a danger that left the room a long time ago.",
  ],
  general: [
    "Healing is rarely a straight line, and it was never supposed to be.",
    "You are not behind. You are exactly as far as your circumstances have let you get.",
    "Some days, showing up is the whole job.",
    "Not every hard season means something is wrong with you.",
    "The bravest thing, some days, is just staying soft.",
    "Progress isn't loud.",
    "Not every season needs a lesson attached to it. Some of them just need to be survived, quietly, without turning it into a story yet.",
  ],
};

const TOPIC_ALIASES = [
  { key: "boundaries", match: /boundar/i },
  { key: "burnout", match: /burn ?out|exhaust|overwhelm/i },
  { key: "self-worth", match: /self.?worth|confidence|enough/i },
  { key: "people-pleasing", match: /people.?pleas|pleasing|approval/i },
  { key: "grief", match: /grief|loss|grieving|mourn/i },
  { key: "anxiety", match: /anxiet|anxious|worry|panic/i },
];

function resolvePool(topic) {
  if (!topic) return { pool: POOLS.general, key: null };
  const alias = TOPIC_ALIASES.find(({ match }) => match.test(topic));
  return alias ? { pool: POOLS[alias.key], key: alias.key } : { pool: POOLS.general, key: topic };
}

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// Best-effort stand-in for "write directly to the target length": picks the
// curated-bank candidate closest to the preset's word-count range, rather
// than truncating/padding a chosen quote after the fact.
function pickByLength(candidates, preset) {
  const inRange = candidates.filter((q) => {
    const wc = wordCount(q);
    return wc >= preset.wordsMin && wc <= preset.wordsMax;
  });
  if (inRange.length) return inRange[Math.floor(Math.random() * inRange.length)];

  const mid = (preset.wordsMin + preset.wordsMax) / 2;
  let bestDistance = Infinity;
  let closest = [];
  for (const q of candidates) {
    const distance = Math.abs(wordCount(q) - mid);
    if (distance < bestDistance) {
      bestDistance = distance;
      closest = [q];
    } else if (distance === bestDistance) {
      closest.push(q);
    }
  }
  return closest[Math.floor(Math.random() * closest.length)];
}

export async function generateQuote({ topic, length = DEFAULT_LENGTH, recentTexts = [] }) {
  const preset = getLengthPreset(length);
  const { pool, key } = resolvePool(topic);
  const fresh = pool.filter((q) => !recentTexts.includes(q));
  const candidates = fresh.length ? fresh : pool;
  const text = pickByLength(candidates, preset);

  // Simulate API latency so loading states are visible/testable.
  await new Promise((r) => setTimeout(r, 900));

  return { text, topic: key ?? topic ?? null, length: preset.id };
}
