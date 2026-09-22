import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { resolveLucideIcon } from '@/components/accounts/lucideIcon';
import { useIconColors } from '@/hooks/useIconColors';
import { Text } from '@/shared/Text';
import { ChevronRight } from 'lucide-react';
export default function CategoryProgressRow({ name, icon, color, amount, percentage, showDivider = false, onPress, }) {
    const fallbackColor = color || '#6c63ff';
    const Icon = resolveLucideIcon(icon || 'tag');
    const iconColors = useIconColors();
    const safePct = Math.max(0, Math.min(100, percentage));
    const isPressable = !!onPress;
    return (_jsxs("div", { className: `flex flex-row items-center gap-3 p-4 ${showDivider ? 'border-b border-border' : ''} ${isPressable ? 'cursor-pointer' : ''}`, onClick: onPress, children: [_jsx("div", { className: "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", style: { backgroundColor: fallbackColor + '26' }, children: _jsx(Icon, { size: 20, color: fallbackColor, strokeWidth: 1.8 }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex flex-row justify-between items-center mb-1.5", children: [_jsx(Text, { variant: "body", className: "text-foreground font-semibold truncate", children: name }), _jsxs(Text, { variant: "body", className: "font-semibold text-foreground ml-2 flex-shrink-0", children: ["$", amount.toFixed(2)] })] }), _jsxs("div", { className: "flex flex-row items-center gap-3", children: [_jsx("div", { className: "flex-1 h-1 bg-muted rounded-full overflow-hidden", children: _jsx("div", { style: {
                                        width: `${safePct}%`,
                                        backgroundColor: fallbackColor,
                                        height: '100%',
                                    } }) }), _jsxs(Text, { variant: "caption", className: "text-muted-foreground w-16 text-right flex-shrink-0", children: [Number(safePct.toFixed(2)), "%"] })] })] }), isPressable && (_jsx(ChevronRight, { size: 18, color: iconColors.default, strokeWidth: 2 }))] }));
}
