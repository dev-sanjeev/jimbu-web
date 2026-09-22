import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import CategoryProgressRow from '@/components/shared/CategoryProgressRow';
import EmptyMonthCategoriesState from '@/components/shared/EmptyMonthCategoriesState';
import MonthTotalCard from '@/components/shared/MonthTotalCard';
import SectionHeader from '@/components/shared/SectionHeader';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { useGetTransactionsTimeframe } from '@/hooks/transactions/useGetTransactionsTimeframe';
import { useIconColors } from '@/hooks/useIconColors';
import { firstOfMonth, monthBoundsISO, monthLabel, monthParam } from '@/shared/dateRange';
import { Text } from '@/shared/Text';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function SpendCategoriesPage() {
    const navigate = useNavigate();
    const icon = useIconColors();
    const [viewedMonth, setViewedMonth] = useState(() => firstOfMonth(new Date()));
    const currentMonth = useMemo(() => firstOfMonth(new Date()), []);
    const isCurrentMonth = viewedMonth.getTime() === currentMonth.getTime();
    const { start, end } = useMemo(() => monthBoundsISO(viewedMonth), [viewedMonth]);
    const { data, isFetching } = useGetTransactionsTimeframe(start, end);
    const { monthTotal, categories } = useMemo(() => {
        const transactions = data?.data ?? [];
        const expenses = transactions.filter((t) => t.type === 'expense');
        const total = expenses.reduce((sum, t) => sum + Number(t.amount), 0);
        const byCategory = new Map();
        for (const tx of expenses) {
            const existing = byCategory.get(tx.categoryId);
            const amount = Number(tx.amount);
            if (existing)
                existing.amount += amount;
            else
                byCategory.set(tx.categoryId, { categoryId: tx.categoryId, name: tx.categoryName, icon: tx.categoryIcon, color: tx.categoryColor, amount });
        }
        return {
            monthTotal: total,
            categories: Array.from(byCategory.values()).sort((a, b) => b.amount - a.amount),
        };
    }, [data]);
    const showLoading = isFetching && !data;
    return (_jsx(ScreenWrapper, { children: _jsxs("div", { className: "flex-1 overflow-y-auto pb-20 pt-3 flex flex-col gap-5", children: [_jsxs("div", { className: "flex flex-row items-center justify-between", children: [_jsx("button", { type: "button", onClick: () => setViewedMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1)), className: "w-10 h-10 flex items-center justify-center rounded-full bg-card border-0 cursor-pointer", children: _jsx(ChevronLeft, { size: 20, color: icon.default }) }), _jsx(Text, { variant: "body", className: "font-semibold text-foreground", children: monthLabel(viewedMonth) }), _jsx("button", { type: "button", onClick: () => {
                                if (!isCurrentMonth)
                                    setViewedMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1));
                            }, disabled: isCurrentMonth, className: "w-10 h-10 flex items-center justify-center rounded-full bg-card border-0 cursor-pointer", style: { opacity: isCurrentMonth ? 0.35 : 1 }, children: _jsx(ChevronRight, { size: 20, color: icon.default }) })] }), _jsx("div", { className: "mt-3", children: _jsx(MonthTotalCard, { total: monthTotal }) }), _jsxs("div", { children: [_jsx(SectionHeader, { title: "Expense Breakdown", showSeeAll: false }), showLoading ? (_jsx("div", { className: "bg-card rounded-lg border border-border shadow-card p-4 flex items-center justify-center", children: _jsx("div", { className: "w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin py-6" }) })) : categories.length > 0 ? (_jsx("div", { className: "bg-card rounded-lg border border-border shadow-card overflow-hidden", children: categories.map((cat, index) => (_jsx(CategoryProgressRow, { name: cat.name, icon: cat.icon, color: cat.color, amount: cat.amount, percentage: monthTotal > 0 ? (cat.amount / monthTotal) * 100 : 0, showDivider: index < categories.length - 1, onPress: () => navigate(`/main/category-activity?categoryId=${cat.categoryId}&month=${monthParam(viewedMonth)}`) }, cat.categoryId))) })) : (_jsx("div", { className: "bg-card rounded-lg border border-border shadow-card p-4", children: _jsx(EmptyMonthCategoriesState, { variant: isCurrentMonth ? 'current' : 'past', monthLabel: monthLabel(viewedMonth), onAddExpense: isCurrentMonth ? () => navigate('/main/transactions/new') : undefined }) }))] })] }) }));
}
