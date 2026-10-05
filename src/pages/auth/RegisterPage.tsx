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
import React, { useState } from 'react';
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

type RegisterForm = {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
};

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

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<RegisterForm>({
    mode: 'onChange',
    defaultValues: { firstName: '', lastName: '', username: '', password: '' },
  });

  const onSubmit = async (values: RegisterForm) => {
    try {
      await registerUser(values);
      await setFlow(values.username, 'register');
      toast.success('Account created', { description: 'Check your email for a verification code.' });
      navigate('/verify');
    } catch (e) {
      toast.error('Registration failed', {
        description: e instanceof Error ? e.message : 'Something went wrong. Please try again.',
      });
    }
  };

  const formContent = (
    <AuthCard>
      <FormHeader title="Sign Up" subTitle="Create your family or personal account." />

      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-3">
          <Controller
            control={control}
            name="firstName"
            rules={{ required: 'Required', minLength: { value: 2, message: 'Too short' } }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                label="First Name"
                placeholder="e.g. Ram"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur as React.FocusEventHandler<HTMLInputElement>}
                error={errors.firstName?.message}
                style={{ flex: 1 }}
              />
            )}
          />
          <Controller
            control={control}
            name="lastName"
            rules={{ required: 'Required', minLength: { value: 2, message: 'Too short' } }}
            render={({ field: { onChange, onBlur, value } }) => (
              <InputField
                label="Last Name"
                placeholder="e.g. Sharma"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur as React.FocusEventHandler<HTMLInputElement>}
                error={errors.lastName?.message}
                style={{ flex: 1 }}
              />
            )}
          />
        </div>

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

        <Controller
          control={control}
          name="password"
          rules={{
            required: 'Password is required',
            minLength: { value: 8, message: 'At least 8 characters' },
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

      <div
        className="flex flex-row items-center gap-3 cursor-pointer"
        onClick={() => setAcceptedTerms((v) => !v)}
      >
        <div
          className="w-5 h-5 rounded border flex items-center justify-center flex-shrink-0"
          style={{
            borderColor: acceptedTerms ? theme.colors.accent : undefined,
            backgroundColor: acceptedTerms ? theme.colors.accent : 'transparent',
          }}
        >
          {acceptedTerms ? <Check size={14} color={icon.inverse} strokeWidth={3} /> : null}
        </div>
        <Text variant="bodySm" className="flex-1 text-muted-foreground" style={{ lineHeight: '20px' }}>
          I agree to the{' '}
          <span
            className="text-body-sm font-semibold text-accent cursor-pointer"
            onClick={(e) => { e.stopPropagation(); setTermsVisible(true); }}
          >
            Terms &amp; Conditions
          </span>{' '}
          and{' '}
          <span
            className="text-body-sm font-semibold text-accent cursor-pointer"
            onClick={(e) => { e.stopPropagation(); setPrivacyVisible(true); }}
          >
            Privacy Policy
          </span>
        </Text>
      </div>

      <AuthButton onPress={handleSubmit(onSubmit)} disabled={!isValid || !acceptedTerms || isSubmitting}>
        {isSubmitting ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <Text variant="body" className="text-white font-semibold">Sign Up</Text>
            <ArrowRight size={18} color={icon.inverse} />
          </>
        )}
      </AuthButton>

      <FormFooter text="Already have an account? " linkText="Log in here" onPress={() => navigate(-1)} />
    </AuthCard>
  );

  return (
    <>
      {isWide ? (
        <div className="flex justify-center px-14 min-h-screen">
          <div className="flex-1 flex flex-row justify-center gap-12">
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex flex-row items-center gap-3 mb-8">
                <BrandIcon size={48} />
                <Text variant="h1" className="text-foreground">Jimbu</Text>
              </div>
              <Text variant="h2" className="text-foreground mb-3">Your family&apos;s digital heart.</Text>
              <Text variant="body" className="text-muted-foreground mb-8">
                More than just a budget. Jimbu is the central hub for your family—from coordinating finances and tracking spending to managing your household together in one secure place.
              </Text>
              <div className="flex flex-col gap-4">
                {features.map((feature) => (
                  <div key={feature.label} className="flex flex-row items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                      <feature.icon size={18} color={icon.accent} strokeWidth={1.8} />
                    </div>
                    <Text variant="body" className="text-foreground">{feature.label}</Text>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center">{formContent}</div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen overflow-y-auto">
          <div className="p-6 pt-8 flex flex-col gap-4 w-full">
            <div className="h-10 flex items-center justify-center mb-1">
              <div className="flex flex-row items-center gap-2.5">
                <BrandIcon size={40} />
                <Text variant="h2" className="text-foreground">Jimbu</Text>
              </div>
            </div>
            <Text variant="body" className="text-foreground text-center mb-3">Your family&apos;s digital heart.</Text>
            {formContent}
          </div>
        </div>
      )}

      {termsVisible && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50" onClick={() => setTermsVisible(false)}>
          <div className="bg-background rounded-t-2xl md:rounded-2xl w-full md:max-w-lg max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-row items-center justify-between px-5 py-3 border-b border-subtle-border">
              <Text variant="h3" className="text-foreground">Terms &amp; Conditions</Text>
              <button type="button" onClick={() => setTermsVisible(false)} className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <X size={20} color={icon.muted} strokeWidth={1.8} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 pb-10">
              <TermsAndConditionsView />
            </div>
          </div>
        </div>
      )}

      {privacyVisible && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50" onClick={() => setPrivacyVisible(false)}>
          <div className="bg-background rounded-t-2xl md:rounded-2xl w-full md:max-w-lg max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-row items-center justify-between px-5 py-3 border-b border-subtle-border">
              <Text variant="h3" className="text-foreground">Privacy Policy</Text>
              <button type="button" onClick={() => setPrivacyVisible(false)} className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <X size={20} color={icon.muted} strokeWidth={1.8} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 pb-10">
              <PrivacyPolicyView />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
