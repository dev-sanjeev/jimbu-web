import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import AuthButton from '@/components/auth/AuthButton';
import { AuthCard } from '@/components/auth/AuthCard';
import { FormFooter } from '@/components/auth/FormFooter';
import { OtpBoxInput } from '@/components/auth/OtpBoxInput';
import { useIconColors } from '@/hooks/useIconColors';
import { useWindowSize } from '@/hooks/useWindowSize';
import { resendResetCode, resendVerificationToken, verifyAccount } from '@/services/auth.service';
import { BrandIcon } from '@/shared/BrandIcon';
import { Text } from '@/shared/Text';
import { useAuthFlowStore } from '@/stores/authFlowStore';
import { Clock, Inbox, Mail, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
const WEB_SIDEBAR_BREAKPOINT = 768;
const tips = [
    { icon: Clock, label: 'Code expires after a short window' },
    { icon: Inbox, label: 'Check your spam folder too' },
    { icon: ShieldCheck, label: 'Never share your code with anyone' },
];
function maskEmail(email) {
    const [local, domain] = email.split('@');
    if (!local || !domain)
        return email;
    return `${local[0]}***@${domain}`;
}
export default function OtpVerificationPage() {
    const navigate = useNavigate();
    const icon = useIconColors();
    const { width: screenWidth } = useWindowSize();
    const isWide = screenWidth >= WEB_SIDEBAR_BREAKPOINT;
    const email = useAuthFlowStore((s) => s.email);
    const mode = useAuthFlowStore((s) => s.mode);
    const setOtpCode = useAuthFlowStore((s) => s.setOtpCode);
    const clearOtpCode = useAuthFlowStore((s) => s.clearOtpCode);
    const clearFlow = useAuthFlowStore((s) => s.clearFlow);
    const [cooldown, setCooldown] = useState(0);
    useEffect(() => {
        if (!email || !mode) {
            navigate('/login', { replace: true });
        }
    }, [email, mode, navigate]);
    useEffect(() => {
        if (cooldown <= 0)
            return;
        const id = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
        return () => clearInterval(id);
    }, [cooldown]);
    const { control, handleSubmit, formState: { errors, isSubmitting }, } = useForm({ defaultValues: { code: '' } });
    const onSubmit = async (values) => {
        if (!email || !mode)
            return;
        try {
            if (mode === 'reset') {
                await setOtpCode(values.code);
                navigate('/reset-password');
            }
            else {
                await verifyAccount({ username: email, token: values.code });
                await clearFlow();
                toast.success('Email verified', { description: 'You can now log in.' });
                navigate('/login', { replace: true });
            }
        }
        catch (e) {
            const message = e instanceof Error ? e.message : 'Please try again.';
            if (mode === 'register' && message.toLowerCase().includes('already been verified')) {
                await clearFlow();
                toast.success('Already verified', { description: 'You can log in.' });
                navigate('/login', { replace: true });
                return;
            }
            toast.error('Verification failed', { description: message });
        }
    };
    const handleResend = async () => {
        if (!email || cooldown > 0)
            return;
        try {
            await (mode === 'reset' ? resendResetCode(email) : resendVerificationToken(email));
            toast.success('Code sent', { description: 'Check your email.' });
            setCooldown(60);
        }
        catch (e) {
            toast.error("Couldn't resend code", { description: e instanceof Error ? e.message : 'Please try again.' });
        }
    };
    const handleWrongEmail = async () => {
        await clearOtpCode();
        navigate('/forgot-password', { replace: true });
    };
    if (!email || !mode)
        return null;
    const cardContent = (_jsxs(AuthCard, { children: [_jsxs("div", { className: "flex flex-col items-center gap-3 pt-2", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center", children: _jsx(Mail, { size: 24, color: icon.accent, strokeWidth: 1.8 }) }), _jsx(Text, { variant: "h3", className: "text-foreground text-center", children: "Check your email" }), _jsx(Text, { variant: "bodySm", className: "text-muted-foreground text-center", children: "We sent a 6-digit verification code to" }), _jsx(Text, { variant: "body", className: "font-semibold text-foreground text-center", children: maskEmail(email) }), _jsx(Text, { variant: "label", className: "text-muted-foreground text-center mt-1", children: "Enter the code below" })] }), _jsx(Controller, { control: control, name: "code", rules: {
                    required: 'Code is required',
                    pattern: { value: /^\d{6}$/, message: 'Enter all 6 digits' },
                }, render: ({ field: { onChange, value } }) => (_jsx(OtpBoxInput, { value: value, onChange: onChange, error: !!errors.code })) }), errors.code && (_jsx(Text, { variant: "caption", className: "text-destructive text-center -mt-2", children: errors.code.message })), _jsx(AuthButton, { onPress: handleSubmit(onSubmit), disabled: isSubmitting, children: isSubmitting ? (_jsx("div", { className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" })) : (_jsx(Text, { variant: "body", className: "font-semibold text-white", children: mode === 'reset' ? 'Continue' : 'Verify' })) }), _jsx(FormFooter, { text: "Didn't get a code? ", linkText: cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code', onPress: handleResend }), mode === 'reset' && (_jsx(FormFooter, { text: "Wrong email? ", linkText: "Go back", onPress: handleWrongEmail }))] }));
    if (isWide) {
        return (_jsx("div", { className: "flex justify-center px-14 min-h-screen", children: _jsxs("div", { className: "flex-1 flex flex-row justify-center gap-12", children: [_jsxs("div", { className: "flex-1 flex flex-col justify-center", children: [_jsxs("div", { className: "flex flex-row items-center gap-3 mb-8", children: [_jsx(BrandIcon, { size: 48 }), _jsx(Text, { variant: "h1", className: "text-foreground", children: "Jimbu" })] }), _jsx(Text, { variant: "h2", className: "text-foreground mb-3", children: "Your security matters." }), _jsx(Text, { variant: "body", className: "text-muted-foreground mb-8", children: "Email verification ensures only you can access your account. Your code is valid for a short window \u2014 act quickly." }), _jsx("div", { className: "flex flex-col gap-4", children: tips.map((tip) => (_jsxs("div", { className: "flex flex-row items-center gap-3", children: [_jsx("div", { className: "w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center", children: _jsx(tip.icon, { size: 18, color: icon.accent, strokeWidth: 1.8 }) }), _jsx(Text, { variant: "body", className: "text-foreground", children: tip.label })] }, tip.label))) })] }), _jsx("div", { className: "flex-1 flex flex-col justify-center", children: cardContent })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen overflow-y-auto", children: _jsxs("div", { className: "p-6 pt-8 flex flex-col gap-4 w-full", children: [_jsx("div", { className: "h-10 flex items-center justify-center mb-1", children: _jsxs("div", { className: "flex flex-row items-center gap-2.5", children: [_jsx(BrandIcon, { size: 40 }), _jsx(Text, { variant: "h2", className: "text-foreground", children: "Jimbu" })] }) }), _jsx(Text, { variant: "body", className: "text-foreground text-center mb-3", children: "Your security matters." }), cardContent] }) }));
}
