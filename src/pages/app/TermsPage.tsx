import TermsAndConditionsView from '@/components/TermsAndConditionsView';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import ScrollArea from '@/components/shared/ScrollArea';

export default function TermsPage() {
  return (
    <ScreenWrapper>
      <ScrollArea className="pt-4 pb-12">
        <TermsAndConditionsView />
      </ScrollArea>
    </ScreenWrapper>
  );
}
