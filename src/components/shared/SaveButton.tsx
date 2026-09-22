import { Text } from '@/shared/Text';

interface ISaveButton {
  handleSave: () => void;
  buttonText: string;
}

export default function SaveButton({ handleSave, buttonText }: ISaveButton) {
  return (
    <button
      type="button"
      onClick={handleSave}
      className="h-input flex flex-row items-center justify-center gap-2 rounded-lg cursor-pointer w-full bg-accent"
    >
      <Text variant="body" className="font-semibold text-white">
        {buttonText}
      </Text>
    </button>
  );
}
