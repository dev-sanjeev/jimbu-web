import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useIconColors } from '@/hooks/useIconColors';
import { Text } from '@/shared/Text';
import { ChevronRight } from 'lucide-react';
import { resolveLucideIcon } from './lucideIcon';
function formatBalance(balance) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(balance);
}
export default function AccountItem({ name, type, balance, iconBg, iconName, onPress, isPreview = false, isLast, }) {
    const Icon = resolveLucideIcon(iconName);
    const icon = useIconColors();
    const grouped = isLast !== undefined;
    const standaloneClass = 'flex flex-row items-center bg-card rounded-xl border border-border shadow-card p-4 gap-3 overflow-hidden';
    const rowClass = `flex flex-row items-center p-4 gap-3 ${isLast ? '' : 'border-b border-border'}`;
    const containerClass = `${grouped ? rowClass : standaloneClass} ${!isPreview && onPress ? 'cursor-pointer' : ''}`;
    return (_jsxs("div", { className: containerClass, onClick: onPress, children: [_jsx("div", { className: "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", style: { backgroundColor: iconBg }, children: _jsx(Icon, { size: 20, color: icon.inverse, strokeWidth: 2 }) }), _jsxs("div", { className: "flex-1 min-w-0 flex flex-col gap-0.5", children: [_jsx(Text, { variant: "body", className: "text-foreground font-semibold truncate", children: name }), _jsx(Text, { variant: "caption", className: "text-muted-foreground", children: type })] }), _jsxs("div", { className: "flex flex-col items-end gap-1 flex-shrink-0", children: [!!balance && (_jsx(Text, { variant: "label", className: "font-semibold text-foreground", children: formatBalance(balance) })), !isPreview && (_jsx(ChevronRight, { size: 20, color: icon.default, strokeWidth: 2 }))] })] }));
}
