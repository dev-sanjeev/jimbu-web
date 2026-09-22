import { jsx as _jsx } from "react/jsx-runtime";
export const AuthCard = ({ children }) => {
    return (_jsx("div", { className: "bg-card border border-border rounded-xl p-4 flex flex-col gap-5 shadow-auth", children: children }));
};
