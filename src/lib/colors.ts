/** Couleurs des pastilles (noms Printify en anglais et noms français de la démo). */
const COLOR_HEX: Record<string, string> = {
  black: "#1d1d1f", noir: "#1d1d1f",
  white: "#fbfbf9", blanc: "#fbfbf9",
  navy: "#1f2a44", marine: "#1f2a44",
  red: "#c0392b", rouge: "#c0392b",
  "sport grey": "#9ea3a8", "athletic heather": "#b5b8bb", "heather grey": "#b5b8bb", "gris chiné": "#b5b8bb",
  "dark grey": "#4a4a4a", "dark heather": "#4a4a4a", charcoal: "#3c3c3e", "gris foncé": "#4a4a4a",
  "military green": "#4b5320", "vert olive": "#6b7046", olive: "#6b7046", "forest green": "#2f4a3a", "vert forêt": "#2f4a3a",
  maroon: "#6d1f2a", bordeaux: "#6d1f2a",
  royal: "#2a4bb3", "royal blue": "#2a4bb3", "light blue": "#a9cbe8", "bleu ciel": "#a9cbe8",
  sand: "#d9c7a7", sable: "#d9c7a7", beige: "#d8c8a8", natural: "#efe6d2", naturel: "#efe6d2",
  pink: "#f2b8c6", "light pink": "#f2b8c6", rose: "#f2b8c6",
  orange: "#f47a1f", yellow: "#f5c542", gold: "#e0a526", jaune: "#f5c542",
  purple: "#5b3f8c", violet: "#5b3f8c", brown: "#6b4a2f", marron: "#6b4a2f",
};

export function colorHex(name: string | undefined) {
  return COLOR_HEX[(name ?? "").trim().toLowerCase()] ?? "#d9d4cc";
}
