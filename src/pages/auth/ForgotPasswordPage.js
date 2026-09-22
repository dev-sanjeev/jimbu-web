import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import AuthButton from '@/components/auth/AuthButton';
import { AuthCard } from '@/components/auth/AuthCard';
import { FormFooter } from '@/components/auth/FormFooter';
import { FormHeader } from '@/components/auth/FormHeader';
import { InputField } from '@/components/auth/InputField';
import { useIconColors } from '@/hooks/useIconColors';
import { useWindowSize } from '@/hooks/useWindowSize';
import { forgotPassword } from '@/services/auth.service';
import { BrandIcon } from '@/shared/BrandIcon';
import { Text } from '@/shared/Text';
import { useAuthFlowStore } from '@/stores/authFlowStore';
import { KeyRound, Lock, Mail, ShieldCheck } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
const WEB_SIDEBAR_BREAKPOINT = 768;
const tips = [
    { icon: ShieldCheck, label: 'Use a password manager' },
    { icon: KeyRound, label: 'Generate unique passwords' },
    { icon: Lock, label: 'Store credentials securely' },
];
export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const icon = useIconColors();
    const { width: screenWidth } = useWindowSize();
    const isWide = screenWidth >= WEB_SIDEBAR_BREAKPOINT;
    const storedEmail = useAuthFlowStore((s) => s.email);
    const setFlow = useAuthFlowStore((s) => s.setFlow);
    const { control, handleSubmit, formState: { errors, isSubmitting }, } = useForm({
        defaultValues: { username: storedEmail ?? '' },
    });
    const onSubmit = async (values) => {
        try {
            await forgotPassword(values.username);
            await setFlow(values.username, 'reset');
            toast.success('Check your email', { description: 'If an account exists, a reset code has been sent.' });
            navigate('/verify');
        }
        catch (e) {
            toast.error('Something went wrong', { description: e instanceof Error ? e.message : 'Please try again.' });
        }
    };
    const formContent = (_jsxs(AuthCard, { children: [_jsx(FormHeader, { title: "Reset Password", subTitle: "We'll email you a 6-digit code." }), _jsx(Controller, { control: control, name: "username", rules: {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address' },
                }, render: ({ field: { onChange, onBlur, value } }) => (_jsx(InputField, { label: "Email", placeholder: "you@example.com", icon: _jsx(Mail, { size: 20, color: icon.subtle }), value: value, onChangeText: onChange, onBlur: onBlur, error: errors.username?.message, type: "email", autoCapitalize: "none" })) }), _jsx(AuthButton, { onPress: handleSubmit(onSubmit), disabled: isSubmitting, children: isSubmitting ? (_jsx("div", { className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" })) : (_jsx(Text, { variant: "body", className: "font-semibold text-white", children: "Send Reset Code" })) }), _jsx(FormFooter, { text: "Remembered your password? ", linkText: "Log in here", onPress: () => navigate(-1) })] }));
    if (isWide) {
        return (_jsx("div", { className: "flex justify-center px-14 min-h-screen", children: _jsxs("div", { className: "flex-1 flex flex-row justify-center gap-12", children: [_jsxs("div", { className: "flex-1 flex flex-col justify-center", children: [_jsxs("div", { className: "flex flex-row items-center gap-3 mb-8", children: [_jsx(BrandIcon, { size: 48 }), _jsx(Text, { variant: "h1", className: "text-foreground", children: "Jimbu" })] }), _jsx(Text, { variant: "h2", className: "text-foreground mb-3", children: "Keep your credentials safe." }), _jsx(Text, { variant: "body", className: "text-muted-foreground mb-8", children: "Instead of resetting your password frequently, consider storing it in a password manager. It keeps all your credentials safe, encrypted, and easy to access." }), _jsx("div", { className: "flex flex-col gap-4", children: tips.map((tip) => (_jsxs("div", { className: "flex flex-row items-center gap-3", children: [_jsx("div", { className: "w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center", children: _jsx(tip.icon, { size: 18, color: icon.accent, strokeWidth: 1.8 }) }), _jsx(Text, { variant: "body", className: "text-foreground", children: tip.label })] }, tip.label))) })] }), _jsx("div", { className: "flex-1 flex flex-col justify-center", children: formContent })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen overflow-y-auto", children: _jsxs("div", { className: "p-6 pt-8 flex flex-col gap-4 w-full", children: [_jsx("div", { className: "h-10 flex items-center justify-center mb-1", children: _jsxs("div", { className: "flex flex-row items-center gap-2.5", children: [_jsx(BrandIcon, { size: 40 }), _jsx(Text, { variant: "h2", className: "text-foreground", children: "Jimbu" })] }) }), _jsx(Text, { variant: "body", className: "text-foreground text-center mb-3", children: "Keep your credentials safe." }), formContent] }) }));
}
