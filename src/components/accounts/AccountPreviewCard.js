import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Text } from '@/shared/Text';
import AccountItem from './AccountItem';
export default function AccountPreviewCard({ name, typeLabel, balance, color, iconName, }) {
    return (_jsxs("div", { className: "mt-2", children: [_jsx(Text, { variant: "caption", className: "font-semibold text-foreground uppercase tracking-wider mb-2 pl-1", children: "Preview" }), _jsx(AccountItem, { name: name || 'Account name', type: typeLabel, balance: balance, iconBg: color, iconName: iconName, isPreview: true })] }));
}
