import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Text } from '@/shared/Text';
export default function MonthTotalCard({ total, label = 'Total spent this month', }) {
    return (_jsxs("div", { className: "bg-card rounded-lg border border-border shadow-card px-2 py-8 flex flex-col items-center", children: [_jsx(Text, { variant: "caption", className: "text-muted-foreground mb-1", children: label }), _jsxs(Text, { variant: "display", className: "text-foreground", children: ["$", total.toFixed(2)] })] }));
}
