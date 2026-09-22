import { TERMS_AND_CONDITIONS, TERMS_LAST_UPDATED } from '@/shared/termsAndConditions';
import { Text } from '@/shared/Text';

export default function TermsAndConditionsView() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <Text variant="h2" className="text-foreground">Terms &amp; Conditions</Text>
        <Text variant="caption" className="text-muted-foreground">Last updated {TERMS_LAST_UPDATED}</Text>
      </div>
      {TERMS_AND_CONDITIONS.map((section) => (
        <div key={section.heading} className="flex flex-col gap-1.5">
          <Text variant="h3" className="text-foreground">{section.heading}</Text>
          <Text variant="body" className="text-muted-foreground">{section.body}</Text>
        </div>
      ))}
    </div>
  );
}
