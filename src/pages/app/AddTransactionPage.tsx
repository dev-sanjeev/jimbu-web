import AddScreenHeader from '@/components/shared/AddScreenHeader';
import DateField from '@/components/shared/DateField';
import FormActions from '@/components/shared/FormActions';
import FormField from '@/components/shared/FormField';
import PillGroup, { PillOption } from '@/components/shared/PillGroup';
import SelectField, { SelectOption } from '@/components/shared/SelectField';
import ScreenWrapper from '@/components/shared/ScreenWrapper';
import ScrollArea from '@/components/shared/ScrollArea';
import { useGetAccounts } from '@/hooks/accounts/useGetAccounts';
import { useGetCategories } from '@/hooks/categories/useGetCategories';
import { useCreateTransaction } from '@/hooks/transactions/useCreateTransaction';
import { useGetTransactions } from '@/hooks/transactions/useGetTransactions';
import { useUpdateTransaction } from '@/hooks/transactions/useUpdateTransaction';
import { useIconColors } from '@/hooks/useIconColors';
import { Account } from '@/interfaces/Account';
import { Category } from '@/interfaces/Category';
import { Transaction, TransactionType } from '@/interfaces/Transaction';
import { Text } from '@/shared/Text';
import { DollarSign, FileText } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ConfirmDialog from '@/components/shared/ConfirmDialog';

const TYPE_OPTIONS: PillOption<TransactionType>[] = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
];

interface FormValues {
  type: TransactionType;
  categoryId: number | null;
  accountId: number | null;
  amount: string;
  date: Date;
  notes: string;
}

const buildDefaults = (): FormValues => ({
  type: 'expense',
  categoryId: null,
  accountId: null,
  amount: '',
  date: new Date(),
  notes: '',
});

type AccountOption = Omit<Account, 'id'> & SelectOption;

function toAccountOption(account: Account): AccountOption {
  return { ...account, id: parseInt(account.id, 10) };
}

