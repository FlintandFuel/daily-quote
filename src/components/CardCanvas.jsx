import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { getQuoteFont, getFontSize, canvasFontString } from "../lib/quoteFonts";

const W = 1080;
const H = 1920;
const INK = "2, 39, 39"; // rgb triplet matching --color-teal-950
const DARKEN_OPACITY = 0.32; // uniform wash over the whole photo, so white text is legible everywhere without an outline

function loadImage(src, crossOrigin) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (crossOrigin) img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function pickBaseFontSize(text) {
  if (text.length < 60) return 78;
  if (text.length < 120) return 64;
  if (text.length < 200) return 54;
  return 46;
}

const CardCanvas = forwardRef(function CardCanvas(
  {
    imageUrl,
    quoteText,
    brandName,
    showBrandName,
    logoUrl,
    showLogo,
    textPosition = "bottom",
    fontFamily = "fraunces",
    fontItalic = true,
    fontBold = true,
    fontSizeId = "medium",
    onStatusChange,
  },
  ref
) {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function draw() {
      if (!imageUrl || !quoteText) return;
      setReady(false);
      onStatusChange?.("loading");

      try {
        const font = getQuoteFont(fontFamily);
        const sizeScale = getFontSize(fontSizeId).scale;
        const fontSize = Math.round(pickBaseFontSize(quoteText) * font.sizeMul * sizeScale);
        const fontString = canvasFontString(font, fontSize, fontItalic, fontBold);

        await Promise.all([document.fonts.load(fontString), document.fonts.load("500 28px Poppins")]);

        const [img, logoImg] = await Promise.all([
          loadImage(imageUrl, true),
          showLogo && logoUrl ? loadImage(logoUrl, false) : Promise.resolve(null),
        ]);

        if (cancelled) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, W, H);

        const scale = Math.max(W / img.width, H / img.height);
        const sw = W / scale;
        const sh = H / scale;
        const sx = (img.width - sw) / 2;
        const sy = (img.height - sh) / 2;
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);

        ctx.fillStyle = `rgba(${INK}, ${DARKEN_OPACITY})`;
        ctx.fillRect(0, 0, W, H);

        const marginX = 96;
        const maxWidth = W - marginX * 2;
        ctx.font = fontString;
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        const lines = wrapText(ctx, quoteText, maxWidth);
        const lineHeight = fontSize * 1.3;
        const blockHeight = lines.length * lineHeight;

        const brandReserve = showBrandName || showLogo ? 150 : 72;
        let blockTop;
        if (textPosition === "top") {
          blockTop = 170;
        } else if (textPosition === "middle") {
          blockTop = (H - blockHeight) / 2;
        } else {
          blockTop = H - brandReserve - 32 - blockHeight;
        }
        const firstBaseline = blockTop + fontSize;

        ctx.fillStyle = "#fbfdfc";
        lines.forEach((line, i) => {
          ctx.fillText(line, marginX, firstBaseline + i * lineHeight);
        });

        if (showBrandName || (showLogo && logoImg)) {
          const rowY = H - 60;
          let x = marginX;
          if (showLogo && logoImg) {
            const logoSize = 72;
            const plateY = rowY - logoSize + 2;
            ctx.fillStyle = "rgba(251, 253, 252, 0.92)";
            ctx.beginPath();
            ctx.roundRect(x - 8, plateY - 8, logoSize + 16, logoSize + 16, 18);
            ctx.fill();
            ctx.drawImage(logoImg, x, plateY, logoSize, logoSize);
            x += logoSize + 32;
          }
          if (showBrandName && brandName) {
            ctx.font = "500 30px Poppins, sans-serif";
            ctx.fillStyle = "rgba(251, 253, 252, 0.92)";
            ctx.fillText(brandName, x, rowY);
          }
        }

        if (!cancelled) {
          setReady(true);
          onStatusChange?.("ready");
        }
      } catch {
        if (!cancelled) onStatusChange?.("error");
      }
    }

    draw();
    return () => {
      cancelled = true;
    };
  }, [
    imageUrl,
    quoteText,
    brandName,
    showBrandName,
    logoUrl,
    showLogo,
    textPosition,
    fontFamily,
    fontItalic,
    fontBold,
    fontSizeId,
  ]);

  useImperativeHandle(ref, () => ({
    exportPng: () =>
      new Promise((resolve, reject) => {
        const canvas = canvasRef.current;
        if (!canvas) return reject(new Error("Canvas not ready"));
        canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Export failed"))), "image/png");
      }),
  }));

  return (
    <div className="relative aspect-9/16 w-full overflow-hidden rounded-[2rem] bg-teal-100 shadow-xl shadow-teal-900/15">
      <canvas ref={canvasRef} width={W} height={H} className="h-full w-full object-cover" />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-teal-50">
          <div className="flex items-center gap-2 text-teal-600">
            <span className="h-2 w-2 animate-bounce rounded-full bg-teal-400 [animation-delay:-0.3s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-teal-400 [animation-delay:-0.15s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-teal-400" />
          </div>
        </div>
      )}
    </div>
  );
});

export default CardCanvas;
