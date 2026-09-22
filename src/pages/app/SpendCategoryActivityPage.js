import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import SectionHeader from '@/components/shared/SectionHeader';
import TransactionCard from '@/components/shared/TransactionCard';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { resolveLucideIcon } from '@/components/accounts/lucideIcon';
import { useGetCategories } from '@/hooks/categories/useGetCategories';
import { useGetTransactionsTimeframe } from '@/hooks/transactions/useGetTransactionsTimeframe';
import { dayLabel, monthBoundsISO, monthLabel, parseMonthParam } from '@/shared/dateRange';
import { Text } from '@/shared/Text';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
export default function SpendCategoryActivityPage() {
    const [searchParams] = useSearchParams();
    const categoryIdRaw = searchParams.get('categoryId');
    const monthRaw = searchParams.get('month') ?? undefined;
    const categoryId = categoryIdRaw ? Number(categoryIdRaw) : undefined;
    const month = useMemo(() => parseMonthParam(monthRaw), [monthRaw]);
    const { start, end } = useMemo(() => monthBoundsISO(month), [month]);
    const { data, isFetching } = useGetTransactionsTimeframe(start, end);
    const { data: categories } = useGetCategories();
    const { transactions, total, percentage, category } = useMemo(() => {
        const all = data?.data ?? [];
        const monthExpenses = all.filter((t) => t.type === 'expense');
        const monthSum = monthExpenses.reduce((acc, t) => acc + Number(t.amount), 0);
        const filtered = categoryId !== undefined ? monthExpenses.filter((t) => t.categoryId === categoryId) : [];
        const sum = filtered.reduce((acc, t) => acc + Number(t.amount), 0);
        const pct = monthSum > 0 ? (sum / monthSum) * 100 : 0;
        const first = filtered[0];
        const meta = first
            ? { name: first.categoryName, icon: first.categoryIcon, color: first.categoryColor }
            : (() => {
                const fallback = categories?.find((c) => c.id === categoryId);
                return fallback ? { name: fallback.name, icon: fallback.icon, color: fallback.color } : null;
            })();
        return { transactions: filtered, total: sum, percentage: pct, category: meta };
    }, [data, categories, categoryId]);
    const sections = useMemo(() => {
        const sorted = transactions.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const grouped = sorted.reduce((acc, tx) => {
            const label = dayLabel(new Date(tx.createdAt));
            if (!acc[label])
                acc[label] = [];
            acc[label].push(tx);
            return acc;
        }, {});
        return Object.entries(grouped).map(([title, data]) => ({ title, data }));
    }, [transactions]);
    const Icon = resolveLucideIcon(category?.icon ?? 'tag');
    const safePct = Math.max(0, Math.min(100, percentage));
    const tintColor = category?.color ?? '#6c63ff';
    return (_jsx(ScreenWrapper, { children: _jsxs("div", { className: "flex-1 overflow-y-auto pb-20 pt-3 flex flex-col gap-5", children: [_jsxs("div", { className: "bg-card rounded-lg flex flex-row gap-4 p-4 items-start border border-border shadow-card", children: [_jsx("div", { className: "w-14 h-14 rounded-lg flex items-center justify-center shrink-0", style: { backgroundColor: tintColor + '26' }, children: _jsx(Icon, { size: 28, color: tintColor, strokeWidth: 1.8 }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx(Text, { variant: "h2", className: "text-foreground", children: category?.name ?? 'Category' }), _jsx(Text, { variant: "caption", className: "text-muted-foreground mb-3", children: `${monthLabel(month)} · ${transactions.length} transactions` }), _jsxs("div", { className: "flex flex-row gap-6 mb-3", children: [_jsxs("div", { children: [_jsxs(Text, { variant: "h3", className: "text-foreground", children: ["$", total.toFixed(2)] }), _jsx(Text, { variant: "caption", className: "text-muted-foreground", children: "Total Spent" })] }), _jsxs("div", { children: [_jsxs(Text, { variant: "h3", children: [safePct.toFixed(2), "%"] }), _jsx(Text, { variant: "caption", className: "text-muted-foreground", children: "of Monthly" })] })] }), _jsx("div", { className: "h-1 bg-muted rounded-full overflow-hidden", children: _jsx("div", { style: { width: `${safePct}%`, backgroundColor: tintColor, height: '100%' } }) })] })] }), _jsxs("div", { children: [_jsx(SectionHeader, { title: "Transactions", showSeeAll: false }), isFetching && !data ? (_jsx("div", { className: "bg-card rounded-lg border border-border shadow-card p-4 flex justify-center", children: _jsx("div", { className: "w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin my-6" }) })) : sections.length > 0 ? (sections.map((section) => (_jsxs("div", { className: "mb-4", children: [_jsx(Text, { variant: "caption", className: "text-muted-foreground uppercase tracking-wider mb-2", children: section.title }), _jsx("div", { className: "bg-card rounded-lg border border-border shadow-card overflow-hidden", children: section.data.map((tx, i) => (_jsx(TransactionCard, { tx: tx, showDivider: i < section.data.length - 1 }, tx.id))) })] }, section.title)))) : (_jsx("div", { className: "bg-card rounded-lg border border-border shadow-card px-5 py-6 flex items-center justify-center", children: _jsx(Text, { variant: "bodySm", className: "text-muted-foreground", children: "No transactions in this category for this month." }) }))] })] }) }));
}
