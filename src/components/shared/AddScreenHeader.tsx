import { useIconColors } from '@/hooks/useIconColors';
import { Text } from '@/shared/Text';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface IAddScreenHeader {
  title: string;
  onBack?: () => void;
}

export default function AddScreenHeader({ title, onBack }: IAddScreenHeader) {
  const navigate = useNavigate();
  const icon = useIconColors();
  const handleBack = onBack ?? (() => navigate(-1));

  return (
    <div className="flex flex-row items-center">
      <button
        type="button"
        onClick={handleBack}
        className="w-10 h-10 flex items-center justify-center border bg-card border-accent rounded-lg cursor-pointer"
      >
        <ArrowLeft size={20} color={icon.default} strokeWidth={2.5} />
      </button>

      <Text variant="h2" className="ml-5 text-center text-foreground truncate">
        {title}
      </Text>
    </div>
  );
}
