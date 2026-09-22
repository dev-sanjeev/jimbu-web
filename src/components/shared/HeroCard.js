import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCurrentTheme } from '@/hooks/useCurrentTheme';
import { Text } from '@/shared/Text';
const HeroCard = ({ title, subtitle, children }) => {
    const theme = useCurrentTheme();
    const [color1, color2] = theme.colors.heroGradient;
    return (_jsxs("div", { className: "rounded-lg p-6 relative overflow-hidden", style: {
            background: `linear-gradient(135deg, ${color1}, ${color2})`,
        }, children: [children, _jsxs("div", { className: "flex flex-col gap-2 mt-4", children: [_jsx(Text, { variant: "h2", className: "text-white", children: title }), subtitle && (_jsx(Text, { variant: "body", className: "text-white", children: subtitle }))] })] }));
};
export default HeroCard;
