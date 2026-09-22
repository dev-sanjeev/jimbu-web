/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    // Replacing the default palette entirely — only named design tokens are available.
    // Prevents raw Tailwind colors (gray-100, blue-500, etc.) from being used.
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#ffffff",
      black: "#000000",

      // ── Static semantic colors (never change with theme) ──────────────
      background: "#ffffff",
      foreground: "#000000",
      border: "#f0f0f0",
      card: "#ffffff",
      success: "#10b981",
      destructive: "#ef4444",
      warning: "#f59e0b",
      muted: "#f3f4f6",
      "muted-foreground": "#6b7280",
      "subtle-border": "#00000014",

      // ── Dynamic accent family (resolved via CSS vars set by Themes.ts) ─
      accent: "var(--color-accent)",
      "accent-light": "var(--color-accent-light)",
      "accent-subtle": "var(--color-accent-subtle)",
      "gradient-top": "var(--color-gradient-top)",
      "background-wash": "var(--color-background-wash)",

      // ── Icon color tokens ─────────────────────────────────────────────
      "icon-default": "#000000",
      "icon-muted": "#6b7280",
      "icon-subtle": "#9ca3af",
      "icon-inverse": "#ffffff",
      "icon-destructive": "#ef4444",
      "icon-success": "#10b981",
    },
    // Replacing the default font scale — only these tokens are available.
    // Prevents raw Tailwind sizes (text-sm, text-xl, etc.) from being used.
    fontSize: {
      // ── Type scale ────────────────────────────────────────────────────
      display:    ["30px", { lineHeight: "34px", letterSpacing: "-0.5px" }],
      h1:         ["24px", { lineHeight: "32px", letterSpacing: "-0.3px" }],
      h2:         ["20px", { lineHeight: "26px", letterSpacing: "-0.2px" }],
      h3:         ["18px", { lineHeight: "24px" }],
      body:       ["14px", { lineHeight: "18px" }],
      label:      ["14px", { lineHeight: "18px" }],
      "body-sm":  ["12px", { lineHeight: "16px" }],
      caption:    ["12px", { lineHeight: "16px" }],
    },
    extend: {
      borderRadius: {
        card: "24px",
      },
      boxShadow: {
        card: "0 2px 12px rgba(0,0,0,0.07)",
        floatingTab: "0 8px 32px rgba(0,0,0,0.08)",
        auth: "0 10px 40px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)",
      },
      fontFamily: {
        sans: ["Manrope", "system-ui", "sans-serif"],
      },
      spacing: {
        // ── Semantic sizing tokens ────────────────────────────────────────
        input:    "52px",   // h-input — standard height for inputs and primary buttons
        "page-x": "24px",  // px-page-x — horizontal page padding
        "page-y": "20px",  // py-page-y — vertical page padding
        section:  "24px",  // gap-section / mb-section — between major page sections
        "card-p": "16px",  // p-card-p — card internal padding
        // ── Approved spacing tiers (from Tailwind's 4px scale) ────────────
        // 1=4px  (icon↔label gaps)
        // 2=8px  (list item spacing)
        // 3=12px (compact padding)
        // 4=16px (standard card padding) → also card-p
        // 5=20px (generous padding)
        // 6=24px (page padding) → also page-x / section
        // 8=32px (large section separation)
        // 12=48px (page-level vertical breathing room)
      },
      minHeight: {
        textarea: "120px",  // min-h-textarea — multiline FormField container
      },
      maxWidth: {
        "dialog-sm": "400px",   // max-w-dialog-sm — compact dialogs and confirm modals
        "dialog-md": "480px",   // max-w-dialog-md — wider dialogs (SelectField picker)
      },
      maxHeight: {
        dropdown: "70vh",       // max-h-dropdown — scrollable dropdown/picker panels
      },
    },
  },
  plugins: [],
};
