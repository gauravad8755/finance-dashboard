import { useState } from "react";

export default function ExpenseForm({ addExpense }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !amount) return;

    addExpense({
      name,
      amount: parseFloat(amount),
    });

    setName("");
    setAmount("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Expense name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button type="submit">Add</button>
    </form>
  );
}
