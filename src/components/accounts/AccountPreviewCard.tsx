import { Text } from '@/shared/Text';
import AccountItem from './AccountItem';

interface IAccountPreviewCard {
  name: string;
  typeLabel: string;
  balance: number;
  color: string;
  iconName: string;
}

export default function AccountPreviewCard({
  name,
  typeLabel,
  balance,
  color,
  iconName,
}: IAccountPreviewCard) {
  return (
    <div className="mt-2">
      <Text variant="caption" className="font-semibold text-foreground uppercase tracking-wider mb-2 pl-1">
        Preview
      </Text>
      <AccountItem
        name={name || 'Account name'}
        type={typeLabel}
        balance={balance}
        iconBg={color}
        iconName={iconName}
        isPreview
      />
    </div>
  );
}
