import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import AuthButton from "@/components/auth/AuthButton";
import { AuthCard } from "@/components/auth/AuthCard";
import { FormFooter } from "@/components/auth/FormFooter";
import { FormHeader } from "@/components/auth/FormHeader";
import { InputField } from "@/components/auth/InputField";
import { useIconColors } from "@/hooks/useIconColors";
import { useWindowSize } from "@/hooks/useWindowSize";
import { loginUser } from "@/services/auth.service";
import { getDeviceId, getDeviceName } from "@/services/device.service";
import { BrandIcon } from "@/shared/BrandIcon";
import LoadingScreen from "@/shared/LoadingScreen";
import { Text } from "@/shared/Text";
import { useAuthStore } from "@/stores/authStore";
import { ArrowRight, BarChart3, Lock, Mail, Tags, Users, Wallet, } from "lucide-react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
const WEB_SIDEBAR_BREAKPOINT = 768;
const features = [
    { icon: Wallet, label: "Multi-account tracking" },
    { icon: Tags, label: "Smart categorization" },
    { icon: Users, label: "Family budget management" },
    { icon: BarChart3, label: "Spending insights" },
];
export default function LoginPage() {
    const navigate = useNavigate();
    const setToken = useAuthStore((state) => state.setToken);
    const icon = useIconColors();
    const { width: screenWidth } = useWindowSize();
    const isWide = screenWidth >= WEB_SIDEBAR_BREAKPOINT;
    const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
    const { control, handleSubmit, formState: { errors, isSubmitting, isValid }, } = useForm({
        mode: "onChange",
        defaultValues: { username: "", password: "" },
    });
    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true);
        const deviceId = await getDeviceId();
        const deviceName = getDeviceName();
        const apiBase = import.meta.env.VITE_API_URL;
        const authUrl = `${apiBase}/auth/google` +
            `?deviceId=${encodeURIComponent(deviceId)}` +
            `&deviceName=${encodeURIComponent(deviceName)}`;
        window.location.href = authUrl;
    };
    const onSubmit = async (values) => {
        try {
            const data = await loginUser(values);
            await setToken(data.accessToken, data.refreshToken);
            navigate("/main");
        }
        catch (e) {
            const message = e instanceof Error ? e.message : "Invalid username or password.";
            toast.error("Login failed", { description: message });
        }
    };
    if (isSubmitting) {
        return _jsx(LoadingScreen, {});
    }
    const formContent = (_jsxs(AuthCard, { children: [_jsx(FormHeader, { title: "Log In", subTitle: "Access your family or personal budget." }), _jsxs("div", { className: "flex flex-col gap-4", children: [_jsx(Controller, { control: control, name: "username", rules: {
                            required: "Email is required",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Please enter a valid email address",
                            },
                        }, render: ({ field: { onChange, onBlur, value } }) => (_jsx(InputField, { label: "Email", placeholder: "you@example.com", icon: _jsx(Mail, { size: 20, color: icon.subtle }), value: value, onChangeText: onChange, onBlur: onBlur, error: errors.username?.message, type: "email", autoCapitalize: "none" })) }), _jsx(Controller, { control: control, name: "password", rules: {
                            required: "Password is required",
                            minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters",
                            },
                        }, render: ({ field: { onChange, onBlur, value } }) => (_jsx(InputField, { label: "Password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", icon: _jsx(Lock, { size: 20, color: icon.subtle }), value: value, onChangeText: onChange, onBlur: onBlur, error: errors.password?.message, isPassword: true })) })] }), _jsx("div", { className: "flex flex-row items-center justify-between", children: _jsx("button", { type: "button", className: "cursor-pointer", onClick: () => navigate("/forgot-password"), children: _jsx(Text, { variant: "label", className: "text-accent", children: "Forgot password?" }) }) }), _jsxs(AuthButton, { onPress: handleSubmit(onSubmit), disabled: !isValid || isSubmitting, children: [_jsx(Text, { variant: "body", className: "font-semibold text-white", children: "Log In" }), _jsx(ArrowRight, { size: 18, color: icon.inverse })] }), _jsxs("div", { className: "flex flex-row items-center gap-3", children: [_jsx("div", { className: "flex-1 h-px bg-border" }), _jsx(Text, { variant: "bodySm", className: "text-muted-foreground", children: "or" }), _jsx("div", { className: "flex-1 h-px bg-border" })] }), _jsxs("button", { type: "button", onClick: handleGoogleLogin, disabled: isGoogleLoading, className: "flex flex-row items-center justify-center gap-2 border border-border rounded-xl py-3 cursor-pointer hover:bg-muted transition-colors disabled:opacity-60 disabled:cursor-not-allowed", children: [isGoogleLoading ? (_jsx("div", { className: "w-4 h-4 rounded-full border-2 border-t-transparent animate-spin border-foreground" })) : null, _jsx(Text, { variant: "body", className: "font-semibold text-foreground", children: isGoogleLoading ? "Redirecting…" : "Continue with Google" })] }), _jsx(FormFooter, { text: "Don't have an account? ", linkText: "Sign up here", onPress: () => navigate("/register") })] }));
    if (isWide) {
        return (_jsx("div", { className: "flex justify-center px-14 min-h-screen", children: _jsxs("div", { className: "flex-1 flex flex-row justify-center gap-12", children: [_jsxs("div", { className: "flex-1 flex flex-col justify-center", children: [_jsxs("div", { className: "flex flex-row items-center gap-3 mb-8", children: [_jsx(BrandIcon, { size: 48 }), _jsx(Text, { variant: "h1", className: "text-foreground", children: "Jimbu" })] }), _jsx(Text, { variant: "h2", className: "text-foreground mb-3", children: "Track your everyday finances with ease." }), _jsx(Text, { variant: "body", className: "text-muted-foreground mb-8", children: "Manage your family or personal budget, track spending across accounts, and stay on top of your financial goals." }), _jsx("div", { className: "flex flex-col gap-4", children: features.map((feature) => (_jsxs("div", { className: "flex flex-row items-center gap-3", children: [_jsx("div", { className: "w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center", children: _jsx(feature.icon, { size: 18, color: icon.accent, strokeWidth: 1.8 }) }), _jsx(Text, { variant: "body", className: "text-foreground", children: feature.label })] }, feature.label))) })] }), _jsx("div", { className: "flex-1 flex flex-col justify-center", children: formContent })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen overflow-y-auto", children: _jsxs("div", { className: "p-6 pt-8 flex flex-col gap-4 w-full", children: [_jsx("div", { className: "h-10 flex items-center justify-center mb-1", children: _jsxs("div", { className: "flex flex-row items-center gap-2.5", children: [_jsx(BrandIcon, { size: 40 }), _jsx(Text, { variant: "h2", className: "text-foreground", children: "Jimbu" })] }) }), _jsx(Text, { variant: "body", className: "text-foreground text-center mb-3", children: "Track your everyday finances with ease." }), formContent] }) }));
}
