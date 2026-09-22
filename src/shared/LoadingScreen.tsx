import { Text } from './Text';
import { useCurrentTheme } from '@/hooks/useCurrentTheme';

interface LoadingScreenProps {
  title?: string;
  subtitle?: string;
}

export default function LoadingScreen({
  title = 'Loading…',
  subtitle = 'Please wait',
}: LoadingScreenProps) {
  const theme = useCurrentTheme();

  return (
    <div
      style={theme.vars}
      className="flex min-h-screen items-center justify-center flex-col gap-4 bg-background-wash"
    >
      <div
        className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
        style={{ borderColor: `${theme.colors.accent} transparent ${theme.colors.accent} ${theme.colors.accent}` }}
      />
      <div className="text-center flex flex-col gap-1">
        <Text variant="h3" className="text-foreground">{title}</Text>
        <Text variant="bodySm" className="text-muted-foreground">{subtitle}</Text>
      </div>
    </div>
  );
}
