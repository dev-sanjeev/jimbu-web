import { Text } from '@/shared/Text';

interface ISectionHeaderProps {
  title: string;
  onSeeAllPress?: () => void;
  showSeeAll?: boolean;
}

export default function SectionHeader({
  title,
  onSeeAllPress,
  showSeeAll = true,
}: ISectionHeaderProps) {
  return (
    <div className="flex flex-row justify-between items-center mb-3">
      <Text variant="h3" className="text-foreground">
        {title}
      </Text>
      {showSeeAll && onSeeAllPress && (
        <button type="button" onClick={onSeeAllPress} className="cursor-pointer bg-transparent border-0 p-0">
          <Text variant="label" className="font-semibold text-accent">
            See All
          </Text>
        </button>
      )}
    </div>
  );
}
