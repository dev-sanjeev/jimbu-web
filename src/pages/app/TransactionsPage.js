import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Filters from '@/components/shared/Filters';
import TransactionCard from '@/components/shared/TransactionCard';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { useGetAccounts } from '@/hooks/accounts/useGetAccounts';
import { useGetTransactions } from '@/hooks/transactions/useGetTransactions';
import { useIconColors } from '@/hooks/useIconColors';
import { Text } from '@/shared/Text';
import { List, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
function formatLabel(date) {
    const today = new Date();
    const yesterday = new Date(Date.now() - 86400000);
    if (isNaN(date.getTime()))
        return 'Unknown Date';
    if (date.toDateString() === today.toDateString())
        return 'Today';
    if (date.toDateString() === yesterday.toDateString())
        return 'Yesterday';
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}
export default function TransactionsPage() {
    const navigate = useNavigate();
    const icon = useIconColors();
    // When rendered at /accounts/:id/transactions, `id` is the account id
    const { id: accountId } = useParams();
    const [filters, setFilters] = useState({});
    const { data, isLoading, isError, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } = useGetTransactions(accountId, filters);
    const { data: accounts } = useGetAccounts();
    const account = accountId
        ? accounts?.find((a) => String(a.id) === String(accountId))
        : undefined;
    const pageTitle = account ? `Transactions for ${account.name}` : undefined;
    const transactions = useMemo(() => data?.pages.flatMap((p) => p.data) ?? [], [data]);
    const sections = useMemo(() => {
        const grouped = transactions.reduce((acc, tx) => {
            const label = formatLabel(new Date(tx.createdAt));
            if (!acc[label])
                acc[label] = [];
            acc[label].push(tx);
            return acc;
        }, {});
        return Object.entries(grouped).map(([title, data]) => ({ title, data }));
    }, [transactions]);
    const handleTransactionPress = (tx) => {
        if (accountId) {
            navigate(`/main/transactions/${tx.id}?accountId=${accountId}`);
        }
        else {
            navigate(`/main/transactions/${tx.id}`);
        }
    };
    return (_jsx(ScreenWrapper, { children: _jsxs("div", { className: "flex flex-col flex-1 relative min-h-0", children: [_jsxs("div", { className: "shrink-0 z-10", children: [pageTitle && (_jsx(Text, { variant: "h3", className: "text-foreground mb-3", children: pageTitle })), _jsx(Filters, { onApply: setFilters })] }), _jsxs("div", { className: "flex-1 overflow-y-auto pt-3 pb-24 flex flex-col gap-4", children: [isLoading && (_jsx("div", { className: "flex items-center justify-center pt-24", children: _jsx("div", { className: "w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" }) })), isError && (_jsxs("div", { className: "flex flex-col items-center justify-center pt-24 gap-3", children: [_jsx(Text, { variant: "body", className: "font-semibold text-foreground", children: "Couldn't load transactions." }), _jsx("button", { type: "button", className: "py-2 px-4 rounded-lg border border-foreground bg-card cursor-pointer", onClick: () => refetch(), children: _jsx(Text, { variant: "label", className: "font-semibold text-foreground", children: "Retry" }) })] })), !isLoading && !isError && sections.length === 0 && (_jsxs("div", { className: "flex flex-col items-center justify-center pt-24 gap-3", children: [_jsx(List, { size: 20, color: icon.accent, strokeWidth: 1.8 }), _jsx(Text, { variant: "body", className: "font-semibold text-foreground mt-4", children: "No Transactions" }), _jsx(Text, { variant: "bodySm", className: "text-muted-foreground mt-2", children: "View all your transactions history" })] })), sections.map((section) => (_jsxs("div", { children: [_jsx(Text, { variant: "caption", className: "text-muted-foreground uppercase tracking-wider mb-2", children: section.title }), _jsx("div", { className: "bg-card rounded-lg border border-border shadow-card overflow-hidden", children: section.data.map((tx, i) => (_jsx(TransactionCard, { tx: tx, showDivider: i < section.data.length - 1, onPress: () => handleTransactionPress(tx) }, tx.id))) })] }, section.title))), hasNextPage && (_jsx("button", { type: "button", disabled: isFetchingNextPage, onClick: () => fetchNextPage(), className: "w-full py-3 text-center rounded-lg bg-card border border-border cursor-pointer", children: isFetchingNextPage ? (_jsx("div", { className: "flex items-center justify-center", children: _jsx("div", { className: "w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" }) })) : (_jsx(Text, { variant: "label", className: "font-semibold text-accent", children: "Load more" })) }))] }), _jsx("button", { type: "button", onClick: () => navigate(accountId ? `/main/transactions/new?accountId=${accountId}` : '/main/transactions/new'), className: "fixed bottom-6 right-6 w-14 h-14 rounded-full bg-accent flex items-center justify-center shadow-lg cursor-pointer border-0 z-10", children: _jsx(Plus, { size: 28, color: "white", strokeWidth: 2.5 }) })] }) }));
}
