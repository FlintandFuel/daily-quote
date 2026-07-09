// Stubbed LLM call. Swap the body of `generateQuote` for a real Claude API
// request (server-side, so the key never ships to the client) — callers
// only depend on the { text, topic } shape and the avoidRepeats contract.
//
// The prompt this stands in for: grounded psychologist's voice, address the
// given topic specifically, no "believe in yourself" cliché phrasing.

const POOLS = {
  boundaries: [
    "A boundary isn't a wall you build to keep people out. It's a door you get to choose who walks through.",
    "You don't owe anyone access to you just because they asked nicely.",
    "Saying no to one thing is saying yes to something else. Usually yourself.",
    "Guilt isn't proof that you did something wrong. Sometimes it's proof that you did something new.",
    "The people who respect your boundaries were never the ones testing them.",
  ],
  burnout: [
    "Burnout isn't a productivity problem. It's a body that's been ignored for too long.",
    "You can't rest your way out of a life that never stops asking for more. Something has to change, not just you.",
    "Tired isn't a character flaw. It's data.",
    "The exhaustion isn't in your head. It's in your calendar.",
    "Recovery doesn't start with a holiday. It starts with saying the truth out loud.",
  ],
  "self-worth": [
    "Your worth was never up for a performance review.",
    "You don't have to earn the right to take up space. You already have it.",
    "Confidence isn't the absence of doubt. It's deciding the doubt doesn't get the final vote.",
    "You're allowed to outgrow the version of yourself other people found convenient.",
    "Self-worth isn't built by proving something. It's built by no longer needing to.",
  ],
  "people-pleasing": [
    "Being liked by everyone isn't a personality trait. It's a survival strategy, and it's costing you something.",
    "You weren't put here to make things easier for people who never ask how you're doing.",
    "The version of you that says yes to everything isn't the most loved. Just the most tired.",
    "Disappointing someone isn't the same as hurting them.",
    "Peace was never meant to cost you yourself.",
  ],
  grief: [
    "Grief doesn't ask permission to show up on an ordinary Tuesday.",
    "You're not stuck. You're carrying something heavy and walking anyway.",
    "There's no finish line to healing, just a life that makes a little more room to breathe in.",
    "Missing someone isn't a setback in your healing. It's proof of what mattered.",
  ],
  anxiety: [
    "Anxiety isn't a weakness. It's a nervous system that learned to expect the worst, early and often.",
    "You're allowed to be a work in progress and still be doing enough.",
    "Calm isn't the absence of fear. It's choosing to move anyway.",
    "The racing thoughts are loud because they think they're protecting you. They're just out of date.",
  ],
  general: [
    "Healing is rarely a straight line, and it was never supposed to be.",
    "You are not behind. You are exactly as far as your circumstances have let you get.",
    "Some days, showing up is the whole job.",
    "Not every hard season means something is wrong with you.",
    "The bravest thing, some days, is just staying soft.",
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

export async function generateQuote({ topic, recentTexts = [] }) {
  const { pool, key } = resolvePool(topic);
  const fresh = pool.filter((q) => !recentTexts.includes(q));
  const candidates = fresh.length ? fresh : pool;
  const text = candidates[Math.floor(Math.random() * candidates.length)];

  // Simulate API latency so loading states are visible/testable.
  await new Promise((r) => setTimeout(r, 900));

  return { text, topic: key ?? topic ?? null };
}
