import PrivacyPolicyView from '@/components/PrivacyPolicyView';
import ScreenWrapper from '@/components/shared/ScreenWrapper';

export default function PrivacyPage() {
  return (
    <ScreenWrapper>
      <div className="flex-1 overflow-y-auto pt-4 pb-12">
        <PrivacyPolicyView />
      </div>
    </ScreenWrapper>
  );
}
