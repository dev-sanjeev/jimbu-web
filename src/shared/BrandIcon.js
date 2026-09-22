import { jsx as _jsx } from "react/jsx-runtime";
export function BrandIcon({ size = 40, radius = 8, className }) {
    return (_jsx("img", { src: "/icon.png", width: size, height: size, style: { borderRadius: radius, display: 'block' }, alt: "Jimbu", className: className }));
}
