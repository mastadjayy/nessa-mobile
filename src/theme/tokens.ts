/**
 * Nessa design tokens: the single source of truth for the look of the app.
 * Never hardcode colors, spacing, radii or font names in screens or components.
 *
 * Contrast ratios noted below were computed against WCAG 2.x
 * (4.5:1 for body text, 3:1 for large text and UI graphics).
 */

// ---------------------------------------------------------------------------
// Brand palette (raw values). Components should use `colors` below instead.
// ---------------------------------------------------------------------------
export const palette = {
  orange: '#F28500', // brand primary
  orangeDeep: '#A85900', // white text on it: 5.1:1
  orangeInk: '#2B1700', // dark text on brand orange: 6.6:1
  peach: '#FFC9A3', // secondary
  blue: '#00AAFC', // tertiary (XP, daily goal)
  blueDeep: '#006A9E', // blue for text on light surfaces: 5.7:1
  blueSoft: '#4DC3FF', // blue for dark surfaces: 8.6:1
  neutral: '#FAFAF8',
} as const;

// ---------------------------------------------------------------------------
// Semantic colors
// ---------------------------------------------------------------------------
export type ColorTokens = {
  // Surfaces
  background: string;
  surface: string; // cards
  surfaceVariant: string; // chips, inputs, tab bar, progress tracks
  outline: string;
  overlay: string;

  // Text
  text: string;
  textSecondary: string;
  textDisabled: string;
  textOnPrimary: string; // text and icons placed on brand orange
  textOnPrimaryDeep: string;

  // Brand
  primary: string; // main call-to-action fill (Continue, Check)
  primaryDeep: string; // small accents, links, icons on light surfaces
  primaryContainer: string; // soft orange background
  onPrimaryContainer: string;

  // Tertiary: XP and daily goal
  tertiary: string; // fills (progress bars, rings)
  tertiaryText: string; // text and icons
  onTertiary: string;

  // Feedback (always pair with an icon and a message, never color alone)
  success: string;
  successContainer: string;
  onSuccess: string; // text on success fill
  onSuccessContainer: string;
  error: string;
  errorContainer: string;
  onError: string;
  onErrorContainer: string;
  hintContainer: string;
  onHintContainer: string;

  // Gamification
  streak: string;
  xp: string;

  // Disabled controls
  disabledFill: string;
};

export const lightColors: ColorTokens = {
  background: palette.neutral,
  surface: '#FFFFFF',
  surfaceVariant: '#EDECE9',
  outline: '#D6D2CC',
  overlay: 'rgba(20, 18, 16, 0.5)',

  text: '#1C1B19', // 16.5:1 on background
  textSecondary: '#5A524B', // 7.3:1 on background
  textDisabled: '#8A8077',
  textOnPrimary: palette.orangeInk,
  textOnPrimaryDeep: '#FFFFFF',

  primary: palette.orange,
  primaryDeep: palette.orangeDeep,
  primaryContainer: palette.peach,
  onPrimaryContainer: palette.orangeInk, // 11.5:1

  tertiary: palette.blue,
  tertiaryText: palette.blueDeep,
  onTertiary: '#001E2E', // 6.7:1 on blue

  success: '#1B7F46', // white on it: 5.0:1
  successContainer: '#DFF3E6',
  onSuccess: '#FFFFFF',
  onSuccessContainer: '#146C38', // 5.6:1
  error: '#C62828', // white on it: 5.6:1
  errorContainer: '#FCE4E4',
  onError: '#FFFFFF',
  onErrorContainer: '#B71C1C', // 5.4:1
  hintContainer: '#FFF3CD',
  onHintContainer: '#6B4A00', // 7.3:1

  streak: palette.orange,
  xp: palette.blue,

  disabledFill: '#E4E1DC',
};

