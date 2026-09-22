import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useIconColors } from '@/hooks/useIconColors';
import { Text } from '@/shared/Text';
import { Plus } from 'lucide-react';
export default function HeaderCard({ title, buttonText, onButtonPress, }) {
    const icon = useIconColors();
    return (_jsxs("div", { className: "flex flex-row items-center justify-between py-4", children: [_jsx(Text, { variant: "h1", className: "text-foreground", children: title }), buttonText && (_jsxs("button", { type: "button", onClick: onButtonPress, className: "flex flex-row items-center gap-1.5 bg-accent px-4 py-2 rounded-full cursor-pointer border-0", children: [_jsx(Plus, { size: 15, color: icon.inverse, strokeWidth: 2.5 }), _jsx(Text, { variant: "body", className: "text-white font-semibold", children: buttonText })] }))] }));
}
