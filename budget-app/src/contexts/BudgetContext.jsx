import { createContext, useContext } from "react";
import { v4 as uuidV4 } from "uuid";
import { useLocalStorage } from "../hooks/useLocalStorage";

const BudgetContext = createContext();

export const UNCATEGORIZED_BUDGET_ID = "uncategorized";

export function useBudget() {
  return useContext(BudgetContext);
}

export const BudgetsProvider = ({ children }) => {
  const [budgets, setBudgets] = useLocalStorage("budgets", []);
  const [expenses, setExpenses] = useLocalStorage("expenses", []);

  function getBudgetExpenses(budgetId) {
    return expenses.filter((expense) => expense.budgetId === budgetId);
  }

  function addExpense({ description, amount, budgetId }) {
    setExpenses((prev) => {
      return [...prev, { id: uuidV4(), description, amount, budgetId }];
    });
  }

  function addBudget({ name, max }) {
    setBudgets((prev) => {
      if (prev.find((budget) => budget.name === name)) {
        return prev;
      }

      return [...prev, { id: uuidV4(), name, max }];
    });
  }

  function deleteBudget({ id }) {
    setExpenses((pre) => {
      return pre.map((expense) => {
        if (expense.budgetId !== id) return expense;

        return { ...expense, budgetId: UNCATEGORIZED_BUDGET_ID };
      });
    });

    setBudgets((pre) => pre.filter((budget) => budget.id !== id));
  }

  function deleteExpense({ id }) {
    setExpenses((pre) => pre.filter((expense) => expense.id !== id));
  }

  return (
    <BudgetContext.Provider
      value={{
        budgets,
        expenses,
        getBudgetExpenses,
        addExpense,
        addBudget,
        deleteBudget,
        deleteExpense,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};
