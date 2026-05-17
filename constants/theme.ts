/**
 * Design tokens derived from the project's CSS variable system.
 * Dark theme is the default; light values are kept for a future theme toggle.
 */

export const DARK = {
  background: "#12242E",
  card: "#1C2E38",
  cardElevated: "#21384A",
  popover: "#1C2E38",
  sidebar: "#101F28",

  foreground: "#F3E3EA",
  mutedForeground: "#E4A2B1",
  subtleForeground: "#9BB0BD",

  muted: "#24272B",
  input: "#20333D",
  border: "#324859",

  primary: "#FBE2A7",
  primaryForeground: "#12242E",
  secondary: "#E4A2B1",
  secondaryForeground: "#12242E",
  accent: "#C67B96",
  accentForeground: "#F3E3EA",
  ring: "#50AFB6",

  destructive: "#E35EA4",
  destructiveForeground: "#12242E",

  chart1: "#50AFB6",
  chart2: "#E4A2B1",
  chart3: "#C67B96",
  chart4: "#175C6C",
  chart5: "#24272B",
} as const;

export const LIGHT = {
  background: "#F6E6EE",
  card: "#FDEDC9",
  cardElevated: "#FFFFFF",
  popover: "#FFFFFF",
  sidebar: "#F8D8EA",

  foreground: "#5B5B5B",
  mutedForeground: "#7A7A7A",
  subtleForeground: "#7A7A7A",

  muted: "#B2E1EB",
  input: "#E4E4E4",
  border: "#D04F99",

  primary: "#D04F99",
  primaryForeground: "#FFFFFF",
  secondary: "#8ACFD1",
  secondaryForeground: "#333333",
  accent: "#FBE2A7",
  accentForeground: "#333333",
  ring: "#E670AB",

  destructive: "#F96F70",
  destructiveForeground: "#FFFFFF",

  chart1: "#E670AB",
  chart2: "#84D2E2",
  chart3: "#FBE2A7",
  chart4: "#F3A0CA",
  chart5: "#D7488E",
} as const;

export type ThemeColors = typeof DARK;

/** Active palette. Dark is the default brand aesthetic. */
export const COLORS: ThemeColors = DARK;

export const CATEGORY_COLORS = {
  all: COLORS.primary,
  politics: COLORS.chart3,
  economy: COLORS.chart1,
  sports: COLORS.chart2,
  technology: COLORS.ring,
  world: COLORS.secondary,
  culture: COLORS.accent,
} as const;

export const FONTS = {
  /** Headline serif — article titles, hero copy. */
  serif: "Lora_600SemiBold",
  serifRegular: "Lora_400Regular",
  /** Body / UI sans — Poppins. */
  sans: "Poppins_400Regular",
  sansMedium: "Poppins_500Medium",
  sansSemiBold: "Poppins_600SemiBold",
  sansBold: "Poppins_700Bold",
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const RADIUS = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const SHADOW = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  floating: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 10,
  },
} as const;
