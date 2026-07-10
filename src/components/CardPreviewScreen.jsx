import { useRef, useState } from "react";
import { ArrowLeft, Settings, Maximize2 } from "lucide-react";
import Button from "./Button";
import Chip from "./Chip";
import CardCanvas from "./CardCanvas";
import CardZoomModal from "./CardZoomModal";
import { CATEGORIES } from "../lib/imageSearch";
import { QUOTE_FONTS, FONT_SIZES, getQuoteFont } from "../lib/quoteFonts";

const POSITIONS = [
  { id: "top", label: "Top" },
  { id: "middle", label: "Middle" },
  { id: "bottom", label: "Bottom" },
];

function formatDate() {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function CardPreviewScreen({
  card,
  settings,
  onBack,
  onChangeBackground,
  onRegenerateQuote,
  onTextPositionChange,
  onFontChange,
  onFontStyleChange,
  onFontWeightChange,
  onFontSizeChange,
  onOpenSettings,
  busy,
}) {
  const canvasRef = useRef(null);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);

  async function handleDownload() {
    setDownloading(true);
    try {
      const blob = await canvasRef.current.exportPng();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `daily-quote-${new Date().toISOString().slice(0, 10)}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  const isItalic = card.fontItalic ?? true;
  const isBold = card.fontBold ?? true;
  const currentFont = getQuoteFont(card.fontFamily ?? "fraunces");

  return (
    <div className="flex min-h-full flex-col px-6 pt-[calc(env(safe-area-inset-top)+60px)] pb-10 safe-bottom">
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          aria-label="Start a new card"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-teal-700 shadow-sm hover:bg-teal-50"
        >
          <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </button>
        <div className="min-w-0 flex-1 text-center">
          <p className="text-sm font-medium text-teal-500">{formatDate()}</p>
          <p className="font-display text-lg text-teal-950 italic">Today's card is ready</p>
        </div>
        <button
          onClick={onOpenSettings}
          aria-label="Settings"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-teal-700 shadow-sm hover:bg-teal-50"
        >
          <Settings className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </button>
      </div>

      <div
        role="button"
        tabIndex={0}
        aria-label="View full-size preview"
        onClick={() => setZoomOpen(true)}
        onKeyDown={(e) => e.key === "Enter" && setZoomOpen(true)}
        className="mt-6 cursor-pointer"
      >
        <div className="mx-auto h-[46svh] w-fit">
          <CardCanvas
            ref={canvasRef}
            imageUrl={card.imageUrl}
            quoteText={card.quoteText}
            brandName={settings.brandName}
            showBrandName={settings.showBrandName}
            logoUrl={settings.logoUrl}
            showLogo={settings.showLogo}
            textPosition={card.textPosition ?? "bottom"}
            fontFamily={card.fontFamily ?? "fraunces"}
            fontItalic={isItalic}
            fontBold={isBold}
            fontSizeId={card.fontSizeId ?? "medium"}
            className="aspect-9/16 h-full w-auto max-w-full"
          />
        </div>
        <p className="mt-4 flex items-center justify-center gap-1 text-xs font-medium text-teal-600">
          <Maximize2 className="h-3 w-3" strokeWidth={2} />
          Tap to view full size
        </p>
      </div>

      <div className="mt-6 space-y-2.5">
        <Button
          variant="primary"
          size="sm"
          className="w-full"
          onClick={handleDownload}
          disabled={downloading || busy}
        >
          {downloading ? "Preparing…" : "Download"}
        </Button>

        <div className="flex gap-2.5">
          <Button
            variant="outline"
            size="sm"
            className="flex-[2]"
            onClick={() => setCustomizeOpen((v) => !v)}
            disabled={busy}
          >
            Customize
          </Button>
          {card.source === "ai" && (
            <Button
              variant="outline"
              size="sm"
              className="flex-[3] whitespace-nowrap"
              onClick={onRegenerateQuote}
              disabled={busy}
            >
              {busy ? "Trying again…" : "Regenerate quote"}
            </Button>
          )}
        </div>
      </div>

      {customizeOpen && (
        <div className="mt-5 space-y-5 rounded-3xl border border-teal-100 bg-white p-4">
          <div>
            <p className="mb-3 text-sm font-semibold text-teal-800">Background</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <Chip key={c.id} tint={c.id} onClick={() => onChangeBackground(c.id)}>
                  {c.label}
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-teal-800">Quote position</p>
            <div className="flex gap-2">
              {POSITIONS.map((p) => (
                <Chip
                  key={p.id}
                  tint="nature"
                  active={(card.textPosition ?? "bottom") === p.id}
                  onClick={() => onTextPositionChange(p.id)}
                >
                  {p.label}
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-teal-800">Quote font</p>
            <div className="flex flex-wrap gap-2">
              {QUOTE_FONTS.map((f) => (
                <Chip
                  key={f.id}
                  tint="nature"
                  active={(card.fontFamily ?? "fraunces") === f.id}
                  onClick={() => onFontChange(f.id)}
                >
                  <span
                    style={{
                      fontFamily: f.family,
                      fontStyle: f.defaultItalic ? "italic" : "normal",
                      fontWeight: f.defaultBold ? 700 : 400,
                    }}
                  >
                    Aa
                  </span>{" "}
                  {f.label}
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-teal-800">Style</p>
            <div className="flex gap-2">
              <Chip tint="nature" active={!isItalic} onClick={() => onFontStyleChange(false)}>
                Regular
              </Chip>
              <Chip
                tint="nature"
                active={isItalic}
                disabled={currentFont.noItalic}
                onClick={() => onFontStyleChange(true)}
              >
                <span className="italic">Italic</span>
              </Chip>
            </div>
            {currentFont.noItalic && (
              <p className="mt-2 text-xs text-teal-600/70">
                {currentFont.label} doesn't have an italic style.
              </p>
            )}
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-teal-800">Weight</p>
            <div className="flex gap-2">
              <Chip tint="nature" active={!isBold} onClick={() => onFontWeightChange(false)}>
                Regular
              </Chip>
              <Chip tint="nature" active={isBold} onClick={() => onFontWeightChange(true)}>
                <span className="font-bold">Bold</span>
              </Chip>
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-teal-800">Quote size</p>
            <div className="flex gap-2">
              {FONT_SIZES.map((s) => (
                <Chip
                  key={s.id}
                  tint="nature"
                  active={(card.fontSizeId ?? "medium") === s.id}
                  onClick={() => onFontSizeChange(s.id)}
                >
                  {s.label}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      )}

      <CardZoomModal
        open={zoomOpen}
        card={card}
        settings={settings}
        fontItalic={isItalic}
        fontBold={isBold}
        onClose={() => setZoomOpen(false)}
      />
    </div>
  );
}
