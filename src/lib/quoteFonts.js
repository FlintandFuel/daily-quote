// Quote-text font options. Style (italic/regular) and weight (regular/bold)
// are independent of the family choice — every family exposes sensible
// defaults, but Customize can override either axis on top of any family.
// `sizeMul` compensates for typefaces that read bigger/smaller at the same
// px size (a script font needs more size to feel equivalent to a serif).

export const QUOTE_FONTS = [
  {
    id: "fraunces",
    label: "Fraunces",
    family: 'Fraunces, Georgia, serif',
    sizeMul: 1,
    defaultItalic: true,
    defaultBold: true,
  },
  {
    id: "playfair",
    label: "Playfair",
    family: '"Playfair Display", Georgia, serif',
    sizeMul: 1,
    defaultItalic: true,
    defaultBold: true,
  },
  {
    id: "dmserif",
    label: "DM Serif",
    family: '"DM Serif Display", Georgia, serif',
    sizeMul: 1.05,
    defaultItalic: true,
    defaultBold: false,
  },
  {
    id: "poppins",
    label: "Poppins",
    family: "Poppins, sans-serif",
    sizeMul: 0.8,
    defaultItalic: false,
    defaultBold: true,
  },
  {
    id: "caveat",
    label: "Caveat",
    family: "Caveat, cursive",
    sizeMul: 1.35,
    defaultItalic: false,
    defaultBold: true,
  },
  {
    id: "unbounded",
    label: "Unbounded",
    family: "Unbounded, sans-serif",
    sizeMul: 0.72,
    defaultItalic: false,
    defaultBold: true,
    noItalic: true,
  },
];

export const FONT_SIZES = [
  { id: "small", label: "Small", scale: 0.82 },
  { id: "medium", label: "Medium", scale: 1 },
  { id: "large", label: "Large", scale: 1.22 },
];

export function getQuoteFont(id) {
  return QUOTE_FONTS.find((f) => f.id === id) ?? QUOTE_FONTS[0];
}

export function getFontSize(id) {
  return FONT_SIZES.find((s) => s.id === id) ?? FONT_SIZES[1];
}

export function canvasFontString(font, size, italic, bold) {
  const style = italic ? "italic" : "normal";
  const weight = bold ? 700 : 400;
  return `${style} ${weight} ${size}px ${font.family}`;
}
