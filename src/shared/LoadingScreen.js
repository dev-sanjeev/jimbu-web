import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Text } from './Text';
import { useCurrentTheme } from '@/hooks/useCurrentTheme';
export default function LoadingScreen({ title = 'Loading…', subtitle = 'Please wait', }) {
    const theme = useCurrentTheme();
    return (_jsxs("div", { style: theme.vars, className: "flex min-h-screen items-center justify-center flex-col gap-4 bg-background-wash", children: [_jsx("div", { className: "w-10 h-10 rounded-full border-4 border-t-transparent animate-spin", style: { borderColor: `${theme.colors.accent} transparent ${theme.colors.accent} ${theme.colors.accent}` } }), _jsxs("div", { className: "text-center flex flex-col gap-1", children: [_jsx(Text, { variant: "h3", className: "text-foreground", children: title }), _jsx(Text, { variant: "bodySm", className: "text-muted-foreground", children: subtitle })] })] }));
}
