import { jsx as _jsx } from "react/jsx-runtime";
import { Text } from '@/shared/Text';
export default function SaveButton({ handleSave, buttonText }) {
    return (_jsx("button", { type: "button", onClick: handleSave, className: "h-input flex flex-row items-center justify-center gap-2 rounded-lg cursor-pointer w-full bg-accent", children: _jsx(Text, { variant: "body", className: "font-semibold text-white", children: buttonText }) }));
}
