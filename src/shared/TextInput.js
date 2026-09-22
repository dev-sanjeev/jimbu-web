import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from 'react';
export const TextInput = forwardRef(function TextInput({ onChangeText, className, ...rest }, ref) {
    return (_jsx("input", { ref: ref, className: ['bg-transparent outline-none w-full', className].filter(Boolean).join(' '), style: rest.style, onChange: (e) => onChangeText?.(e.target.value), ...rest }));
});
