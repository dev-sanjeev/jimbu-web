import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import CategoryProgressRow from '@/components/shared/CategoryProgressRow';
import EmptyMonthCategoriesState from '@/components/shared/EmptyMonthCategoriesState';
import EmptyRecentTransactionsState from '@/components/shared/EmptyRecentTransactionsState';
import HeroCard from '@/components/shared/HeroCard';
import HeroChip from '@/components/shared/HeroChip';
import MonthSpendAreaChart from '@/components/shared/MonthSpendAreaChart';
import MonthTotalCard from '@/components/shared/MonthTotalCard';
import SectionHeader from '@/components/shared/SectionHeader';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import TransactionCard from '@/components/shared/TransactionCard';
import { useGetTransactions } from '@/hooks/transactions/useGetTransactions';
import { useGetTransactionsTimeframe } from '@/hooks/transactions/useGetTransactionsTimeframe';
import { firstOfMonth, monthBoundsISO } from '@/shared/dateRange';
import { Text } from '@/shared/Text';
import { useAuthStore } from '@/stores/authStore';
import { Plus, Wallet } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
export default function HomePage() {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const { monthStart, monthEnd, monthDate } = useMemo(() => {
        const anchor = firstOfMonth(new Date());
        const { start, end } = monthBoundsISO(anchor);
        return { monthStart: start, monthEnd: end, monthDate: anchor };
    }, []);
    const { data: timeframeData, isError: isTimeframeError, refetch: refetchTimeframe, } = useGetTransactionsTimeframe(monthStart, monthEnd);
    const monthTransactions = useMemo(() => timeframeData?.data ?? [], [timeframeData]);
    const { monthTotal, topCategories } = useMemo(() => {
        const expenses = monthTransactions.filter((t) => t.type === 'expense');
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
            topCategories: Array.from(byCategory.values()).sort((a, b) => b.amount - a.amount).slice(0, 3),
        };
    }, [monthTransactions]);
    const { data: myData, isError: isTransactionsError, refetch: refetchTransactions, } = useGetTransactions();
    const recentTransactions = useMemo(() => myData?.pages[0]?.data?.slice(0, 3) ?? [], [myData]);
    const isError = isTimeframeError || isTransactionsError;
    if (isError) {
        return (_jsxs("div", { className: "flex-1 flex flex-col items-center justify-center gap-3 px-6", children: [_jsx(Text, { variant: "body", className: "font-semibold text-foreground", children: "Couldn't load your home screen." }), _jsx("button", { type: "button", className: "py-2 px-4 rounded-lg border border-foreground bg-card cursor-pointer", onClick: () => { refetchTimeframe(); refetchTransactions(); }, children: _jsx(Text, { variant: "label", className: "font-semibold text-foreground", children: "Retry" }) })] }));
    }
    return (_jsxs(ScreenWrapper, { children: [_jsxs("div", { className: "flex-1 overflow-y-auto pb-24 relative", children: [_jsx(HeroCard, { title: `${user?.firstName},`, subtitle: "Here is a simple overview of your everyday finances and your family budget for this month.", children: _jsx(HeroChip, { icon: Wallet, label: "Welcome back" }) }), _jsxs("div", { className: "mt-5 bg-card rounded-lg border border-border shadow-card px-5 py-6", children: [_jsx(MonthTotalCard, { total: monthTotal }), _jsx("div", { className: "mt-2", children: _jsx(MonthSpendAreaChart, { transactions: monthTransactions, month: monthDate }) })] }), _jsxs("div", { className: "mt-5", children: [_jsx(SectionHeader, { title: "Top Categories", onSeeAllPress: () => navigate('/main/spend-categories') }), topCategories.length > 0 ? (_jsx("div", { className: "bg-card rounded-lg border border-border shadow-card overflow-hidden", children: topCategories.map((cat, index) => (_jsx(CategoryProgressRow, { name: cat.name, icon: cat.icon, color: cat.color, amount: cat.amount, percentage: monthTotal > 0 ? (cat.amount / monthTotal) * 100 : 0, showDivider: index < topCategories.length - 1 }, cat.categoryId))) })) : (_jsx("div", { className: "bg-card rounded-lg border border-border shadow-card px-5 py-5", children: _jsx(EmptyMonthCategoriesState, { variant: "current", onAddExpense: () => navigate('/main/transactions/new') }) }))] }), _jsxs("div", { className: "mt-5", children: [_jsx(SectionHeader, { title: "Recent Transactions", onSeeAllPress: () => navigate('/main/transactions') }), recentTransactions.length > 0 ? (_jsx("div", { className: "bg-card rounded-lg border border-border shadow-card", children: recentTransactions.map((tx, index) => (_jsx(TransactionCard, { tx: tx, showDivider: index < recentTransactions.length - 1 }, tx.id))) })) : (_jsx("div", { className: "bg-card rounded-lg border border-border shadow-card px-5 py-5", children: _jsx(EmptyRecentTransactionsState, { onAddExpense: () => navigate('/main/transactions/new') }) }))] })] }), _jsx("button", { type: "button", onClick: () => navigate('/main/transactions/new'), className: "fixed bottom-6 right-6 w-14 h-14 rounded-full bg-accent flex items-center justify-center shadow-lg cursor-pointer border-0 z-10", children: _jsx(Plus, { size: 28, color: "white", strokeWidth: 2.5 }) })] }));
}
