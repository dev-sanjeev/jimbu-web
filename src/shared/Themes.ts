import type React from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ThemeId =
  | 'royalBlue'
  | 'emeraldGreen'
  | 'deepPlum'
  | 'slateGray'
  | 'sunsetOrange';

/** Raw hex / rgba values — use these for JS-only APIs (gradients, shadows). */
export interface ThemeColors {
  accent: string;
  accentLight: string;
  /** 10% opacity tint — used for icon background chips. */
  accentSubtle: string;
  gradientTop: string;
  backgroundWash: string;
  /** [start, end] for the hero card gradient. */
  heroGradient: [string, string];
  heroShadowColor: string;
  /** 5-stop page gradient (top → white). */
  pageGradient: [string, string, string, string, string];
  pageGradientStops: [number, number, number, number, number];
}

export interface AppTheme {
  id: ThemeId;
  label: string;
  colors: ThemeColors;
  /**
   * Plain CSS custom-property map — apply to the root div as
   * `style={theme.vars as React.CSSProperties}` so every child can use
   * `bg-accent`, `text-accent`, `border-accent`, etc.
   */
  vars: React.CSSProperties;
}

// ─── Themes ──────────────────────────────────────────────────────────────────

export const themes: Record<ThemeId, AppTheme> = {
  royalBlue: {
    id: 'royalBlue',
    label: 'Royal Blue',
    colors: {
      accent: '#0385d4',
      accentLight: '#1fa6ed',
      accentSubtle: 'rgba(3,133,212,0.1)',
      gradientTop: '#aee4ff',
      backgroundWash: '#eaf6ff',
      heroGradient: ['#1fa6ed', '#0385d4'],
      heroShadowColor: '#0385d4',
      pageGradient: ['#aee4ff', '#aee4ff', 'rgba(174,228,255,0.5)', 'rgba(255,255,255,0.8)', '#ffffff'],
      pageGradientStops: [0, 0.15, 0.45, 0.8, 1],
    },
    vars: {
      '--color-accent': '#0385d4',
      '--color-accent-light': '#1fa6ed',
      '--color-accent-subtle': 'rgba(3,133,212,0.15)',
      '--color-gradient-top': '#aee4ff',
      '--color-background-wash': '#eaf6ff',
      '--color-blob-2-subtle': 'rgba(234,88,12,0.12)',
      '--color-blob-3-subtle': 'rgba(124,58,237,0.10)',
    } as React.CSSProperties,
  },

  emeraldGreen: {
    id: 'emeraldGreen',
    label: 'Emerald Green',
    colors: {
      accent: '#059669',
      accentLight: '#34d399',
      accentSubtle: 'rgba(5,150,105,0.1)',
      gradientTop: '#d1fae5',
      backgroundWash: '#f0fdf4',
      heroGradient: ['#34d399', '#059669'],
      heroShadowColor: '#059669',
      pageGradient: ['#d1fae5', '#d1fae5', 'rgba(209,250,229,0.5)', 'rgba(255,255,255,0.8)', '#ffffff'],
      pageGradientStops: [0, 0.15, 0.45, 0.8, 1],
    },
    vars: {
      '--color-accent': '#059669',
      '--color-accent-light': '#34d399',
      '--color-accent-subtle': 'rgba(5,150,105,0.15)',
      '--color-gradient-top': '#d1fae5',
      '--color-background-wash': '#f0fdf4',
      '--color-blob-2-subtle': 'rgba(59,130,246,0.10)',
      '--color-blob-3-subtle': 'rgba(245,158,11,0.10)',
    } as React.CSSProperties,
  },

  deepPlum: {
    id: 'deepPlum',
    label: 'Deep Plum',
    colors: {
      accent: '#7c3aed',
      accentLight: '#a855f7',
      accentSubtle: 'rgba(124,58,237,0.1)',
      gradientTop: '#ede9fe',
      backgroundWash: '#f5f3ff',
      heroGradient: ['#a855f7', '#7c3aed'],
      heroShadowColor: '#7c3aed',
      pageGradient: ['#ede9fe', '#ede9fe', 'rgba(237,233,254,0.5)', 'rgba(255,255,255,0.8)', '#ffffff'],
      pageGradientStops: [0, 0.15, 0.45, 0.8, 1],
    },
    vars: {
      '--color-accent': '#7c3aed',
      '--color-accent-light': '#a855f7',
      '--color-accent-subtle': 'rgba(124,58,237,0.15)',
      '--color-gradient-top': '#ede9fe',
      '--color-background-wash': '#f5f3ff',
      '--color-blob-2-subtle': 'rgba(236,72,153,0.10)',
      '--color-blob-3-subtle': 'rgba(59,130,246,0.10)',
    } as React.CSSProperties,
  },

  slateGray: {
    id: 'slateGray',
    label: 'Slate Gray',
    colors: {
      accent: '#475569',
      accentLight: '#64748b',
      accentSubtle: 'rgba(71,85,105,0.1)',
      gradientTop: '#e2e8f0',
      backgroundWash: '#f8fafc',
      heroGradient: ['#64748b', '#475569'],
      heroShadowColor: '#475569',
      pageGradient: ['#e2e8f0', '#e2e8f0', 'rgba(226,232,240,0.5)', 'rgba(255,255,255,0.8)', '#ffffff'],
      pageGradientStops: [0, 0.15, 0.45, 0.8, 1],
    },
    vars: {
      '--color-accent': '#475569',
      '--color-accent-light': '#64748b',
      '--color-accent-subtle': 'rgba(71,85,105,0.15)',
      '--color-gradient-top': '#e2e8f0',
      '--color-background-wash': '#f8fafc',
      '--color-blob-2-subtle': 'rgba(59,130,246,0.10)',
      '--color-blob-3-subtle': 'rgba(100,116,139,0.10)',
    } as React.CSSProperties,
  },

  sunsetOrange: {
    id: 'sunsetOrange',
    label: 'Sunset Orange',
    colors: {
      accent: '#ea580c',
      accentLight: '#fb923c',
      accentSubtle: 'rgba(234,88,12,0.1)',
      gradientTop: '#ffedd5',
      backgroundWash: '#fff7ed',
      heroGradient: ['#fb923c', '#ea580c'],
      heroShadowColor: '#ea580c',
      pageGradient: ['#ffedd5', '#ffedd5', 'rgba(255,237,213,0.5)', 'rgba(255,255,255,0.8)', '#ffffff'],
      pageGradientStops: [0, 0.15, 0.45, 0.8, 1],
    },
    vars: {
      '--color-accent': '#ea580c',
      '--color-accent-light': '#fb923c',
      '--color-accent-subtle': 'rgba(234,88,12,0.15)',
      '--color-gradient-top': '#ffedd5',
      '--color-background-wash': '#fff7ed',
      '--color-blob-2-subtle': 'rgba(59,130,246,0.12)',
      '--color-blob-3-subtle': 'rgba(245,158,11,0.12)',
    } as React.CSSProperties,
  },
};
