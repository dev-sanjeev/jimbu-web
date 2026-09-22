import TermsAndConditionsView from '@/components/TermsAndConditionsView';
import ScreenWrapper from '@/components/shared/ScreenWrapper';

export default function TermsPage() {
  return (
    <ScreenWrapper>
      <div className="flex-1 overflow-y-auto pt-4 pb-12">
        <TermsAndConditionsView />
      </div>
    </ScreenWrapper>
  );
}
