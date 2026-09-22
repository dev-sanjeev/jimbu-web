import FormActions from '@/components/shared/FormActions';
import FormField from '@/components/shared/FormField';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import { useUpdateProfile } from '@/hooks/user/useUpdateProfile';
import { UpdateProfilePayload } from '@/services/user.service';
import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useState } from 'react';
import ConfirmDialog from '@/components/shared/ConfirmDialog';

interface FormValues {
  firstName: string;
  lastName: string;
  password: string;
}

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useUpdateProfile();
  const navigate = useNavigate();
  const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<UpdateProfilePayload | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      password: '',
    },
  });

  const submit = (values: FormValues) => {
    const payload: UpdateProfilePayload = {};
    if (values.firstName.trim() !== (user?.firstName ?? '')) {
      payload.firstName = values.firstName.trim();
    }
    if (values.lastName.trim() !== (user?.lastName ?? '')) {
      payload.lastName = values.lastName.trim();
    }
    if (values.password.length > 0) {
      payload.password = values.password;
    }

    if (Object.keys(payload).length === 0) {
      toast.info('No changes to save');
      return;
    }

    setPendingPayload(payload);
    setConfirmSaveOpen(true);
  };

  const executeSave = () => {
    if (!pendingPayload) return;
    setConfirmSaveOpen(false);
    updateProfile.mutate(pendingPayload, {
      onSuccess: (updated) => {
        reset({ firstName: updated.firstName, lastName: updated.lastName, password: '' });
        toast.success('Profile updated');
        navigate('/main', { replace: true });
      },
      onError: (error) =>
        toast.error('Could not update profile', { description: error.message }),
    });
    setPendingPayload(null);
  };

  return (
    <ScreenWrapper>
      <ConfirmDialog
        open={confirmSaveOpen}
        title="Save changes?"
        message="Are you sure you want to save these changes?"
        confirmLabel="Save"
        variant="default"
        onConfirm={executeSave}
        onCancel={() => { setConfirmSaveOpen(false); setPendingPayload(null); }}
      />
      <div className="flex-1 overflow-y-auto pb-8 flex flex-col gap-5">
        <FormField
          label="Email"
          value={user?.username ?? ''}
          onChangeText={() => {}}
          editable={false}
        />

        <Controller
          control={control}
          name="firstName"
          rules={{ validate: (v) => v.trim().length > 0 || 'First name is required' }}
          render={({ field: { value, onChange, onBlur }, fieldState }) => (
            <FormField
              label="First name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="First name"
              autoCapitalize="words"
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="lastName"
          rules={{ validate: (v) => v.trim().length > 0 || 'Last name is required' }}
          render={({ field: { value, onChange, onBlur }, fieldState }) => (
            <FormField
              label="Last name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Last name"
              autoCapitalize="words"
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{
            validate: (v) => v.length === 0 || v.length >= 8 || 'Minimum 8 characters',
          }}
          render={({ field: { value, onChange, onBlur }, fieldState }) => (
            <FormField
              label="New password"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Leave blank to keep current"
              autoCapitalize="none"
              secureTextEntry
              error={fieldState.error?.message}
            />
          )}
        />

        <div className="mt-2">
          <FormActions
            onCancel={() => navigate(-1)}
            onSave={handleSubmit(submit)}
            saveLabel="Save changes"
            isSaving={updateProfile.isPending}
            disabled={!isDirty}
          />
        </div>
      </div>
    </ScreenWrapper>
  );
}
