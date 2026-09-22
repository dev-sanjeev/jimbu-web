import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { resolveLucideIcon } from '@/components/accounts/lucideIcon';
import { useIconColors } from '@/hooks/useIconColors';
import { Text } from '@/shared/Text';
import { ChevronRight } from 'lucide-react';
const formatTime = (date) => isNaN(date.getTime())
    ? ''
    : date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
export const TransactionCard = ({ tx, showDivider = false, onPress, }) => {
    const isExpense = tx.type === 'expense';
    const color = tx.categoryColor || '#6c63ff';
    const Icon = resolveLucideIcon(tx.categoryIcon || 'receipt');
    const iconColors = useIconColors();
    const isPressable = !!onPress;
    return (_jsxs("div", { className: `flex flex-row items-center p-4 gap-3 ${showDivider ? 'border-b border-border' : ''} ${isPressable ? 'cursor-pointer' : ''}`, onClick: onPress, children: [_jsx("div", { className: "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", style: { backgroundColor: color + '18' }, children: _jsx(Icon, { size: 20, color: color, strokeWidth: 1.8 }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx(Text, { variant: "body", className: "text-foreground font-semibold truncate", children: tx.categoryName }), _jsx(Text, { variant: "caption", className: "text-muted-foreground mt-1 block", children: formatTime(new Date(tx.createdAt)) })] }), _jsxs(Text, { variant: "body", className: `font-semibold flex-shrink-0 ${isExpense ? 'text-destructive' : 'text-success'}`, children: ["$", Number(tx.amount).toFixed(2)] }), isPressable && (_jsx(ChevronRight, { size: 16, color: iconColors.default, strokeWidth: 2 }))] }));
};
export default TransactionCard;
