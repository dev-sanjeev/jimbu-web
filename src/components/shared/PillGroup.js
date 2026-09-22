import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useIconColors } from '@/hooks/useIconColors';
import { Text } from '@/shared/Text';
import { Check } from 'lucide-react';
export default function PillGroup({ label, options, value, onChange, }) {
    const icon = useIconColors();
    return (_jsxs("div", { className: "flex flex-col gap-2.5", children: [label ? (_jsx(Text, { variant: "label", className: "font-semibold text-foreground", children: label })) : null, _jsx("div", { className: "flex flex-row flex-wrap gap-2.5", children: options.map((option) => {
                    const active = option.value === value;
                    return (_jsxs("button", { type: "button", onClick: () => onChange(option.value), className: `h-10 px-4 rounded-full flex items-center justify-center border flex-row gap-1.5 cursor-pointer ${active
                            ? 'bg-accent border-accent'
                            : 'bg-card border-subtle-border'}`, children: [active && (_jsx(Check, { size: 13, color: icon.inverse, strokeWidth: 2.5 })), _jsx(Text, { variant: "label", className: active ? 'font-semibold text-white' : 'font-medium text-foreground', children: option.label })] }, option.value));
                }) })] }));
}
