export default function ExpenseList({ expenses }) {
  return (
    <div>
      <h3>Expenses</h3>
      {expenses.map((e, i) => (
        <div key={i}>
          {e.name} - ₹{e.amount}
        </div>
      ))}
    </div>
  );
}
