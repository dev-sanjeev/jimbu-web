import { jsx as _jsx } from "react/jsx-runtime";
import PrivacyPolicyView from '@/components/PrivacyPolicyView';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
export default function PrivacyPage() {
    return (_jsx(ScreenWrapper, { children: _jsx("div", { className: "flex-1 overflow-y-auto pt-4 pb-12", children: _jsx(PrivacyPolicyView, {}) }) }));
}
