import { Text } from '@/shared/Text';

interface IFormActions {
  onCancel: () => void;
  onSave: () => void;
  saveLabel: string;
  cancelLabel?: string;
  isSaving?: boolean;
  disabled?: boolean;
}

export default function FormActions({
  onCancel,
  onSave,
  saveLabel,
  cancelLabel = 'Cancel',
  isSaving,
  disabled,
}: IFormActions) {
  const saving = isSaving || disabled;

  return (
    <div className="flex flex-row gap-3">
      <button
        type="button"
        onClick={onCancel}
        disabled={isSaving}
        className="flex-1 h-14 rounded-lg flex items-center justify-center bg-card border border-subtle-border cursor-pointer"
      >
        <Text variant="body" className="font-semibold text-foreground">
          {cancelLabel}
        </Text>
      </button>

      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="flex-1 h-14 rounded-lg flex items-center justify-center cursor-pointer bg-accent disabled:opacity-60"
      >
        {isSaving ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Text variant="body" className="font-semibold text-white">
            {saveLabel}
          </Text>
        )}
      </button>
    </div>
  );
}
