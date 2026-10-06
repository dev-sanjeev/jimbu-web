import AccountPreviewCard from "@/components/accounts/AccountPreviewCard";
import AddScreenHeader from "@/components/shared/AddScreenHeader";
import ColorPicker from "@/components/shared/ColorPicker";
import FormActions from "@/components/shared/FormActions";
import FormField from "@/components/shared/FormField";
import IconPicker, { IconOption } from "@/components/shared/IconPicker";
import PillGroup, { PillOption } from "@/components/shared/PillGroup";
import ScreenWrapper from "@/components/shared/ScreenWrapper";
import ScrollArea from "@/components/shared/ScrollArea";
import { useCreateAccount } from "@/hooks/accounts/useCreateAccount";
import { useGetAccounts } from "@/hooks/accounts/useGetAccounts";
import { useUpdateAccount } from "@/hooks/accounts/useUpdateAccount";
import { useIconColors } from "@/hooks/useIconColors";
import {
  ACCOUNT_TYPE_LABELS,
  Account,
  AccountType,
  CreateAccountPayload,
} from "@/interfaces/Account";
import {
  Bitcoin,
  Briefcase,
  Building,
  Coins,
  CreditCard,
  Globe,
  Landmark,
  Pencil,
  PiggyBank,
  Smartphone,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

const COLORS = [
  "#22c55e",
  "#4f46e5",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#0ea5e9",
];

const ICONS: IconOption[] = [
  { id: "landmark", component: Landmark },
  { id: "wallet", component: Wallet },
  { id: "credit-card", component: CreditCard },
  { id: "piggy-bank", component: PiggyBank },
  { id: "coins", component: Coins },
  { id: "briefcase", component: Briefcase },
  { id: "building", component: Building },
  { id: "smartphone", component: Smartphone },
  { id: "bitcoin", component: Bitcoin },
  { id: "globe", component: Globe },
];

const ACCOUNT_TYPE_OPTIONS: PillOption<AccountType>[] = (
  Object.keys(ACCOUNT_TYPE_LABELS) as AccountType[]
).map((value) => ({ value, label: ACCOUNT_TYPE_LABELS[value] }));

interface FormValues {
  name: string;
  type: AccountType;
  initialBalance: string;
  color: string;
  icon: string;
}

const DEFAULT_VALUES: FormValues = {
  name: "",
  type: "bank",
  initialBalance: "",
  color: COLORS[0],
  icon: "landmark",
};

export default function AddAccountPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const icon = useIconColors();

  const { data: accounts } = useGetAccounts();
  const editingAccount: Account | undefined = useMemo(() => {
    if (!id) return undefined;
    return (accounts as Account[] | undefined)?.find(
      (a) => String(a.id) === String(id),
    );
  }, [accounts, id]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (editingAccount) {
      reset({
        name: editingAccount.name,
        type: editingAccount.accountType,
        initialBalance: String(editingAccount.balance ?? ""),
        color: editingAccount.color,
        icon: editingAccount.icon,
      });
    }
  }, [editingAccount, reset]);

  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();
  const watched = useWatch({ control });

  const onSubmit = (values: FormValues) => {
    const payload: CreateAccountPayload = {
      name: values.name.trim(),
      type: values.type,
      color: values.color,
      icon: values.icon,
      balance: parseFloat(values.initialBalance) || 0,
    };

    if (isEditMode && id) {
      updateAccount.mutate(
        { id, payload },
        {
          onSuccess: () => {
            toast.success("Account updated!");
            navigate(-1);
          },
          onError: (error) =>
            toast.error("Could not update account", {
              description: error.message,
            }),
        },
      );
      return;
    }

    createAccount.mutate(payload, {
      onSuccess: () => {
        toast.success("Account created!");
        navigate(-1);
      },
      onError: (error) =>
        toast.error("Could not create account", { description: error.message }),
    });
  };

  const [confirmDiscardOpen, setConfirmDiscardOpen] = useState(false);

  const handleCancel = () => {
    if (!isDirty) {
      navigate(-1);
      return;
    }
    setConfirmDiscardOpen(true);
  };

  const headerTitle = isEditMode ? "Edit Account" : "New Account";
  const saveLabel = isEditMode ? "Save" : "Save Account";
  const isSaving = isEditMode
    ? updateAccount.isPending
    : createAccount.isPending;

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
      <AddScreenHeader title={headerTitle} onBack={handleCancel} />
      <ScrollArea className="pb-20 pt-2 flex flex-col gap-6">
        <AccountPreviewCard
          name={watched.name ?? ""}
          typeLabel={ACCOUNT_TYPE_LABELS[watched.type ?? "bank"]}
          balance={parseFloat(watched.initialBalance ?? "") || 0}
          color={watched.color ?? DEFAULT_VALUES.color}
          iconName={watched.icon ?? DEFAULT_VALUES.icon}
        />

        <Controller
          control={control}
          name="name"
          rules={{
            required: "Account name is required",
            validate: (v) => v.trim().length > 0 || "Account name is required",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label="Account Name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="e.g. Chase Checking"
              icon={<Pencil size={18} color={icon.muted} />}
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="type"
          render={({ field: { onChange, value } }) => (
            <PillGroup<AccountType>
              label="Account Type"
              options={ACCOUNT_TYPE_OPTIONS}
              value={value}
              onChange={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="initialBalance"
          render={({ field: { onChange, onBlur, value } }) => (
            <FormField
              label={isEditMode ? "Balance" : "Initial Balance"}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="0.00"
              prefix="$"
            />
          )}
        />

        <Controller
          control={control}
          name="color"
          render={({ field: { onChange, value } }) => (
            <ColorPicker
              label="Color"
              colors={COLORS}
              value={value}
              onChange={onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="icon"
          render={({ field: { onChange, value } }) => (
            <IconPicker
              label="Icon"
              icons={ICONS}
              value={value}
              onChange={onChange}
            />
          )}
        />

        <FormActions
          onCancel={handleCancel}
          onSave={handleSubmit(onSubmit)}
          saveLabel={saveLabel}
          isSaving={isSaving}
        />
      </ScrollArea>
    </ScreenWrapper>
  );
}
