import { useEffect, useState } from "react";
import QuoteChoiceScreen from "./components/QuoteChoiceScreen";
import CardPreviewScreen from "./components/CardPreviewScreen";
import SettingsSheet from "./components/SettingsSheet";
import { generateQuote } from "./lib/quoteGenerator";
import { searchImage } from "./lib/imageSearch";
import { extractKeyword } from "./lib/keywords";
import { getQuoteFont } from "./lib/quoteFonts";
import {
  getDailyCard,
  saveDailyCard,
  clearDailyCard,
  getQuoteHistory,
  addQuoteToHistory,
  getSettings,
  saveSettings,
} from "./lib/store";

export default function App() {
  const [card, setCard] = useState(undefined); // undefined = loading, null = none yet
  const [settings, setSettings] = useState(getSettings());
  const [generating, setGenerating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [categoryOverride, setCategoryOverride] = useState(null);

  useEffect(() => {
    setCard(getDailyCard());
  }, []);

  async function buildCard({ text, source, topic }, categoryId = categoryOverride) {
    const keyword = extractKeyword(text);
    const { url, keyword: usedKeyword } = await searchImage({ keyword, categoryId });
    const quoteRecord = addQuoteToHistory({ text, source, topic: topic || null });
    const saved = saveDailyCard({
      quoteId: quoteRecord.id,
      quoteText: text,
      source,
      topic: topic || null,
      imageKeyword: usedKeyword,
      imageUrl: url,
      textPosition: card?.textPosition ?? "bottom",
      fontFamily: card?.fontFamily ?? "fraunces",
      fontItalic: card?.fontItalic ?? true,
      fontBold: card?.fontBold ?? true,
      fontSizeId: card?.fontSizeId ?? "medium",
    });
    setCard(saved);
  }

  async function handleWriteOwn(text) {
    await buildCard({ text, source: "client", topic: null });
  }

  async function handleGenerate(topic) {
    setGenerating(true);
    try {
      const history = getQuoteHistory();
      const recentTexts = history.slice(0, 30).map((q) => q.text);
      const result = await generateQuote({ topic: topic || null, recentTexts });
      await buildCard({ text: result.text, source: "ai", topic: result.topic });
    } finally {
      setGenerating(false);
    }
  }

  async function handleRegenerateQuote() {
    if (!card || card.source !== "ai") return;
    setBusy(true);
    try {
      const history = getQuoteHistory();
      const recentTexts = history.slice(0, 30).map((q) => q.text);
      const result = await generateQuote({ topic: card.topic, recentTexts });
      await buildCard({ text: result.text, source: "ai", topic: result.topic });
    } finally {
      setBusy(false);
    }
  }

  async function handleChangeBackground(categoryId) {
    if (!card) return;
    setCategoryOverride(categoryId);
    setBusy(true);
    try {
      const keyword = extractKeyword(card.quoteText);
      const { url, keyword: usedKeyword } = await searchImage({ keyword, categoryId });
      const saved = saveDailyCard({
        ...card,
        imageKeyword: usedKeyword,
        imageUrl: url,
      });
      setCard(saved);
    } finally {
      setBusy(false);
    }
  }

  function handleSaveSettings(partial) {
    setSettings(saveSettings(partial));
  }

  function handleBack() {
    clearDailyCard();
    setCategoryOverride(null);
    setCard(null);
  }

  function handleTextPositionChange(textPosition) {
    if (!card) return;
    setCard(saveDailyCard({ ...card, textPosition }));
  }

  function handleFontChange(fontFamily) {
    if (!card) return;
    const font = getQuoteFont(fontFamily);
    setCard(
      saveDailyCard({
        ...card,
        fontFamily,
        fontItalic: font.defaultItalic,
        fontBold: font.defaultBold,
      })
    );
  }

  function handleFontStyleChange(fontItalic) {
    if (!card) return;
    setCard(saveDailyCard({ ...card, fontItalic }));
  }

  function handleFontWeightChange(fontBold) {
    if (!card) return;
    setCard(saveDailyCard({ ...card, fontBold }));
  }

  function handleFontSizeChange(fontSizeId) {
    if (!card) return;
    setCard(saveDailyCard({ ...card, fontSizeId }));
  }

  return (
    <div className="app-scroll mx-auto h-dvh w-full max-w-md overflow-y-auto bg-paper">
      {card === undefined ? (
        <div className="flex h-full items-center justify-center">
          <div className="h-2 w-2 animate-pulse rounded-full bg-teal-400" />
        </div>
      ) : card === null ? (
        <QuoteChoiceScreen
          onWriteOwn={handleWriteOwn}
          onGenerate={handleGenerate}
          generating={generating}
        />
      ) : (
        <CardPreviewScreen
          card={card}
          settings={settings}
          busy={busy}
          onBack={handleBack}
          onChangeBackground={handleChangeBackground}
          onRegenerateQuote={handleRegenerateQuote}
          onTextPositionChange={handleTextPositionChange}
          onFontChange={handleFontChange}
          onFontStyleChange={handleFontStyleChange}
          onFontWeightChange={handleFontWeightChange}
          onFontSizeChange={handleFontSizeChange}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      )}

      <SettingsSheet
        open={settingsOpen}
        settings={settings}
        onSave={handleSaveSettings}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
