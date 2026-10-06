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
import {
  ArrowRight,
  BarChart3,
  Lock,
  Mail,
  Tags,
  Users,
  Wallet,
} from "lucide-react";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const WEB_SIDEBAR_BREAKPOINT = 768;

type LoginForm = {
  username: string;
  password: string;
};

const features = [
  { icon: Wallet, label: "Multi-account tracking" },
  { icon: Tags, label: "Smart categorization" },
  { icon: Users, label: "Family budget management" },
  { icon: BarChart3, label: "Spending insights" },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const hydrate = useAuthStore((state) => state.hydrate);
  const icon = useIconColors();
  const { width: screenWidth } = useWindowSize();
  const isWide = screenWidth >= WEB_SIDEBAR_BREAKPOINT;
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginForm>({
    mode: "onChange",
    defaultValues: { username: "", password: "" },
  });

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    const deviceId = await getDeviceId();
    const deviceName = getDeviceName();
    const apiBase = import.meta.env.VITE_API_URL;
    const authUrl =
      `${apiBase}/auth/google` +
      `?deviceId=${encodeURIComponent(deviceId)}` +
      `&deviceName=${encodeURIComponent(deviceName)}`;
    window.location.href = authUrl;
  };

  const onSubmit = async (values: LoginForm) => {
    try {
      await loginUser(values);
      await hydrate();
      navigate("/main");
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Invalid username or password.";
      toast.error("Login failed", { description: message });
    }
  };

  if (isSubmitting) {
    return <LoadingScreen />;
  }

  const formContent = (
    <AuthCard>
      <FormHeader
        title="Log In"
        subTitle="Access your family or personal budget."
      />

      <div className="flex flex-col gap-4">
        <Controller
          control={control}
          name="username"
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email address",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Email"
              placeholder="you@example.com"
              icon={<Mail size={20} color={icon.subtle} />}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur as React.FocusEventHandler<HTMLInputElement>}
              error={errors.username?.message}
              type="email"
              autoCapitalize="none"
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <InputField
              label="Password"
              placeholder="••••••••"
              icon={<Lock size={20} color={icon.subtle} />}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur as React.FocusEventHandler<HTMLInputElement>}
              error={errors.password?.message}
              isPassword
            />
          )}
        />
      </div>

      <div className="flex flex-row items-center justify-between">
        <button
          type="button"
          className="cursor-pointer"
          onClick={() => navigate("/forgot-password")}
        >
          <Text variant="label" className="text-accent">
            Forgot password?
          </Text>
        </button>
      </div>

      <AuthButton
        onPress={handleSubmit(onSubmit)}
        disabled={!isValid || isSubmitting}
      >
        <Text variant="body" className="font-semibold text-white">
          Log In
        </Text>
        <ArrowRight size={18} color={icon.inverse} />
      </AuthButton>

      <div className="flex flex-row items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <Text variant="bodySm" className="text-muted-foreground">
          or
        </Text>
        <div className="flex-1 h-px bg-border" />
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isGoogleLoading}
        className="flex flex-row items-center justify-center gap-2 border border-border rounded-xl py-3 cursor-pointer hover:bg-muted transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isGoogleLoading ? (
          <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin border-foreground" />
        ) : null}
        <Text variant="body" className="font-semibold text-foreground">
          {isGoogleLoading ? "Redirecting…" : "Continue with Google"}
        </Text>
      </button>

      <FormFooter
        text="Don't have an account? "
        linkText="Sign up here"
        onPress={() => navigate("/register")}
      />
    </AuthCard>
  );

  if (isWide) {
    return (
      <div className="flex justify-center px-14 min-h-screen">
        <div className="flex-1 flex flex-row justify-center gap-12">
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex flex-row items-center gap-3 mb-8">
              <BrandIcon size={48} />
              <Text variant="h1" className="text-foreground">
                Jimbu
              </Text>
            </div>
            <Text variant="h2" className="text-foreground mb-3">
              Track your everyday finances with ease.
            </Text>
            <Text variant="body" className="text-muted-foreground mb-8">
              Manage your family or personal budget, track spending across
              accounts, and stay on top of your financial goals.
            </Text>
            <div className="flex flex-col gap-4">
              {features.map((feature) => (
                <div
                  key={feature.label}
                  className="flex flex-row items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                    <feature.icon
                      size={18}
                      color={icon.accent}
                      strokeWidth={1.8}
                    />
                  </div>
                  <Text variant="body" className="text-foreground">
                    {feature.label}
                  </Text>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            {formContent}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-y-auto">
      <div className="p-6 pt-8 flex flex-col gap-4 w-full">
        <div className="h-10 flex items-center justify-center mb-1">
          <div className="flex flex-row items-center gap-2.5">
            <BrandIcon size={40} />
            <Text variant="h2" className="text-foreground">
              Jimbu
            </Text>
          </div>
        </div>
        <Text variant="body" className="text-foreground text-center mb-3">
          Track your everyday finances with ease.
        </Text>
        {formContent}
      </div>
    </div>
  );
}
