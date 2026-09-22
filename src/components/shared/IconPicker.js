import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import PickerGrid from '@/components/shared/PickerGrid';
import { useCurrentTheme } from '@/hooks/useCurrentTheme';
import { useIconColors } from '@/hooks/useIconColors';
import { Text } from '@/shared/Text';
export default function IconPicker({ label, icons, value, onChange, }) {
    const theme = useCurrentTheme();
    const icon = useIconColors();
    return (_jsxs("div", { className: "flex flex-col gap-2.5", children: [label ? (_jsx(Text, { variant: "label", className: "font-semibold text-foreground", children: label })) : null, _jsx(PickerGrid, { gap: 10, children: icons.map((item) => {
                    const Icon = item.component;
                    const active = item.id === value;
                    return (_jsx("button", { type: "button", onClick: () => onChange(item.id), className: `w-10 h-10 flex items-center justify-center rounded-xl border cursor-pointer ${active
                            ? 'bg-accent-subtle border-accent'
                            : 'bg-card border-subtle-border'}`, children: _jsx(Icon, { size: 20, color: active ? theme.colors.accent : icon.muted, strokeWidth: 1.8 }) }, item.id));
                }) })] }));
}
