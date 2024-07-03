import { UNCATEGORIZED_BUDGET_ID, useBudget } from "../contexts/BudgetContext";
import { BudgetCard } from "./BudgetCard";

export function UncategorizedBudgetCard(props) {
  const { getBudgetExpenses } = useBudget();

  const amount = getBudgetExpenses(UNCATEGORIZED_BUDGET_ID).reduce(
    (total, expense) => {
      return total + expense.amount;
    },
    0
  );

  if (amount === 0) return;

  return <BudgetCard amount={amount} name="Uncategorized" gray {...props} />;
}
