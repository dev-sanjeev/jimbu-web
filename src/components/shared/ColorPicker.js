import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PickerGrid from '@/components/shared/PickerGrid';
import { Text } from '@/shared/Text';
export default function ColorPicker({ label, colors, value, onChange, }) {
    return (_jsxs("div", { className: "flex flex-col gap-2.5", children: [label ? (_jsx(Text, { variant: "label", className: "text-foreground", children: label })) : null, _jsx(PickerGrid, { gap: 14, children: colors.map((color) => {
                    const active = color === value;
                    return (_jsx("button", { type: "button", onClick: () => onChange(color), className: `w-10 h-10 rounded-full flex items-center justify-center cursor-pointer bg-transparent border-0 p-0 ${active ? 'outline outline-2 outline-foreground outline-offset-1' : ''}`, children: _jsx("div", { className: "w-full h-full rounded-full", style: { backgroundColor: color } }) }, color));
                }) })] }));
}
