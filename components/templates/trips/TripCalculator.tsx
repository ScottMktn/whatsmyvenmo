import React, { useState } from "react";
import Button from "../../shared/Button";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { ArrowPathIcon } from "@heroicons/react/20/solid";

interface TripCalculatorProps {
  tripId: string;
  tripName: string;
  initialValues: any[];
}

const DEFAULT_VAUE = {
  id: crypto.randomUUID(),
  name: "",
  amount: "",
  description: "",
};

const TripCalculator = (props: TripCalculatorProps) => {
  const { tripId, tripName, initialValues } = props;
  // State to store the list of expense rows
  const [expenses, setExpenses] = useState(
    initialValues.length > 0 ? initialValues : [DEFAULT_VAUE]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(tripName === "" ? "New Trip" : tripName);
  const supabase = useSupabaseClient();

  // Function to handle input changes
  const handleChange = (
    id: string,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newExpenses = expenses.map((expense) => {
      if (expense.id === id) {
        return { ...expense, [event.target.name]: event.target.value };
      }
      return expense;
    });
    setExpenses(newExpenses);
  };

  // Function to add a new expense row
  const addExpense = () => {
    setExpenses([
      ...expenses,
      { id: crypto.randomUUID(), name: "", amount: "", description: "" },
    ]);
  };

  // Function to delete an expense row by its ID
  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const saveChanges = async () => {
    setIsLoading(true);

    // Update the name of the trip
    const { data: tripData, error: tripError } = await supabase
      .from("trips")
      .update({ name })
      .eq("id", tripId);

    if (tripError) {
      alert(tripError.message);
      setIsLoading(false);
      return;
    }

    // Get the existing expenses from the database
    const { data: existingExpenses, error: existingExpensesError } =
      await supabase.from("expenses").select("id").eq("trip_id", tripId);

    if (existingExpensesError) {
      alert(existingExpensesError.message);
      setIsLoading(false);
      return;
    }

    // Extract the IDs of the current expenses in the state
    const currentExpenseIds = expenses.map((expense) => expense.id);

    // Find expenses that need to be deleted (those in the database but not in the state)
    const expensesToDelete = existingExpenses.filter(
      (expense) => !currentExpenseIds.includes(expense.id)
    );

    // Delete the removed expenses from the database
    if (expensesToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from("expenses")
        .delete()
        .in(
          "id",
          expensesToDelete.map((expense) => expense.id)
        );

      if (deleteError) {
        alert(deleteError.message);
        setIsLoading(false);
        return;
      }
    }

    // Prepare the remaining expenses for upsert (insert or update)
    const newExpenseData = expenses.map((expense) => ({
      id: expense.id,
      trip_id: tripId,
      name: expense.name,
      amount: expense.amount,
      description: expense.description,
    }));

    // Upsert the remaining expenses (insert new ones, update existing ones)
    const { data: upsertData, error: upsertError } = await supabase
      .from("expenses")
      .upsert(newExpenseData, { onConflict: "id" });

    if (upsertError) {
      alert(upsertError.message);
      setIsLoading(false);
      return;
    }

    alert("Changes saved successfully!");
    setIsLoading(false);
  };

  // Function to calculate the breakdown of who owes whom
  const calculateOwedAmounts = () => {
    const totals = expenses.reduce(
      (acc: { [key: string]: number }, expense) => {
        acc[expense.name] = (acc[expense.name] || 0) + Number(expense.amount);
        return acc;
      },
      {}
    );

    const totalExpenses = Object.values(totals).reduce(
      (acc, amount) => acc + amount,
      0
    );

    const numPeople = Object.keys(totals).length;
    const fairShare = totalExpenses / numPeople;

    const balances = Object.entries(totals).map(([name, amount]) => ({
      name,
      balance: amount - fairShare,
    }));

    // Sort balances to determine who owes whom
    const creditors = balances
      .filter((person) => person.balance > 0)
      .sort((a, b) => b.balance - a.balance);
    const debtors = balances
      .filter((person) => person.balance < 0)
      .sort((a, b) => a.balance - b.balance);

    const transactions = [];

    while (creditors.length > 0 && debtors.length > 0) {
      const creditor = creditors[0];
      const debtor = debtors[0];

      const payment = Math.min(creditor.balance, -debtor.balance);
      transactions.push({
        from: debtor.name,
        to: creditor.name,
        amount: payment,
      });

      creditor.balance -= payment;
      debtor.balance += payment;

      if (creditor.balance === 0) creditors.shift();
      if (debtor.balance === 0) debtors.shift();
    }

    return transactions;
  };

  const transactions = calculateOwedAmounts();

  return (
    <div className="flex flex-col space-y-4 py-8 px-4">
      <div className="flex flex-col space-y-4">
        <label htmlFor="trip-name" className="text-sm font-semibold">
          Trip Name
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            name="trip-name"
            placeholder="Enter Trip Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 rounded-md max-w-xs text-black"
          />
          <Button variant="primary" onClick={saveChanges}>
            <div className="flex items-center space-x-2">
              {isLoading && <ArrowPathIcon className="animate-spin h-5 w-5" />}
              <span>Save Changes</span>
            </div>
          </Button>
        </div>
      </div>
      <h2 className="text-sm font-semibold pt-16">Bills/Expenses</h2>
      <ul className="expenses-list text-black flex flex-col space-y-2">
        {expenses.map((expense, index) => (
          <li
            key={expense.id}
            className="expense-row flex items-center space-x-2"
          >
            <p className="text-xs w-4 text-white">{index + 1}</p>
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              value={expense.name}
              onChange={(e) => handleChange(expense.id, e)}
              className="w-1/4 p-2 rounded-md"
            />
            <input
              type="number"
              name="amount"
              placeholder="$"
              value={expense.amount}
              onChange={(e) => handleChange(expense.id, e)}
              className="w-1/4 p-2 rounded-md"
            />
            <input
              type="text"
              name="description"
              placeholder="Enter description"
              value={expense.description}
              onChange={(e) => handleChange(expense.id, e)}
              className="w-1/2 p-2 rounded-md"
            />
            <Button
              onClick={() => deleteExpense(expense.id)}
              variant="secondary"
            >
              x
            </Button>
          </li>
        ))}
      </ul>
      <div>
        <Button onClick={addExpense} variant="secondary">
          + Add
        </Button>
      </div>
      <div className="pt-16 flex flex-col space-y-4">
        <h3 className="text-sm font-semibold">Calculations</h3>
        <ul className="flex flex-col space-y-1">
          <li className="text-lg">
            Total Expenses:{" $"}
            {expenses.reduce((acc, expense) => acc + Number(expense.amount), 0)}
          </li>
          <li className="text-lg">
            Unique People:{" "}
            {
              expenses.reduce((acc: string[], expense) => {
                if (acc.includes(expense.name)) {
                  return acc;
                }
                return [...acc, expense.name];
              }, []).length
            }
          </li>
          <li className="text-lg flex flex-col space-y-2">
            <p>Breakdown:</p>
            <ul className="flex flex-col pl-8">
              {transactions.map((transaction, index) => (
                <li key={index} className="text-lg">
                  {transaction.from} owes {transaction.to}: $
                  {transaction.amount.toFixed(2)}
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TripCalculator;
