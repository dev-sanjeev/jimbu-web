import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import AuthButton from '@/components/auth/AuthButton';
import { AuthCard } from '@/components/auth/AuthCard';
import { FormFooter } from '@/components/auth/FormFooter';
import { FormHeader } from '@/components/auth/FormHeader';
import { InputField } from '@/components/auth/InputField';
import { useIconColors } from '@/hooks/useIconColors';
import { useWindowSize } from '@/hooks/useWindowSize';
import { resetPassword } from '@/services/auth.service';
import { BrandIcon } from '@/shared/BrandIcon';
import { Text } from '@/shared/Text';
import { useAuthFlowStore } from '@/stores/authFlowStore';
import { ALargeSmall, Hash, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
const WEB_SIDEBAR_BREAKPOINT = 768;
const tips = [
    { icon: ShieldCheck, label: 'At least 10 characters long' },
    { icon: Hash, label: 'Include numbers and symbols' },
    { icon: ALargeSmall, label: 'Mix upper and lower case' },
    { icon: Sparkles, label: 'Use a password generator' },
];
export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const icon = useIconColors();
    const { width: screenWidth } = useWindowSize();
    const isWide = screenWidth >= WEB_SIDEBAR_BREAKPOINT;
    const email = useAuthFlowStore((s) => s.email);
    const otpCode = useAuthFlowStore((s) => s.otpCode);
    const clearOtpCode = useAuthFlowStore((s) => s.clearOtpCode);
    const clearFlow = useAuthFlowStore((s) => s.clearFlow);
    useEffect(() => {
        if (!email || !otpCode) {
            navigate('/login', { replace: true });
        }
    }, [email, otpCode, navigate]);
    const { control, handleSubmit, watch, formState: { errors, isSubmitting, isValid }, } = useForm({
        mode: 'onChange',
        defaultValues: { newPassword: '', confirmPassword: '' },
    });
    const onSubmit = async (values) => {
        if (!email || !otpCode)
            return;
        try {
            await resetPassword({ username: email, code: otpCode, newPassword: values.newPassword });
            await clearFlow();
            toast.success('Password reset', { description: 'Log in with your new password.' });
            navigate('/login', { replace: true });
        }
        catch (e) {
            const statusCode = e.statusCode;
            if (statusCode === 403) {
                await clearOtpCode();
                toast.error('Code expired', { description: 'Your code has expired. Please request a new one.' });
                navigate('/verify', { replace: true });
                return;
            }
            toast.error('Could not reset password', { description: e instanceof Error ? e.message : 'Please try again.' });
        }
    };
    if (!email || !otpCode)
        return null;
    const formContent = (_jsxs(AuthCard, { children: [_jsx(FormHeader, { title: "New Password", subTitle: "Choose a strong password you haven't used before." }), _jsx(Controller, { control: control, name: "newPassword", rules: {
                    required: 'Password is required',
                    validate: {
                        minLength: (v) => v.length >= 10 || 'At least 10 characters',
                        hasUpper: (v) => /[A-Z]/.test(v) || 'Include an uppercase letter',
                        hasLower: (v) => /[a-z]/.test(v) || 'Include a lowercase letter',
                        hasNumber: (v) => /[0-9]/.test(v) || 'Include a number',
                        hasSpecial: (v) => /[^A-Za-z0-9]/.test(v) || 'Include a special character',
                    },
                }, render: ({ field: { onChange, onBlur, value } }) => (_jsx(InputField, { label: "New Password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", icon: _jsx(Lock, { size: 20, color: icon.subtle }), value: value, onChangeText: onChange, onBlur: onBlur, error: errors.newPassword?.message, isPassword: true })) }), _jsx(Controller, { control: control, name: "confirmPassword", rules: {
                    required: 'Please confirm your password',
                    validate: (v) => v === watch('newPassword') || 'Passwords do not match',
                }, render: ({ field: { onChange, onBlur, value } }) => (_jsx(InputField, { label: "Confirm New Password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", icon: _jsx(Lock, { size: 20, color: icon.subtle }), value: value, onChangeText: onChange, onBlur: onBlur, error: errors.confirmPassword?.message, isPassword: true })) }), _jsx(AuthButton, { onPress: handleSubmit(onSubmit), disabled: !isValid || isSubmitting, children: isSubmitting ? (_jsx("div", { className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" })) : (_jsx(Text, { variant: "body", className: "font-semibold text-white", children: "Reset Password" })) }), _jsx(FormFooter, { text: "Changed your mind? ", linkText: "Log in here", onPress: () => navigate('/login', { replace: true }) })] }));
    if (isWide) {
        return (_jsx("div", { className: "flex justify-center px-14 min-h-screen", children: _jsxs("div", { className: "flex-1 flex flex-row justify-center gap-12", children: [_jsxs("div", { className: "flex-1 flex flex-col justify-center", children: [_jsxs("div", { className: "flex flex-row items-center gap-3 mb-8", children: [_jsx(BrandIcon, { size: 48 }), _jsx(Text, { variant: "h1", className: "text-foreground", children: "Jimbu" })] }), _jsx(Text, { variant: "h2", className: "text-foreground mb-3", children: "Set a strong password." }), _jsx(Text, { variant: "body", className: "text-muted-foreground mb-8", children: "A strong password keeps your account secure. Consider using a password manager to generate and store it safely." }), _jsx("div", { className: "flex flex-col gap-4", children: tips.map((tip) => (_jsxs("div", { className: "flex flex-row items-center gap-3", children: [_jsx("div", { className: "w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center", children: _jsx(tip.icon, { size: 18, color: icon.accent, strokeWidth: 1.8 }) }), _jsx(Text, { variant: "body", className: "text-foreground", children: tip.label })] }, tip.label))) })] }), _jsx("div", { className: "flex-1 flex flex-col justify-center", children: formContent })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen overflow-y-auto", children: _jsxs("div", { className: "p-6 pt-8 flex flex-col gap-4 w-full", children: [_jsx("div", { className: "h-10 flex items-center justify-center mb-1", children: _jsxs("div", { className: "flex flex-row items-center gap-2.5", children: [_jsx(BrandIcon, { size: 40 }), _jsx(Text, { variant: "h2", className: "text-foreground", children: "Jimbu" })] }) }), _jsx(Text, { variant: "body", className: "text-foreground text-center mb-3", children: "Set a strong password." }), formContent] }) }));
}
