import { Text } from '@/shared/Text';

interface IFormWrapper {
  title: string;
  subTitle: string;
}

export const FormHeader = ({ title, subTitle }: IFormWrapper) => {
  return (
    <div className="flex flex-col gap-1">
      <Text variant="h3" className="text-foreground">
        {title}
      </Text>
      <Text variant="bodySm" className="text-muted-foreground">
        {subTitle}
      </Text>
    </div>
  );
};
