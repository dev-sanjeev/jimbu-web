import { themes } from "@/shared/Themes";
import { useThemeStore } from "@/stores/themeStore";
/**
 * Returns the full AppTheme object for the currently selected theme.
 *
 * Use `theme.colors.*` when you need raw hex / rgba values for JS-only APIs
 * such as LinearGradient `colors`, inline `shadowColor`, etc.
 *
 * For everything else (backgrounds, borders, text) prefer the NativeWind
 * CSS-variable classes that are resolved automatically via the root vars():
 *   bg-accent  |  text-accent  |  border-accent
 *   bg-accent-subtle  |  bg-gradient-top  |  bg-background-wash
 */
export function useCurrentTheme() {
    const { themeId } = useThemeStore();
    return themes[themeId];
}
