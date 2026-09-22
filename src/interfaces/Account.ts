export type AccountType = "cash" | "bank" | "credit_card" | "digital_wallet";

export interface Account {
  id: string;
  name: string;
  color: string;
  icon: string;
  /** Server returns this as `accountType` (NestJS DTO). */
  accountType: AccountType;
  balance: number;
  /** Sum of incoming transactions for the current month, supplied by the API.
   *  Optional so the build doesn't break before the backend ships it. */
  monthlyIn?: number;
  /** Sum of outgoing transactions for the current month (positive number),
   *  supplied by the API. Optional for the same reason as `monthlyIn`. */
  monthlyOut?: number;
}

export interface CreateAccountPayload {
  name: string;
  type: AccountType;
  color: string;
  icon: string;
  balance: number;
}

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  cash: "Cash",
  bank: "Bank",
  credit_card: "Credit Card",
  digital_wallet: "Digital Wallet",
};
