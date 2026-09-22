// Existing legacy THEME object — kept so older screens that reference it
// continue to work. New screens should prefer COLORS / RADII / SHADOWS / GRADIENT
// (or the matching NativeWind classes mirrored in tailwind.config.js).
export const THEME = {
    background: "#f7fbfa",
    foreground: "#0f1720",
    primary: "#1eaa88",
    primaryForeground: "#ffffff",
    secondary: "#e6f7f3",
    mutedForeground: "#6b7280",
    card: "#ffffff",
    border: "#00000014",
    radiusLg: 8,
    radiusXl: 12,
};
// ---------------------------------------------------------------------------
// New design-system tokens — extracted from the user-provided HTML reference.
// All new components reference these values; never inline hex literals.
// ---------------------------------------------------------------------------
export const COLORS = {
    // Page surfaces
    background: "#ffffff",
    backgroundWash: "#eaf6ff",
    foreground: "#071124",
    mutedForeground: "#6b7280",
    mutedForegroundLight: "#8a96a3",
    border: "#f0f0f0",
    borderSubtle: "rgba(0,0,0,0.08)",
    card: "#ffffff",
    // Semantic
    primary: "#4754d8",
    primaryForeground: "#ffffff",
    success: "#10b981",
    destructive: "#ef4444",
    warning: "#f59e0b",
    accent: "#ff9fbf",
    /**
     * @deprecated Use `useCurrentTheme().colors.gradientTop` instead.
     * This value is now theme-dependent and lives in src/shared/Themes.ts.
     */
    bgGradientTop: "#aee4ff",
    /**
     * @deprecated Use `useCurrentTheme().colors.accent` / NativeWind `text-accent` / `bg-accent` / `border-accent` instead.
     * All accent colors are now theme-dependent and live in src/shared/Themes.ts.
     */
    themeBlue: "#0385d4",
    /** @deprecated See themeBlue. Use `useCurrentTheme().colors.accentLight`. */
    themeBlueLight: "#1fa6ed",
    themeGreen: "#529e7d",
    themePink: "#ff8ba7",
    themePinkLight: "#ffb5c8",
    themeNavy: "#0f172a",
    themeNavyLight: "#1e293b",
};
export const RADII = {
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
    card: 24,
};
// React Native style shadow objects. iOS uses shadow*, Android uses elevation.
// On NativeWind we mirror these as boxShadow strings in tailwind.config.js for
// web and supported targets, but in RN proper these objects are what works.
export const SHADOWS = {
    card: {
        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
    },
    /**
     * @deprecated Use `useCurrentTheme().colors.heroShadowColor` for a theme-aware shadow.
     */
    heroBlue: {
        shadowColor: "#0385d4",
        shadowOpacity: 0.25,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
    },
    floatingTab: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 32,
        shadowOffset: { width: 0, height: 8 },
        elevation: 12,
    },
};
// Vertical page gradient used by <GradientBackground />.
//
// The first color is held flat from 0% to ~15% so that screens with
// `headerTransparent: true` (where the gradient begins at y=0 but the visible
// page starts below the header at ~10% of screen height) don't show a faded
// blue right under the header. The opaque header paints `#aee4ff`; the
// gradient stays at `#aee4ff` through the header zone and into the visible
// strip just below it, then begins its fade to white below ~15%.
/**
 * @deprecated Use `useCurrentTheme().colors.pageGradient` / `.heroGradient` instead.
 * These values are now theme-dependent and live in src/shared/Themes.ts.
 */
export const GRADIENT = {
    page: [
        "#aee4ff",
        "#aee4ff",
        "rgba(174,228,255,0.5)",
        "rgba(255,255,255,0.8)",
        "#ffffff",
    ],
    pageStops: [0, 0.15, 0.45, 0.8, 1],
    // Hero (blue gradient) card on AccountDetails.
    heroBlue: ["#1fa6ed", "#0385d4"],
    heroBlueStops: [0, 1],
};
