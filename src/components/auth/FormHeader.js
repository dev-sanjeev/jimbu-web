import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Text } from '@/shared/Text';
export const FormHeader = ({ title, subTitle }) => {
    return (_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx(Text, { variant: "h3", className: "text-foreground", children: title }), _jsx(Text, { variant: "bodySm", className: "text-muted-foreground", children: subTitle })] }));
};
