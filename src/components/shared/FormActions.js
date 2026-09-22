import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Text } from '@/shared/Text';
export default function FormActions({ onCancel, onSave, saveLabel, cancelLabel = 'Cancel', isSaving, disabled, }) {
    const saving = isSaving || disabled;
    return (_jsxs("div", { className: "flex flex-row gap-3", children: [_jsx("button", { type: "button", onClick: onCancel, disabled: isSaving, className: "flex-1 h-14 rounded-lg flex items-center justify-center bg-card border border-subtle-border cursor-pointer", children: _jsx(Text, { variant: "body", className: "font-semibold text-foreground", children: cancelLabel }) }), _jsx("button", { type: "button", onClick: onSave, disabled: saving, className: "flex-1 h-14 rounded-lg flex items-center justify-center cursor-pointer bg-accent disabled:opacity-60", children: isSaving ? (_jsx("div", { className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" })) : (_jsx(Text, { variant: "body", className: "font-semibold text-white", children: saveLabel })) })] }));
}
