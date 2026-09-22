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
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const WEB_SIDEBAR_BREAKPOINT = 768;

const tips = [
  { icon: ShieldCheck, label: 'Use a password manager' },
  { icon: KeyRound, label: 'Generate unique passwords' },
  { icon: Lock, label: 'Store credentials securely' },
];

type ForgotPasswordForm = { username: string };

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const icon = useIconColors();
  const { width: screenWidth } = useWindowSize();
  const isWide = screenWidth >= WEB_SIDEBAR_BREAKPOINT;
  const storedEmail = useAuthFlowStore((s) => s.email);
  const setFlow = useAuthFlowStore((s) => s.setFlow);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({
    defaultValues: { username: storedEmail ?? '' },
  });

  const onSubmit = async (values: ForgotPasswordForm) => {
    try {
      await forgotPassword(values.username);
      await setFlow(values.username, 'reset');
      toast.success('Check your email', { description: 'If an account exists, a reset code has been sent.' });
      navigate('/verify');
    } catch (e) {
      toast.error('Something went wrong', { description: e instanceof Error ? e.message : 'Please try again.' });
    }
  };

  const formContent = (
    <AuthCard>
      <FormHeader title="Reset Password" subTitle="We'll email you a 6-digit code." />

      <Controller
        control={control}
        name="username"
        rules={{
          required: 'Email is required',
          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address' },
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

      <AuthButton onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
        {isSubmitting ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Text variant="body" className="font-semibold text-white">Send Reset Code</Text>
        )}
      </AuthButton>

      <FormFooter text="Remembered your password? " linkText="Log in here" onPress={() => navigate(-1)} />
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
            <Text variant="h2" className="text-foreground mb-3">Keep your credentials safe.</Text>
            <Text variant="body" className="text-muted-foreground mb-8">
              Instead of resetting your password frequently, consider storing it in a password manager. It keeps all your credentials safe, encrypted, and easy to access.
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
        <Text variant="body" className="text-foreground text-center mb-3">Keep your credentials safe.</Text>
        {formContent}
      </div>
    </div>
  );
}
