import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Text } from '@/shared/Text';
export default function SectionHeader({ title, onSeeAllPress, showSeeAll = true, }) {
    return (_jsxs("div", { className: "flex flex-row justify-between items-center mb-3", children: [_jsx(Text, { variant: "h3", className: "text-foreground", children: title }), showSeeAll && onSeeAllPress && (_jsx("button", { type: "button", onClick: onSeeAllPress, className: "cursor-pointer bg-transparent border-0 p-0", children: _jsx(Text, { variant: "label", className: "font-semibold text-accent", children: "See All" }) }))] }));
}
