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

type OtpForm = { code: string };

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
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
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OtpForm>({ defaultValues: { code: '' } });

  const onSubmit = async (values: OtpForm) => {
    if (!email || !mode) return;
    try {
      if (mode === 'reset') {
        await setOtpCode(values.code);
        navigate('/reset-password');
      } else {
        await verifyAccount({ username: email, token: values.code });
        await clearFlow();
        toast.success('Email verified', { description: 'You can now log in.' });
        navigate('/login', { replace: true });
      }
    } catch (e) {
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
    if (!email || cooldown > 0) return;
    try {
      await (mode === 'reset' ? resendResetCode(email) : resendVerificationToken(email));
      toast.success('Code sent', { description: 'Check your email.' });
      setCooldown(60);
    } catch (e) {
      toast.error("Couldn't resend code", { description: e instanceof Error ? e.message : 'Please try again.' });
    }
  };

  const handleWrongEmail = async () => {
    await clearOtpCode();
    navigate('/forgot-password', { replace: true });
  };

  if (!email || !mode) return null;

  const cardContent = (
    <AuthCard>
      <div className="flex flex-col items-center gap-3 pt-2">
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
          <Mail size={24} color={icon.accent} strokeWidth={1.8} />
        </div>
        <Text variant="h3" className="text-foreground text-center">Check your email</Text>
        <Text variant="bodySm" className="text-muted-foreground text-center">We sent a 6-digit verification code to</Text>
        <Text variant="body" className="font-semibold text-foreground text-center">{maskEmail(email)}</Text>
        <Text variant="label" className="text-muted-foreground text-center mt-1">Enter the code below</Text>
      </div>

      <Controller
        control={control}
        name="code"
        rules={{
          required: 'Code is required',
          pattern: { value: /^\d{6}$/, message: 'Enter all 6 digits' },
        }}
        render={({ field: { onChange, value } }) => (
          <OtpBoxInput value={value} onChange={onChange} error={!!errors.code} />
        )}
      />

      {errors.code && (
        <Text variant="caption" className="text-destructive text-center -mt-2">
          {errors.code.message}
        </Text>
      )}

      <AuthButton onPress={handleSubmit(onSubmit)} disabled={isSubmitting}>
        {isSubmitting ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Text variant="body" className="font-semibold text-white">
            {mode === 'reset' ? 'Continue' : 'Verify'}
          </Text>
        )}
      </AuthButton>

      <FormFooter
        text="Didn't get a code? "
        linkText={cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
        onPress={handleResend}
      />

      {mode === 'reset' && (
        <FormFooter text="Wrong email? " linkText="Go back" onPress={handleWrongEmail} />
      )}
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
            <Text variant="h2" className="text-foreground mb-3">Your security matters.</Text>
            <Text variant="body" className="text-muted-foreground mb-8">
              Email verification ensures only you can access your account. Your code is valid for a short window — act quickly.
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
          <div className="flex-1 flex flex-col justify-center">{cardContent}</div>
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
        <Text variant="body" className="text-foreground text-center mb-3">Your security matters.</Text>
        {cardContent}
      </div>
    </div>
  );
}
