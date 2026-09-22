import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Text } from '@/shared/Text';
export default function EmptyRecentTransactionsState({ onAddExpense }) {
    return (_jsxs("div", { className: "flex flex-col items-center py-4", children: [_jsx(Text, { variant: "bodySm", className: "text-muted-foreground", children: "No transactions yet" }), onAddExpense && (_jsx("button", { type: "button", onClick: onAddExpense, className: "mt-3 bg-accent rounded-lg px-5 py-2 cursor-pointer border-0", children: _jsx(Text, { variant: "label", className: "text-white font-semibold", children: "+ Add expense" }) }))] }));
}
