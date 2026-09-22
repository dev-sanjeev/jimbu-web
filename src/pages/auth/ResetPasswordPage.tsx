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
import React, { useEffect } from 'react';
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

type ResetPasswordForm = { newPassword: string; confirmPassword: string };

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

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ResetPasswordForm>({
    mode: 'onChange',
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const onSubmit = async (values: ResetPasswordForm) => {
    if (!email || !otpCode) return;
    try {
      await resetPassword({ username: email, code: otpCode, newPassword: values.newPassword });
      await clearFlow();
      toast.success('Password reset', { description: 'Log in with your new password.' });
      navigate('/login', { replace: true });
    } catch (e) {
      const statusCode = (e as { statusCode?: number }).statusCode;
      if (statusCode === 403) {
        await clearOtpCode();
        toast.error('Code expired', { description: 'Your code has expired. Please request a new one.' });
        navigate('/verify', { replace: true });
        return;
      }
      toast.error('Could not reset password', { description: e instanceof Error ? e.message : 'Please try again.' });
    }
  };

  if (!email || !otpCode) return null;

  const formContent = (
    <AuthCard>
      <FormHeader title="New Password" subTitle="Choose a strong password you haven't used before." />

      <Controller
        control={control}
        name="newPassword"
        rules={{
          required: 'Password is required',
          validate: {
            minLength: (v) => v.length >= 10 || 'At least 10 characters',
            hasUpper: (v) => /[A-Z]/.test(v) || 'Include an uppercase letter',
            hasLower: (v) => /[a-z]/.test(v) || 'Include a lowercase letter',
            hasNumber: (v) => /[0-9]/.test(v) || 'Include a number',
            hasSpecial: (v) => /[^A-Za-z0-9]/.test(v) || 'Include a special character',
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <InputField
            label="New Password"
            placeholder="••••••••••"
            icon={<Lock size={20} color={icon.subtle} />}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur as React.FocusEventHandler<HTMLInputElement>}
            error={errors.newPassword?.message}
            isPassword
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        rules={{
          required: 'Please confirm your password',
          validate: (v) => v === watch('newPassword') || 'Passwords do not match',
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <InputField
            label="Confirm New Password"
            placeholder="••••••••••"
            icon={<Lock size={20} color={icon.subtle} />}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur as React.FocusEventHandler<HTMLInputElement>}
            error={errors.confirmPassword?.message}
            isPassword
          />
        )}
      />

      <AuthButton onPress={handleSubmit(onSubmit)} disabled={!isValid || isSubmitting}>
        {isSubmitting ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Text variant="body" className="font-semibold text-white">Reset Password</Text>
        )}
      </AuthButton>

      <FormFooter text="Changed your mind? " linkText="Log in here" onPress={() => navigate('/login', { replace: true })} />
    </AuthCard>
  );

  if (isWide) {
    return (
      <div className="flex justify-center px-14 min-h-screen">
        <div className="flex-1 flex flex-row justify-center gap-12">
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex flex-row items-center gap-3 mb-8">
              <BrandIcon size={48} />
              <Text variant="h1" className="text-foreground">Jimbu</Text>
            </div>
            <Text variant="h2" className="text-foreground mb-3">Set a strong password.</Text>
            <Text variant="body" className="text-muted-foreground mb-8">
              A strong password keeps your account secure. Consider using a password manager to generate and store it safely.
            </Text>
            <div className="flex flex-col gap-4">
              {tips.map((tip) => (
                <div key={tip.label} className="flex flex-row items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                    <tip.icon size={18} color={icon.accent} strokeWidth={1.8} />
                  </div>
                  <Text variant="body" className="text-foreground">{tip.label}</Text>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center">{formContent}</div>
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
            <Text variant="h2" className="text-foreground">Jimbu</Text>
          </div>
        </div>
        <Text variant="body" className="text-foreground text-center mb-3">Set a strong password.</Text>
        {formContent}
      </div>
    </div>
  );
}
