import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PRIVACY_LAST_UPDATED, PRIVACY_POLICY } from '@/shared/privacyPolicy';
import { Text } from '@/shared/Text';
export default function PrivacyPolicyView() {
    return (_jsxs("div", { className: "flex flex-col gap-5", children: [_jsxs("div", { className: "flex flex-col gap-1", children: [_jsx(Text, { variant: "h2", className: "text-foreground", children: "Privacy Policy" }), _jsxs(Text, { variant: "caption", className: "text-muted-foreground", children: ["Last updated ", PRIVACY_LAST_UPDATED] })] }), PRIVACY_POLICY.map((section) => (_jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsx(Text, { variant: "h3", className: "text-foreground", children: section.heading }), _jsx(Text, { variant: "body", className: "text-muted-foreground", children: section.body })] }, section.heading)))] }));
}
