import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const FormFooter = ({ text, linkText, onPress }) => {
    return (_jsx("div", { className: "flex items-center justify-center pt-1", children: _jsxs("span", { className: "text-body-sm font-normal text-muted-foreground text-center", children: [text, _jsx("span", { className: "font-medium text-accent cursor-pointer", onClick: onPress, children: linkText })] }) }));
};
