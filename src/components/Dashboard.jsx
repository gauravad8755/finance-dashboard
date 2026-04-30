import { useState, useEffect } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  FaChartPie,
  FaWallet,
  FaPlus,
  FaTrash,
  FaDownload,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#a855f7"];

export default function Dashboard() {
  const [expenses, setExpenses] = useState(() => {
    return JSON.parse(localStorage.getItem("expenses")) || [];
  });

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = () => {
    if (!name || !amount) return;

    setExpenses([...expenses, { name, amount: parseFloat(amount) }]);
    setName("");
    setAmount("");
    setShowForm(false);
  };

  const deleteExpense = (index) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const top =
    expenses.length > 0
      ? expenses.reduce((a, b) => (a.amount > b.amount ? a : b)).name
      : "-";

  const exportCSV = () => {
    if (expenses.length === 0) return;

    const rows = [
      "Name,Amount",
      ...expenses.map((e) => `${e.name},${e.amount}`),
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.csv";
    a.click();

    URL.revokeObjectURL(url);
  };

  const pageWrap = "w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8";
  const card =
    "rounded-xl border border-white/10 bg-[#1d1d22]/80 shadow-lg shadow-black/20 backdrop-blur-md";

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
        />
      )}

      <div className="mx-auto flex min-h-screen w-full max-w-7xl">
        <aside
          className={`fixed left-0 top-0 z-50 h-full w-64 border-r border-white/10
          bg-black/55 px-5 py-6 backdrop-blur-xl transition-transform duration-300
          md:relative md:left-auto md:top-auto md:min-h-screen md:translate-x-0 md:shrink-0
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="mb-10 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">Finance</h2>
              <p className="mt-1 text-sm text-gray-400">Dashboard Panel</p>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-gray-300 hover:bg-white/10 md:hidden"
            >
              <FaTimes />
            </button>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => {
                setView("dashboard");
                setSidebarOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition ${
                view === "dashboard"
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <FaChartPie className="text-blue-400" />
              Dashboard
            </button>

            <button
              onClick={() => {
                setView("expenses");
                setSidebarOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition ${
                view === "expenses"
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <FaWallet />
              Expenses
            </button>
          </nav>
        </aside>

        <main className="min-h-screen min-w-0 flex-1">
          <header className="border-b border-white/10 bg-black/20 backdrop-blur-md">
            <div
              className={`${pageWrap} flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-6`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="rounded-lg bg-white/10 p-3 hover:bg-white/15 md:hidden"
                >
                  <FaBars />
                </button>

                <div>
                  <h1 className="text-2xl font-bold capitalize sm:text-4xl">
                    {view}
                  </h1>
                  <p className="mt-1 hidden text-sm text-gray-400 sm:block">
                    Track your expenses and spending insights
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex">
                <button
                  onClick={exportCSV}
                  className="flex items-center justify-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-sm hover:bg-white/15"
                >
                  <FaDownload size={12} />
                  Export
                </button>

                <button
                  onClick={() => setShowForm(!showForm)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium hover:bg-blue-600"
                >
                  <FaPlus size={12} />
                  Add
                </button>
              </div>
            </div>
          </header>

          <section className={`${pageWrap} py-5 sm:py-8`}>
            {showForm && (
              <div
                className={`${card} mb-5 grid gap-3 p-4 sm:mb-6 md:grid-cols-[1fr_1fr_auto]`}
              >
                <input
                  placeholder="Expense name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/25 px-4 py-3 text-sm outline-none placeholder:text-gray-500 focus:border-blue-400"
                />

                <input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/25 px-4 py-3 text-sm outline-none placeholder:text-gray-500 focus:border-blue-400"
                />

                <button
                  onClick={addExpense}
                  className="rounded-lg bg-green-500 px-6 py-3 text-sm font-medium hover:bg-green-600"
                >
                  Save
                </button>
              </div>
            )}

            {view === "dashboard" && (
              <>
                <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                  <div className={`${card} p-4 sm:p-5`}>
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Total Spent
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold">₹{total}</h2>
                  </div>

                  <div className={`${card} p-4 sm:p-5`}>
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Entries
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold">
                      {expenses.length}
                    </h2>
                  </div>

                  <div className={`${card} p-4 sm:p-5`}>
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Highest
                    </p>
                    <h2 className="mt-2 truncate text-2xl font-semibold">
                      {top}
                    </h2>
                  </div>
                </div>

                <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className={`${card} p-4 sm:p-5`}>
                    <h3 className="mb-4 text-sm font-medium text-gray-300">
                      Expense Chart
                    </h3>

                    {expenses.length > 0 ? (
                      <div className="h-56 sm:h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={expenses}>
                            <XAxis dataKey="name" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip />
                            <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                              {expenses.map((_, i) => (
                                <Cell
                                  key={i}
                                  fill={COLORS[i % COLORS.length]}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="flex h-56 items-center justify-center rounded-lg border border-dashed border-white/10 text-sm text-gray-500 sm:h-64">
                        No chart data yet
                      </div>
                    )}
                  </div>

                  <div className={`${card} p-4 sm:p-5`}>
                    <h3 className="mb-4 text-sm font-medium text-gray-300">
                      Expense Split
                    </h3>

                    {expenses.length > 0 ? (
                      <div className="h-56 sm:h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={expenses}
                              dataKey="amount"
                              outerRadius="75%"
                            >
                              {expenses.map((_, i) => (
                                <Cell
                                  key={i}
                                  fill={COLORS[i % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="flex h-56 items-center justify-center rounded-lg border border-dashed border-white/10 text-sm text-gray-500 sm:h-64">
                        No expense split yet
                      </div>
                    )}
                  </div>
                </div>

                <div className={`${card} p-5 text-center`}>
                  <h3 className="mb-2 text-sm text-gray-400">Insights</h3>
                  <p className="text-sm sm:text-base">
                    You’ve logged {expenses.length} expenses totaling ₹{total}
                  </p>
                </div>
              </>
            )}

            {view === "expenses" && (
              <div className={`${card} p-4 sm:p-5`}>
                {expenses.length === 0 ? (
                  <p className="py-10 text-center text-sm text-gray-500">
                    No expenses added yet
                  </p>
                ) : (
                  <div className="divide-y divide-white/10">
                    {expenses.map((e, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-4 py-4"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-medium">{e.name}</p>
                          <p className="text-sm text-gray-400">₹{e.amount}</p>
                        </div>

                        <button
                          onClick={() => deleteExpense(i)}
                          className="shrink-0 rounded-lg p-2 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
