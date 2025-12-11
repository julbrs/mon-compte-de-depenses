export interface Expense {
  id: number;
  type: "invoice" | "km";
  description: string;
  amount?: number;
  kilometers?: number;
  fileName?: string;
  file?: File;
}

export interface ExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, "id">) => void;
  kmRate: number;
}

export interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: number) => void;
  kmRate: number;
}
