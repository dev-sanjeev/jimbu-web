import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import AccountItem from '@/components/accounts/AccountItem';
import Group from '@/components/accounts/Group';
import HeaderCard from '@/components/accounts/HeaderCard';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { useGetAccounts } from '@/hooks/accounts/useGetAccounts';
import { ACCOUNT_TYPE_LABELS } from '@/interfaces/Account';
import { Text } from '@/shared/Text';
import { useNavigate } from 'react-router-dom';
const SECTION_TITLES = {
    cash: 'Cash',
    bank: 'Bank Accounts',
    credit_card: 'Credit Cards',
    digital_wallet: 'Digital Wallets',
};
function groupByType(accounts) {
    return accounts.reduce((acc, account) => {
        const bucket = acc[account.accountType] ?? [];
        bucket.push(account);
        acc[account.accountType] = bucket;
        return acc;
    }, {});
}
const ORDERED_TYPES = Object.keys(ACCOUNT_TYPE_LABELS);
export default function AccountsPage() {
    const navigate = useNavigate();
    const { data: accounts, isLoading, isError, refetch } = useGetAccounts();
    const grouped = accounts ? groupByType(accounts) : {};
    return (_jsxs(ScreenWrapper, { children: [_jsx(HeaderCard, { title: "Accounts", buttonText: "New", onButtonPress: () => navigate('/main/accounts/new') }), _jsxs("div", { className: "flex-1 overflow-y-auto pb-8 pt-4 flex flex-col gap-6", children: [isLoading && (_jsx("div", { className: "flex items-center justify-center py-10", children: _jsx("div", { className: "w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" }) })), isError && (_jsxs("div", { className: "flex flex-col items-center justify-center py-10 gap-3", children: [_jsx(Text, { variant: "bodySm", className: "text-foreground", children: "Couldn't load accounts." }), _jsx("button", { type: "button", className: "py-2 px-4 rounded-lg border border-foreground bg-card cursor-pointer", onClick: () => refetch(), children: _jsx(Text, { variant: "label", className: "font-semibold text-foreground", children: "Retry" }) })] })), !isLoading && !isError && accounts && (_jsx("div", { className: "flex flex-col gap-5", children: ORDERED_TYPES.map((type) => {
                            const groupAccounts = grouped[type];
                            if (!groupAccounts || groupAccounts.length === 0)
                                return null;
                            return (_jsx(Group, { title: SECTION_TITLES[type], children: groupAccounts.map((account, i) => (_jsx(AccountItem, { name: account.name, type: ACCOUNT_TYPE_LABELS[type], balance: account.balance, iconBg: account.color, iconName: account.icon, isLast: i === groupAccounts.length - 1, onPress: () => navigate(`/main/accounts/${account.id}`) }, account.id))) }, type));
                        }) }))] })] }));
}
