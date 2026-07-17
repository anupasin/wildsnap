import type { Category, Confidence } from "@wildsnap/core";

/**
 * WildSnap's warm, natural design tokens. Shared by every UI component so web
 * and mobile look identical. Kept as plain objects (no CSS) so react-native and
 * react-native-web both consume them.
 */
export const colors = {
  /** Page background — soft warm paper. */
  canvas: "#F6F1E7",
  /** Card / surface. */
  surface: "#FFFFFF",
  surfaceSunken: "#F1ECE1",
  /** Deep forest green — primary brand. */
  forest: "#2F5D45",
  forestSoft: "#E4EFE7",
  /** Warm amber accent. */
  amber: "#E39A3B",
  amberSoft: "#FBEBD2",
  /** Text. */
  ink: "#26241F",
  inkSoft: "#6B655A",
  inkFaint: "#9C968A",
  /** Hairlines. */
  border: "#E7E0D2",
  white: "#FFFFFF",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 24,
  pill: 999,
} as const;

export const type = {
  hero: 30,
  title: 22,
  body: 16,
  small: 14,
  tiny: 12,
} as const;

/** Emoji + tint per category — powers the little badges and empty states. */
export const categoryMeta: Record<Category, { emoji: string; label: string }> = {
  tree: { emoji: "🌳", label: "Tree" },
  plant: { emoji: "🌿", label: "Plant" },
  flower: { emoji: "🌸", label: "Flower" },
  bird: { emoji: "🐦", label: "Bird" },
  landscape: { emoji: "🏔️", label: "Landscape" },
  other: { emoji: "🔎", label: "Nature" },
};

export const confidenceMeta: Record<
  Confidence,
  { label: string; color: string; bg: string }
> = {
  high: { label: "Confident", color: "#2F5D45", bg: colors.forestSoft },
  medium: { label: "Fairly sure", color: "#8A6A16", bg: colors.amberSoft },
  low: { label: "Best guess", color: "#8A5A4A", bg: "#F6E3DC" },
};
