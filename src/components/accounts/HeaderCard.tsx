import { useIconColors } from '@/hooks/useIconColors';
import { Text } from '@/shared/Text';
import { Plus } from 'lucide-react';

interface IHeaderCard {
  title: string;
  buttonText?: string;
  onButtonPress?: () => void;
}

export default function HeaderCard({
  title,
  buttonText,
  onButtonPress,
}: IHeaderCard) {
  const icon = useIconColors();

  return (
    <div className="flex flex-row items-center justify-between py-4">
      <Text variant="h1" className="text-foreground">
        {title}
      </Text>

      {buttonText && (
        <button
          type="button"
          onClick={onButtonPress}
          className="flex flex-row items-center gap-1.5 bg-accent px-4 py-2 rounded-full cursor-pointer border-0"
        >
          <Plus size={15} color={icon.inverse} strokeWidth={2.5} />
          <Text variant="body" className="text-white font-semibold">
            {buttonText}
          </Text>
        </button>
      )}
    </div>
  );
}