export const darkColors: ColorTokens = {
  background: '#141210',
  surface: '#1E1B18',
  surfaceVariant: '#2A2622',
  outline: '#403A34',
  overlay: 'rgba(0, 0, 0, 0.6)',

  text: '#F2EEE9', // 16.2:1 on background
  textSecondary: '#B8AEA5', // 8.6:1 on background
  textDisabled: '#7A7168',
  textOnPrimary: palette.orangeInk,
  textOnPrimaryDeep: '#FFFFFF',

  primary: palette.orange, // 7.2:1 on background, usable as text and icons
  primaryDeep: palette.orange,
  primaryContainer: '#3A2412',
  onPrimaryContainer: '#F2EEE9', // 12.6:1

  tertiary: palette.blueSoft,
  tertiaryText: palette.blueSoft, // 8.6:1 on surface
  onTertiary: '#001E2E',

  success: '#5BD08A', // 8.8:1 on surface
  successContainer: '#1F3A2A',
  onSuccess: '#0B2A18',
  onSuccessContainer: '#5BD08A', // 6.4:1
  error: '#FF8A80', // 7.5:1 on surface
  errorContainer: '#402020',
  onError: '#3B0A0A',
  onErrorContainer: '#FF8A80', // 6.4:1
  hintContainer: '#33290F',
  onHintContainer: '#FFD27A', // 10.1:1

  streak: palette.orange,
  xp: palette.blueSoft,

  disabledFill: '#2A2622',
};

export const colors = { light: lightColors, dark: darkColors } as const;

// ---------------------------------------------------------------------------
// Spacing (4pt grid)
// ---------------------------------------------------------------------------
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

// ---------------------------------------------------------------------------
// Corner radius. Buttons and chips are pill-shaped, as in the Nessa theme.
// ---------------------------------------------------------------------------
export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

// ---------------------------------------------------------------------------
// Sizing
// ---------------------------------------------------------------------------
export const sizing = {
  touchTarget: 48, // minimum tappable size (dp)
  buttonHeight: 52, // large full-width buttons
  iconSm: 20,
  iconMd: 24,
  iconLg: 32,
  progressBar: 8,
  tabBarHeight: 64,
  maxContentWidth: 560, // keeps layouts readable on tablets
} as const;

// ---------------------------------------------------------------------------
// Typography
// Font family names match @expo-google-fonts/inter. React Native needs one
// family name per weight, so weight is part of the family, not fontWeight.
// ---------------------------------------------------------------------------
export const fontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

type TextStyleToken = {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing?: number;
};

export const typography = {
  // Headlines
  display: { fontFamily: fontFamily.bold, fontSize: 32, lineHeight: 40, letterSpacing: -0.5 },
  headline: { fontFamily: fontFamily.bold, fontSize: 24, lineHeight: 32, letterSpacing: -0.25 },
  title: { fontFamily: fontFamily.semibold, fontSize: 18, lineHeight: 26 },

  // Body
  body: { fontFamily: fontFamily.regular, fontSize: 16, lineHeight: 24 },
  bodyStrong: { fontFamily: fontFamily.semibold, fontSize: 16, lineHeight: 24 },
  caption: { fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 20 },

  // Labels (buttons, tabs, chips)
  label: { fontFamily: fontFamily.semibold, fontSize: 14, lineHeight: 20, letterSpacing: 0.1 },
  button: { fontFamily: fontFamily.bold, fontSize: 16, lineHeight: 24, letterSpacing: 0.1 },

  // Language content: the word being learned. Larger, easy to read at a glance.
  target: { fontFamily: fontFamily.bold, fontSize: 28, lineHeight: 36 },
  respelling: { fontFamily: fontFamily.medium, fontSize: 16, lineHeight: 24 },
} as const satisfies Record<string, TextStyleToken>;

// ---------------------------------------------------------------------------
// Elevation (subtle: cards rely mostly on surface color and outline)
// ---------------------------------------------------------------------------
export const elevation = {
  none: {},
  card: {
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
} as const;

// ---------------------------------------------------------------------------
// Motion (milliseconds)
// ---------------------------------------------------------------------------
export const motion = {
  fast: 120,
  normal: 220,
  slow: 400,
} as const;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type ColorScheme = keyof typeof colors;
export type TypographyVariant = keyof typeof typography;

export type Theme = {
  scheme: ColorScheme;
  isDark: boolean;
  colors: ColorTokens;
  spacing: typeof spacing;
  radius: typeof radius;
  sizing: typeof sizing;
  typography: typeof typography;
  elevation: typeof elevation;
  motion: typeof motion;
};

export const lightTheme: Theme = {
  scheme: 'light',
  isDark: false,
  colors: lightColors,
  spacing,
  radius,
  sizing,
  typography,
  elevation,
  motion,
};

export const darkTheme: Theme = { ...lightTheme, scheme: 'dark', isDark: true, colors: darkColors };