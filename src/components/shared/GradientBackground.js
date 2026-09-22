import { jsx as _jsx } from "react/jsx-runtime";
import { useCurrentTheme } from '@/hooks/useCurrentTheme';
export const GradientBackground = ({ children, colors, locations }) => {
    const theme = useCurrentTheme();
    const gradientColors = colors ?? theme.colors.pageGradient;
    const gradientStops = locations ?? theme.colors.pageGradientStops;
    const gradientCss = gradientColors
        .map((c, i) => {
        const stop = gradientStops[i] != null ? ` ${gradientStops[i] * 100}%` : '';
        return `${c}${stop}`;
    })
        .join(', ');
    return (_jsx("div", { className: "flex-1 px-5", style: {
            background: `linear-gradient(to bottom, ${gradientCss})`,
            minHeight: '100%',
        }, children: children }));
};
export default GradientBackground;
