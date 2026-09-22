import { jsx as _jsx } from "react/jsx-runtime";
export default function AuthButton({ children, onPress, disabled = false }) {
    return (_jsx("button", { type: "button", className: "h-input rounded-xl flex flex-row items-center justify-center gap-2 bg-accent disabled:opacity-50", onClick: onPress, disabled: disabled, children: children }));
}
