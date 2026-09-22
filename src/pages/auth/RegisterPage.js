import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import AuthButton from '@/components/auth/AuthButton';
import { AuthCard } from '@/components/auth/AuthCard';
import { FormFooter } from '@/components/auth/FormFooter';
import { FormHeader } from '@/components/auth/FormHeader';
import { InputField } from '@/components/auth/InputField';
import PrivacyPolicyView from '@/components/PrivacyPolicyView';
import TermsAndConditionsView from '@/components/TermsAndConditionsView';
import { useCurrentTheme } from '@/hooks/useCurrentTheme';
import { useIconColors } from '@/hooks/useIconColors';
import { useWindowSize } from '@/hooks/useWindowSize';
import { registerUser } from '@/services/auth.service';
import { BrandIcon } from '@/shared/BrandIcon';
import { Text } from '@/shared/Text';
import { useAuthFlowStore } from '@/stores/authFlowStore';
import { ArrowRight, Check, LayoutGrid, Lock, Mail, Users, Wallet, X } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
const WEB_SIDEBAR_BREAKPOINT = 768;
const features = [
    { icon: Users, label: 'Family Collaboration' },
    { icon: Wallet, label: 'Financial Harmony' },
    { icon: LayoutGrid, label: 'Centralized Hub' },
    { icon: Lock, label: 'Secure & Private' },
];
export default function RegisterPage() {
    const navigate = useNavigate();
    const icon = useIconColors();
    const theme = useCurrentTheme();
    const { width: screenWidth } = useWindowSize();
    const isWide = screenWidth >= WEB_SIDEBAR_BREAKPOINT;
    const setFlow = useAuthFlowStore((s) => s.setFlow);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [termsVisible, setTermsVisible] = useState(false);
    const [privacyVisible, setPrivacyVisible] = useState(false);
    const { control, handleSubmit, formState: { errors, isSubmitting, isValid }, } = useForm({
        mode: 'onChange',
        defaultValues: { firstName: '', lastName: '', username: '', password: '' },
    });
    const onSubmit = async (values) => {
        try {
            await registerUser(values);
            await setFlow(values.username, 'register');
            toast.success('Account created', { description: 'Check your email for a verification code.' });
            navigate('/verify');
        }
        catch (e) {
            toast.error('Registration failed', {
                description: e instanceof Error ? e.message : 'Something went wrong. Please try again.',
            });
        }
    };
    const formContent = (_jsxs(AuthCard, { children: [_jsx(FormHeader, { title: "Sign Up", subTitle: "Create your family or personal account." }), _jsxs("div", { className: "flex flex-col gap-4", children: [_jsxs("div", { className: "flex flex-row gap-3", children: [_jsx(Controller, { control: control, name: "firstName", rules: { required: 'Required', minLength: { value: 2, message: 'Too short' } }, render: ({ field: { onChange, onBlur, value } }) => (_jsx(InputField, { label: "First Name", placeholder: "e.g. Ram", value: value, onChangeText: onChange, onBlur: onBlur, error: errors.firstName?.message, style: { flex: 1 } })) }), _jsx(Controller, { control: control, name: "lastName", rules: { required: 'Required', minLength: { value: 2, message: 'Too short' } }, render: ({ field: { onChange, onBlur, value } }) => (_jsx(InputField, { label: "Last Name", placeholder: "e.g. Sharma", value: value, onChangeText: onChange, onBlur: onBlur, error: errors.lastName?.message, style: { flex: 1 } })) })] }), _jsx(Controller, { control: control, name: "username", rules: {
                            required: 'Email is required',
                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address' },
                        }, render: ({ field: { onChange, onBlur, value } }) => (_jsx(InputField, { label: "Email", placeholder: "you@example.com", icon: _jsx(Mail, { size: 20, color: icon.subtle }), value: value, onChangeText: onChange, onBlur: onBlur, error: errors.username?.message, type: "email", autoCapitalize: "none" })) }), _jsx(Controller, { control: control, name: "password", rules: {
                            required: 'Password is required',
                            minLength: { value: 8, message: 'At least 8 characters' },
                        }, render: ({ field: { onChange, onBlur, value } }) => (_jsx(InputField, { label: "Password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", icon: _jsx(Lock, { size: 20, color: icon.subtle }), value: value, onChangeText: onChange, onBlur: onBlur, error: errors.password?.message, isPassword: true })) })] }), _jsxs("div", { className: "flex flex-row items-center gap-3 cursor-pointer", onClick: () => setAcceptedTerms((v) => !v), children: [_jsx("div", { className: "w-5 h-5 rounded border flex items-center justify-center flex-shrink-0", style: {
                            borderColor: acceptedTerms ? theme.colors.accent : undefined,
                            backgroundColor: acceptedTerms ? theme.colors.accent : 'transparent',
                        }, children: acceptedTerms ? _jsx(Check, { size: 14, color: icon.inverse, strokeWidth: 3 }) : null }), _jsxs(Text, { variant: "bodySm", className: "flex-1 text-muted-foreground", style: { lineHeight: '20px' }, children: ["I agree to the", ' ', _jsx(Text, { variant: "bodySm", className: "font-semibold text-accent cursor-pointer", onClick: (e) => { e.stopPropagation(); setTermsVisible(true); }, children: "Terms & Conditions" }), ' ', "and", ' ', _jsx(Text, { variant: "bodySm", className: "font-semibold text-accent cursor-pointer", onClick: (e) => { e.stopPropagation(); setPrivacyVisible(true); }, children: "Privacy Policy" })] })] }), _jsx(AuthButton, { onPress: handleSubmit(onSubmit), disabled: !isValid || !acceptedTerms || isSubmitting, children: isSubmitting ? (_jsx("div", { className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" })) : (_jsxs(_Fragment, { children: [_jsx(Text, { variant: "body", className: "text-white font-semibold", children: "Sign Up" }), _jsx(ArrowRight, { size: 18, color: icon.inverse })] })) }), _jsx(FormFooter, { text: "Already have an account? ", linkText: "Log in here", onPress: () => navigate(-1) })] }));
    return (_jsxs(_Fragment, { children: [isWide ? (_jsx("div", { className: "flex justify-center px-14 min-h-screen", children: _jsxs("div", { className: "flex-1 flex flex-row justify-center gap-12", children: [_jsxs("div", { className: "flex-1 flex flex-col justify-center", children: [_jsxs("div", { className: "flex flex-row items-center gap-3 mb-8", children: [_jsx(BrandIcon, { size: 48 }), _jsx(Text, { variant: "h1", className: "text-foreground", children: "Jimbu" })] }), _jsx(Text, { variant: "h2", className: "text-foreground mb-3", children: "Your family's digital heart." }), _jsx(Text, { variant: "body", className: "text-muted-foreground mb-8", children: "More than just a budget. Jimbu is the central hub for your family\u2014from coordinating finances and tracking spending to managing your household together in one secure place." }), _jsx("div", { className: "flex flex-col gap-4", children: features.map((feature) => (_jsxs("div", { className: "flex flex-row items-center gap-3", children: [_jsx("div", { className: "w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center", children: _jsx(feature.icon, { size: 18, color: icon.accent, strokeWidth: 1.8 }) }), _jsx(Text, { variant: "body", className: "text-foreground", children: feature.label })] }, feature.label))) })] }), _jsx("div", { className: "flex-1 flex flex-col justify-center", children: formContent })] }) })) : (_jsx("div", { className: "min-h-screen overflow-y-auto", children: _jsxs("div", { className: "p-6 pt-8 flex flex-col gap-4 w-full", children: [_jsx("div", { className: "h-10 flex items-center justify-center mb-1", children: _jsxs("div", { className: "flex flex-row items-center gap-2.5", children: [_jsx(BrandIcon, { size: 40 }), _jsx(Text, { variant: "h2", className: "text-foreground", children: "Jimbu" })] }) }), _jsx(Text, { variant: "body", className: "text-foreground text-center mb-3", children: "Your family's digital heart." }), formContent] }) })), termsVisible && (_jsx("div", { className: "fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50", onClick: () => setTermsVisible(false), children: _jsxs("div", { className: "bg-background rounded-t-2xl md:rounded-2xl w-full md:max-w-lg max-h-[80vh] flex flex-col", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex flex-row items-center justify-between px-5 py-3 border-b border-subtle-border", children: [_jsx(Text, { variant: "h3", className: "text-foreground", children: "Terms & Conditions" }), _jsx("button", { type: "button", onClick: () => setTermsVisible(false), className: "w-10 h-10 rounded-lg bg-muted flex items-center justify-center", children: _jsx(X, { size: 20, color: icon.muted, strokeWidth: 1.8 }) })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-5 pb-10", children: _jsx(TermsAndConditionsView, {}) })] }) })), privacyVisible && (_jsx("div", { className: "fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50", onClick: () => setPrivacyVisible(false), children: _jsxs("div", { className: "bg-background rounded-t-2xl md:rounded-2xl w-full md:max-w-lg max-h-[80vh] flex flex-col", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex flex-row items-center justify-between px-5 py-3 border-b border-subtle-border", children: [_jsx(Text, { variant: "h3", className: "text-foreground", children: "Privacy Policy" }), _jsx("button", { type: "button", onClick: () => setPrivacyVisible(false), className: "w-10 h-10 rounded-lg bg-muted flex items-center justify-center", children: _jsx(X, { size: 20, color: icon.muted, strokeWidth: 1.8 }) })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-5 pb-10", children: _jsx(PrivacyPolicyView, {}) })] }) }))] }));
}
