import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Text } from '@/shared/Text';
export default function Group({ title, children }) {
    return (_jsxs("div", { children: [_jsx(Text, { variant: "caption", className: "text-foreground uppercase tracking-wider mb-2 px-1", children: title }), _jsx("div", { className: "bg-card rounded-xl border border-border shadow-card overflow-hidden", children: children })] }));
}
