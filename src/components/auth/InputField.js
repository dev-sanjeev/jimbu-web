import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Eye, EyeOff } from 'lucide-react';
import { useRef, useState } from 'react';
import { Text } from '@/shared/Text';
import { useIconColors } from '@/hooks/useIconColors';
export function InputField({ label, icon, isPassword, error, style, onBlur, onChangeText, onChange, ...props }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);
    const iconColor = useIconColors();
    const borderClass = error
        ? 'border-destructive'
        : isFocused
            ? 'border-accent'
            : 'border-border';
    const handleChange = (e) => {
        onChange?.(e);
        onChangeText?.(e.target.value);
    };
    return (_jsxs("div", { className: "flex flex-col gap-1.5", style: style, children: [_jsx(Text, { variant: "label", className: "text-foreground", children: label }), _jsxs("div", { className: `h-input flex flex-row items-center rounded-xl bg-card border ${borderClass} cursor-text`, onClick: () => inputRef.current?.focus(), children: [_jsx("div", { className: "pl-3.5", children: icon ? _jsx("div", { className: "mr-3", children: icon }) : null }), _jsx("input", { ref: inputRef, ...props, type: isPassword && !isVisible ? 'password' : 'text', className: "flex-1 text-body-sm text-foreground px-3.5 h-full bg-transparent outline-none min-w-0", placeholder: props.placeholder, value: props.value, onChange: handleChange, onFocus: () => setIsFocused(true), onBlur: (e) => {
                            setIsFocused(false);
                            onBlur?.(e);
                        } }), isPassword && (_jsx("button", { type: "button", className: "pl-3 pr-3.5 flex items-center", onClick: (e) => { e.stopPropagation(); setIsVisible((prev) => !prev); }, children: isVisible ? (_jsx(Eye, { size: 20, color: iconColor.subtle })) : (_jsx(EyeOff, { size: 20, color: iconColor.subtle })) }))] }), error ? (_jsx(Text, { variant: "caption", className: "text-destructive pl-1", children: error })) : null] }));
}
