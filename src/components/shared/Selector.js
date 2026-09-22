import { jsx as _jsx } from "react/jsx-runtime";
import { Text } from '@/shared/Text';
export default function Selector({ label, transactionType, activeType, onPress, }) {
    const isActive = activeType === transactionType;
    return (_jsx("button", { type: "button", onClick: onPress, className: `flex-1 py-3 rounded-lg flex items-center justify-center cursor-pointer border-0 ${isActive ? 'bg-background-wash' : 'bg-transparent'}`, children: _jsx(Text, { variant: "label", className: `font-semibold ${isActive ? 'text-accent' : 'text-foreground'}`, children: label }) }));
}
