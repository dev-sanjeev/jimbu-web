import { useCurrentTheme } from "./useCurrentTheme";
/**
 * Hex slots for lucide-react-native icons. Lucide takes `color` as a raw string,
 * so a hook returning hex (rather than NativeWind classes) is the right shape.
 *
 * Static slots mirror the `icon-*` Tailwind tokens in tailwind.config.js so the
 * values stay aligned between className and JS usage. `accent` follows the
 * currently selected theme via useCurrentTheme.
 */
export function useIconColors() {
    const theme = useCurrentTheme();
    return {
        default: "#111827",
        muted: "#6b7280",
        subtle: "#9ca3af",
        inverse: "#ffffff",
        destructive: "#ef4444",
        success: "#10b981",
        accent: theme.colors.accent,
        accentInverse: "#ffffff",
    };
}
