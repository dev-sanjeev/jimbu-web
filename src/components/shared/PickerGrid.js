import { jsx as _jsx } from "react/jsx-runtime";
export default function PickerGrid({ itemSize = 40, gap = 14, children }) {
    return (_jsx("div", { className: "grid", style: {
            gridTemplateColumns: `repeat(auto-fill, ${itemSize}px)`,
            justifyContent: 'space-between',
            gap: `${gap}px`,
        }, children: children }));
}
