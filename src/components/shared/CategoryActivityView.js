import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { resolveLucideIcon } from '@/components/accounts/lucideIcon';
import { Text } from '@/shared/Text';
import { useMemo } from 'react';
import SectionHeader from './SectionHeader';
import TransactionCard from './TransactionCard';
const dayLabel = (date) => {
    if (isNaN(date.getTime()))
        return 'Unknown Date';
    const today = new Date();
    const yesterday = new Date(Date.now() - 86400000);
    if (date.toDateString() === today.toDateString())
        return 'Today';
    if (date.toDateString() === yesterday.toDateString())
        return 'Yesterday';
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
    });
};
export default function CategoryActivityView({ category, transactions, total, isLoading = false, month, }) {
    const fallbackColor = category?.color || '#6c63ff';
    const Icon = resolveLucideIcon(category?.icon || 'tag');
    const sections = useMemo(() => {
        const sorted = transactions
            .slice()
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const grouped = sorted.reduce((acc, tx) => {
            const label = dayLabel(new Date(tx.createdAt));
            if (!acc[label])
                acc[label] = [];
            acc[label].push(tx);
            return acc;
        }, {});
        return Object.entries(grouped).map(([title, data]) => ({ title, data }));
    }, [transactions]);
    return (_jsxs("div", { className: "flex-1 overflow-y-auto pb-20", children: [_jsxs("div", { className: "bg-card flex flex-row rounded-lg border border-border shadow-card gap-2 items-center p-2", children: [_jsx("div", { className: "w-1/5 flex items-center justify-center", children: _jsx("div", { className: "w-14 h-14 rounded-lg flex items-center justify-center mb-3", style: { backgroundColor: fallbackColor + '26' }, children: _jsx(Icon, { size: 28, color: fallbackColor, strokeWidth: 1.8 }) }) }), _jsxs("div", { children: [_jsx(Text, { variant: "h3", className: "text-foreground", children: category?.name ?? 'Category' }), _jsx(Text, { variant: "caption", className: "text-muted-foreground mb-1", children: `${month + '-' + transactions.length + ' transactions'}` }), _jsxs(Text, { variant: "bodySm", className: "text-foreground", children: ["$", total.toFixed(2)] })] })] }), _jsxs("div", { className: "mt-5", children: [_jsx(SectionHeader, { title: "Transactions", showSeeAll: false }), isLoading ? (_jsx("div", { className: "bg-card rounded-lg border border-border shadow-card p-4 flex items-center justify-center", children: _jsx("div", { className: "w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin py-6" }) })) : sections.length > 0 ? (sections.map((section) => (_jsxs("div", { className: "mb-4", children: [_jsx(Text, { variant: "caption", className: "text-muted-foreground uppercase tracking-wider mb-2", children: section.title }), _jsx("div", { className: "bg-card rounded-lg border border-border shadow-card overflow-hidden", children: section.data.map((tx, i) => (_jsx(TransactionCard, { tx: tx, showDivider: i < section.data.length - 1 }, tx.id))) })] }, section.title)))) : (_jsx("div", { className: "bg-card rounded-lg border border-border shadow-card px-5 py-6 flex items-center justify-center", children: _jsx(Text, { variant: "bodySm", className: "text-muted-foreground", children: "No transactions in this category for this month." }) }))] })] }));
}
