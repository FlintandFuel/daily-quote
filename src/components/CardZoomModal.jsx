import { X } from "lucide-react";
import CardCanvas from "./CardCanvas";

export default function CardZoomModal({ open, card, settings, fontItalic, fontBold, onClose }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-teal-950/80 p-6"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close preview"
        style={{ top: "calc(env(safe-area-inset-top) + 20px)" }}
        className="absolute right-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-white/25"
      >
        <X className="h-5 w-5" strokeWidth={1.75} />
      </button>

      <div className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        <CardCanvas
          imageUrl={card.imageUrl}
          quoteText={card.quoteText}
          brandName={settings.brandName}
          showBrandName={settings.showBrandName}
          logoUrl={settings.logoUrl}
          showLogo={settings.showLogo}
          textPosition={card.textPosition ?? "bottom"}
          fontFamily={card.fontFamily ?? "fraunces"}
          fontItalic={fontItalic}
          fontBold={fontBold}
          fontSizeId={card.fontSizeId ?? "medium"}
          className="mx-auto aspect-9/16 w-full"
        />
      </div>
    </div>
  );
}
