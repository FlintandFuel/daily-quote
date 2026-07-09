// Local persistence layer standing in for Firestore during the first draft.
// Shape mirrors the brief's collections 1:1 so swapping in real Firestore
// calls later is a matter of replacing these functions' bodies, not callers.

const KEYS = {
  quotes: "fnf-quotes-quotes",
  dailyCards: "fnf-quotes-dailyCards",
  settings: "fnf-quotes-settings",
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function todayKey() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function getQuoteHistory() {
  return read(KEYS.quotes, []);
}

export function addQuoteToHistory(entry) {
  const history = getQuoteHistory();
  const record = { id: crypto.randomUUID(), dateUsed: todayKey(), ...entry };
  write(KEYS.quotes, [record, ...history].slice(0, 200));
  return record;
}

export function getDailyCard(date = todayKey()) {
  const cards = read(KEYS.dailyCards, {});
  return cards[date] ?? null;
}

export function saveDailyCard(card, date = todayKey()) {
  const cards = read(KEYS.dailyCards, {});
  cards[date] = { date, createdAt: new Date().toISOString(), ...card };
  write(KEYS.dailyCards, cards);
  return cards[date];
}

export function clearDailyCard(date = todayKey()) {
  const cards = read(KEYS.dailyCards, {});
  delete cards[date];
  write(KEYS.dailyCards, cards);
}

const DEFAULT_SETTINGS = {
  defaultCategory: "nature",
  brandName: "",
  logoUrl: "",
  showBrandName: false,
  showLogo: false,
};

export function getSettings() {
  return { ...DEFAULT_SETTINGS, ...read(KEYS.settings, {}) };
}

export function saveSettings(partial) {
  const next = { ...getSettings(), ...partial };
  write(KEYS.settings, next);
  return next;
}
