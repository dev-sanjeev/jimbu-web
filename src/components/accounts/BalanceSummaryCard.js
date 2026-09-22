import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Text } from '@/shared/Text';
export default function BalanceSummaryCard({ title, items }) {
    return (_jsxs("div", { className: "px-5 pb-6", children: [_jsx(Text, { variant: "h3", className: "text-foreground mb-4", children: title }), items.map((item, index) => (_jsxs("div", { className: "flex flex-row justify-between py-2.5 border-b border-border", children: [_jsx(Text, { variant: "bodySm", className: "text-muted-foreground", children: item.label }), _jsx(Text, { variant: "body", className: "font-medium", style: { color: item.color }, children: item.value })] }, index)))] }));
}
