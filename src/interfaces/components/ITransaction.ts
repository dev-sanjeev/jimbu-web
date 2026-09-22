export interface ITransaction {
  amount: string;
  type: TransactionType;
  categoryName: string;
  icon: string;
  color: string;
  date: string;
}

export enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense",
}
