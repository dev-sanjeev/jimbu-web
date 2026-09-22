import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCurrentTheme } from '@/hooks/useCurrentTheme';
import { Text } from '@/shared/Text';
const HeroChip = ({ icon: Icon, label }) => {
    const theme = useCurrentTheme();
    return (_jsxs("div", { className: "flex flex-row items-center gap-2 bg-card px-3 py-1.5 rounded-2xl w-fit", children: [_jsx(Icon, { size: 16, color: theme.colors.accent, strokeWidth: 2 }), _jsx(Text, { variant: "label", className: "font-semibold text-accent", children: label })] }));
};
export default HeroChip;
