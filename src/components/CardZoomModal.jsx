import { X } from "lucide-react";
import CardCanvas from "./CardCanvas";

export default function CardZoomModal({ open, card, settings, fontItalic, fontBold, onClose }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-teal-950/85 p-6"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close preview"
        className="absolute right-5 top-[calc(env(safe-area-inset-top)+16px)] z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-teal-900 shadow-lg"
      >
        <X className="h-5 w-5" strokeWidth={2} />
      </button>

      <div className="h-[70svh] w-fit" onClick={(e) => e.stopPropagation()}>
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
          className="aspect-9/16 h-full w-auto max-w-full"
        />
      </div>
    </div>
  );
}
