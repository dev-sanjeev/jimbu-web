import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useIconColors } from '@/hooks/useIconColors';
import { Text } from '@/shared/Text';
import { PieChart } from 'lucide-react';
export default function EmptyMonthCategoriesState({ variant, monthLabel, onAddExpense, }) {
    const isPast = variant === 'past';
    const icon = useIconColors();
    return (_jsxs("div", { className: "flex flex-col items-center py-6 px-4", children: [_jsx("div", { className: "w-10 h-10 rounded-lg flex items-center justify-center bg-muted mb-3", children: _jsx(PieChart, { size: 20, color: icon.subtle, strokeWidth: 1.8 }) }), _jsx(Text, { variant: "body", className: "font-semibold text-foreground text-center", children: isPast
                    ? `No expenses recorded for ${monthLabel ?? 'this period'}`
                    : 'No expenses yet this month' }), !isPast && (_jsxs(_Fragment, { children: [_jsx(Text, { variant: "bodySm", className: "text-muted-foreground text-center mt-1", children: "Add one to see where your money goes" }), onAddExpense && (_jsx("button", { type: "button", onClick: onAddExpense, className: "mt-4 bg-accent rounded-lg px-5 py-2.5 cursor-pointer border-0", children: _jsx(Text, { variant: "label", className: "text-white font-semibold", children: "+ Add expense" }) }))] }))] }));
}