export default function AddTransactionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id') ?? undefined;
  const editAccountId = searchParams.get('accountId') ?? undefined;
  const isEditMode = searchParams.get('mode') === 'edit' && !!editId;
  const icon = useIconColors();

  const { data: rawAccounts } = useGetAccounts();
  const { data: categories } = useGetCategories();

  const accounts = useMemo(
    () => ((rawAccounts as Account[] | undefined) ?? []).map(toAccountOption),
    [rawAccounts],
  );

  const { data: txData } = useGetTransactions(isEditMode ? editAccountId : undefined);
  const editingTx: Transaction | undefined = useMemo(() => {
    if (!isEditMode || !editId) return undefined;
    const all = txData?.pages.flatMap((p) => p.data) ?? [];
    return all.find((t) => String(t.id) === String(editId));
  }, [txData, editId, isEditMode]);

  const { control, handleSubmit, formState: { errors, isDirty }, setValue, watch, reset } = useForm<FormValues>({
    defaultValues: buildDefaults(),
  });

  useEffect(() => {
    if (!isEditMode) reset(buildDefaults());
  }, [isEditMode, reset]);

  useEffect(() => {
    if (!isEditMode || !editingTx) return;
    reset({
      type: editingTx.type,
      categoryId: editingTx.categoryId,
      accountId: editAccountId ? Number(editAccountId) : null,
      amount: String(editingTx.amount),
      date: new Date(editingTx.createdAt),
      notes: editingTx.notes ?? '',
    });
  }, [isEditMode, editingTx, editAccountId, reset]);

  // Pre-fill accountId from URL when creating
  useEffect(() => {
    if (!isEditMode && editAccountId) {
      setValue('accountId', Number(editAccountId));
    }
  }, [isEditMode, editAccountId, setValue]);

  const selectedType = watch('type');
  const selectedCategoryId = watch('categoryId');
  const selectedAccountId = watch('accountId');

  const filteredCategories = useMemo(
    () => ((categories as Category[] | undefined) ?? []).filter((c) => c.type === selectedType.toLowerCase()),
    [categories, selectedType],
  );

  const selectedCategory = useMemo(
    () => filteredCategories.find((c) => c.id === selectedCategoryId) ?? null,
    [filteredCategories, selectedCategoryId],
  );

  const selectedAccount = useMemo(
    () => accounts.find((a) => a.id === selectedAccountId) ?? null,
    [accounts, selectedAccountId],
  );

  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();

  const onSubmit = (values: FormValues) => {
    const payload = {
      type: values.type,
      categoryId: values.categoryId!,
      accountId: values.accountId!,
      amount: parseFloat(values.amount),
      notes: values.notes.trim() || undefined,
      date: values.date.toISOString(),
    };

    if (isEditMode && editId) {
      updateTransaction.mutate(
        { id: Number(editId), payload },
        {
          onSuccess: () => { toast.success('Transaction updated!'); navigate(-1); },
          onError: (error) => toast.error('Could not update transaction', { description: (error as { message?: string }).message }),
        },
      );
      return;
    }

    createTransaction.mutate(payload, {
      onSuccess: () => { toast.success('Transaction added!'); navigate('/main'); },
      onError: (error) => toast.error('Could not save transaction', { description: (error as { message?: string }).message }),
    });
  };

  const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);

  const handleCancel = () => {
    if (!isDirty) { navigate(-1); return; }
    setConfirmDiscardOpen(true);
  };

  return (
    <ScreenWrapper>
      <ConfirmDialog
        open={confirmDiscardOpen}
        title="Discard changes?"
        message="You'll lose any details you've entered."
        confirmLabel="Discard"
        variant="default"
        onConfirm={() => navigate(-1)}
        onCancel={() => setConfirmDiscardOpen(false)}
      />
      <AddScreenHeader
        title={isEditMode ? 'Edit Transaction' : 'New Transaction'}
        onBack={handleCancel}
      />
      <ScrollArea className="pb-20 pt-2 flex flex-col gap-6">
        <Controller
          control={control}
          name="type"
          render={({ field: { onChange, value } }) => (
            <PillGroup<TransactionType>
              label="Type"
              options={TYPE_OPTIONS}
              value={value}
              onChange={(next) => { onChange(next); setValue('categoryId', null); }}
            />
          )}
        />

        <Controller
          control={control}
          name="categoryId"
          rules={{ required: 'Please select a category' }}
          render={({ field: { onChange } }) => (
            <SelectField
              label="Category"
              placeholder="Select a category"
              options={filteredCategories}
              value={selectedCategory}
              onChange={(item) => onChange(item.id)}
              error={errors.categoryId?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="accountId"
          rules={{ required: 'Please select an account' }}
          render={({ field: { onChange } }) => (
            <SelectField
              label="Account"
              placeholder="Select an account"
              options={accounts}
              value={selectedAccount}
              onChange={(item) => onChange(item.id)}
              error={errors.accountId?.message}
              renderExtra={(item) => (
                <Text variant="caption" className="text-muted-foreground mt-px">
                  ${(item as AccountOption).balance.toFixed(2)}
                </Text>
              )}
            />
          )}
        />

        <Controller
          control={control}
          name="amount"
          rules={{
            required: 'Amount is required',
            validate: (v) => {
              const n = parseFloat(v);
              if (isNaN(n) || n <= 0) return 'Amount must be a positive number';
              if (!/^\d+(\.\d{1,2})?$/.test(v.trim())) return 'Max 2 decimal places allowed';
              return true;
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="Amount"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="0.00"
              icon={<DollarSign size={18} color={icon.muted} />}
              error={errors.amount?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="date"
          render={({ field: { onChange, value } }) => (
            <DateField label="Date" value={value} onChange={onChange} maximumDate={new Date()} />
          )}
        />

        <Controller
          control={control}
          name="notes"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="Notes (optional)"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Add a note…"
              autoCapitalize="sentences"
              icon={<FileText size={18} color={icon.muted} />}
              multiline
            />
          )}
        />

        <FormActions
          onCancel={handleCancel}
          onSave={handleSubmit(onSubmit)}
          saveLabel={isEditMode ? 'Save Changes' : 'Save Transaction'}
          isSaving={isEditMode ? updateTransaction.isPending : createTransaction.isPending}
        />
      </ScrollArea>
    </ScreenWrapper>
  );
}
