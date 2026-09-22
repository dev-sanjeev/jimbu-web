import { PRIVACY_LAST_UPDATED, PRIVACY_POLICY } from '@/shared/privacyPolicy';
import { Text } from '@/shared/Text';

export default function PrivacyPolicyView() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <Text variant="h2" className="text-foreground">Privacy Policy</Text>
        <Text variant="caption" className="text-muted-foreground">Last updated {PRIVACY_LAST_UPDATED}</Text>
      </div>
      {PRIVACY_POLICY.map((section) => (
        <div key={section.heading} className="flex flex-col gap-1.5">
          <Text variant="h3" className="text-foreground">{section.heading}</Text>
          <Text variant="body" className="text-muted-foreground">{section.body}</Text>
        </div>
      ))}
    </div>
  );
}
