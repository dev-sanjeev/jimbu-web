import PrivacyPolicyView from '@/components/PrivacyPolicyView';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import ScrollArea from '@/components/shared/ScrollArea';

export default function PrivacyPage() {
  return (
    <ScreenWrapper>
      <ScrollArea className="pt-4 pb-12">
        <PrivacyPolicyView />
      </ScrollArea>
    </ScreenWrapper>
  );
}
