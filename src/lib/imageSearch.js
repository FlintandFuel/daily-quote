// Stock-image lookup. Uses the real Pexels Search API when
// VITE_PEXELS_API_KEY is set (see .env.example); otherwise falls back to
// Picsum so the app keeps working with zero setup. Callers only depend on
// the { url, keyword } shape returned here.

const PEXELS_KEY = import.meta.env.VITE_PEXELS_API_KEY;

export const CATEGORIES = [
  { id: "flowers", label: "Flowers", seed: "flower field" },
  { id: "ocean", label: "Ocean", seed: "ocean waves" },
  { id: "nature", label: "Nature", seed: "quiet forest" },
  { id: "sky", label: "Sky", seed: "soft clouds" },
  { id: "abstract", label: "Abstract", seed: "abstract texture" },
  { id: "surprise", label: "Surprise me", seed: null },
];

export async function searchImage({ keyword, categoryId }) {
  const category = CATEGORIES.find((c) => c.id === categoryId);
  const effectiveKeyword =
    category && category.id !== "surprise" ? category.seed : keyword || "nature texture";

  if (PEXELS_KEY) {
    try {
      return await searchPexels(effectiveKeyword, category?.id === "surprise");
    } catch {
      // Network hiccup or bad key — fall through to the offline-friendly stub
      // rather than leaving her staring at a broken screen.
    }
  }

  return searchPicsum(effectiveKeyword, category?.id === "surprise");
}

async function searchPexels(keyword, surprise) {
  const query = surprise ? ["calm", "nature", "light", "texture"][Math.floor(Math.random() * 4)] : keyword;
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&orientation=portrait&per_page=20`,
    { headers: { Authorization: PEXELS_KEY } }
  );
  if (!res.ok) throw new Error("Pexels request failed");
  const data = await res.json();
  const photos = data.photos ?? [];
  if (!photos.length) throw new Error("No Pexels results");
  const photo = photos[Math.floor(Math.random() * photos.length)];
  return { url: photo.src.portrait, keyword };
}

async function searchPicsum(keyword, surprise) {
  const seed = surprise ? `surprise-${Math.floor(Math.random() * 9999)}` : `${keyword}-${Math.floor(Math.random() * 9999)}`;
  await new Promise((r) => setTimeout(r, 500)); // simulate network latency
  return { url: `https://picsum.photos/seed/${encodeURIComponent(seed)}/1080/1920`, keyword };
}
