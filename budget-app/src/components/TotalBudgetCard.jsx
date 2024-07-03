import { useBudget } from "../contexts/BudgetContext";
import { BudgetCard } from "./BudgetCard";

export function TotalBudgetCard() {
  const { expenses, budgets } = useBudget();

  const amount = expenses.reduce((total, expense) => {
    return total + expense.amount;
  }, 0);

  const max = budgets.reduce((total, budget) => {
    return total + budget.max;
  }, 0);

  if (max === 0) return;

  return <BudgetCard amount={amount} name="Total" gray max={max} hideButtons />;
}
