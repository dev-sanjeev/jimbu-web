import AccountItem from '@/components/accounts/AccountItem';
import Group from '@/components/accounts/Group';
import HeaderCard from '@/components/accounts/HeaderCard';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import ScrollArea from '@/components/shared/ScrollArea';
import { useGetAccounts } from '@/hooks/accounts/useGetAccounts';
import { Account, AccountType, ACCOUNT_TYPE_LABELS } from '@/interfaces/Account';
import { Text } from '@/shared/Text';
import { useNavigate } from 'react-router-dom';

const SECTION_TITLES: Record<AccountType, string> = {
  cash: 'Cash',
  bank: 'Bank Accounts',
  credit_card: 'Credit Cards',
  digital_wallet: 'Digital Wallets',
};

function groupByType(accounts: Account[]): Partial<Record<AccountType, Account[]>> {
  return accounts.reduce<Partial<Record<AccountType, Account[]>>>((acc, account) => {
    const bucket = acc[account.accountType] ?? [];
    bucket.push(account);
    acc[account.accountType] = bucket;
    return acc;
  }, {});
}

const ORDERED_TYPES = Object.keys(ACCOUNT_TYPE_LABELS) as AccountType[];

export default function AccountsPage() {
  const navigate = useNavigate();
  const { data: accounts, isLoading, isError, refetch } = useGetAccounts();

  const grouped = accounts ? groupByType(accounts as Account[]) : {};

  return (
    <ScreenWrapper>
      <HeaderCard
        title="Accounts"
        buttonText="New"
        onButtonPress={() => navigate('/main/accounts/new')}
      />

      <ScrollArea className="pb-8 pt-4 flex flex-col gap-6">
        {isLoading && (
          <div className="flex items-center justify-center py-10">
            <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <Text variant="bodySm" className="text-foreground">Couldn&apos;t load accounts.</Text>
            <button
              type="button"
              className="py-2 px-4 rounded-lg border border-foreground bg-card cursor-pointer"
              onClick={() => refetch()}
            >
              <Text variant="label" className="font-semibold text-foreground">Retry</Text>
            </button>
          </div>
        )}

        {!isLoading && !isError && accounts && (
          <div className="flex flex-col gap-5">
            {ORDERED_TYPES.map((type) => {
              const groupAccounts = grouped[type];
              if (!groupAccounts || groupAccounts.length === 0) return null;
              return (
                <Group key={type} title={SECTION_TITLES[type]}>
                  {groupAccounts.map((account, i) => (
                    <AccountItem
                      key={account.id}
                      name={account.name}
                      type={ACCOUNT_TYPE_LABELS[type]}
                      balance={account.balance}
                      iconBg={account.color}
                      iconName={account.icon}
                      isLast={i === groupAccounts.length - 1}
                      onPress={() => navigate(`/main/accounts/${account.id}`)}
                    />
                  ))}
                </Group>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </ScreenWrapper>
  );
}
