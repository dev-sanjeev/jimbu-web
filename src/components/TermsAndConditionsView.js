import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TERMS_AND_CONDITIONS, TERMS_LAST_UPDATED } from '@/shared/termsAndConditions';
import { Text } from '@/shared/Text';
export default function TermsAndConditionsView() {
    return (_jsxs("div", { className: "flex flex-col gap-5", children: [_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx(Text, { variant: "h2", className: "text-foreground", children: "Terms & Conditions" }), _jsxs(Text, { variant: "caption", className: "text-muted-foreground", children: ["Last updated ", TERMS_LAST_UPDATED] })] }), TERMS_AND_CONDITIONS.map((section) => (_jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsx(Text, { variant: "h3", className: "text-foreground", children: section.heading }), _jsx(Text, { variant: "body", className: "text-muted-foreground", children: section.body })] }, section.heading)))] }));
}
