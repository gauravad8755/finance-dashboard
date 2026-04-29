import { useState, useEffect } from "react";
import bgImage from "../assets/bg.jpg";
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
} from "react-icons/fa";
import { motion } from "framer-motion";

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#a855f7"];

export default function Dashboard() {
  const [expenses, setExpenses] = useState(() => {
    return JSON.parse(localStorage.getItem("expenses")) || [];
  });

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState("dashboard");

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = () => {
    if (!name || !amount) return;
    setExpenses([...expenses, { name, amount: parseFloat(amount) }]);
    setName("");
    setAmount("");
  };

  const deleteExpense = (index) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const top =
    expenses.length > 0
      ? expenses.reduce((a, b) => (a.amount > b.amount ? a : b)).name
      : "-";

  // ✅ EXPORT CSV FUNCTION
  const exportCSV = () => {
    if (expenses.length === 0) return;

    const rows = expenses.map((e) => `${e.name},${e.amount}`);
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "expenses.csv";
    a.click();
  };

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* 🔥 BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      />

      {/* 🔥 DARK OVERLAY (VERY IMPORTANT for readability) */}
      <div className="absolute inset-0 -z-10 bg-black/60" />

      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <div className="w-64 flex-shrink-0 bg-white/5 backdrop-blur-lg border-r border-white/10 px-6 py-8">
          <div className="mb-12">
            <h2 className="text-2xl font-bold">Finance</h2>
            <p className="text-gray-400 text-sm mt-1">Dashboard Panel</p>
          </div>

          <div className="flex flex-col gap-3">
            <div
              onClick={() => setView("dashboard")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer ${
                view === "dashboard"
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:bg-white/10"
              }`}
            >
              <FaChartPie className="text-blue-400" />
              Dashboard
            </div>

            <div
              onClick={() => setView("expenses")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer ${
                view === "expenses"
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:bg-white/10"
              }`}
            >
              <FaWallet />
              Expenses
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className="flex-1 flex flex-col">
          {/* NAVBAR */}
          <div className="flex justify-between items-center px-8 py-5 border-b border-white/10">
            <h1 className="text-xl font-semibold capitalize">{view}</h1>

            {/* ✅ BUTTONS */}
            <div className="flex gap-2">
              <button
                onClick={exportCSV}
                className="bg-gray-700 px-3 py-1.5 rounded-md text-sm flex items-center gap-2 hover:bg-gray-600"
              >
                <FaDownload size={12} /> Export
              </button>

              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-500 px-3 py-1.5 rounded-md text-sm flex items-center gap-2 hover:bg-blue-600"
              >
                <FaPlus size={12} /> Add
              </button>
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-8 flex-1 flex flex-col">
            {/* FORM */}
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 mb-8 bg-white/5 p-4 rounded-xl"
              >
                <input
                  placeholder="Expense"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-transparent border border-white/20 px-4 py-2 rounded-lg w-full"
                />

                <input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-transparent border border-white/20 px-4 py-2 rounded-lg w-full"
                />

                <button
                  onClick={() => {
                    addExpense();
                    setShowForm(false);
                  }}
                  className="bg-green-500 px-4 py-2 rounded-lg"
                >
                  Save
                </button>
              </motion.div>
            )}

            <div className="flex-1 flex flex-col">
              {/* DASHBOARD */}
              {view === "dashboard" && (
                <div className="flex flex-col h-full">
                  <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-white/5 p-6 rounded-xl">
                      <p>Total</p>
                      <h2 className="text-2xl">₹{total}</h2>
                    </div>

                    <div className="bg-white/5 p-6 rounded-xl">
                      <p>Transactions</p>
                      <h2 className="text-2xl">{expenses.length}</h2>
                    </div>

                    <div className="bg-white/5 p-6 rounded-xl">
                      <p>Top</p>
                      <h2 className="text-2xl">{top}</h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white/5 p-6 rounded-xl">
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={expenses}>
                          <XAxis dataKey="name" stroke="#aaa" />
                          <YAxis stroke="#aaa" />
                          <Tooltip />
                          <Bar dataKey="amount">
                            {expenses.map((_, i) => (
                              <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="bg-white/5 p-6 rounded-xl">
                      <PieChart width={300} height={250}>
                        <Pie data={expenses} dataKey="amount" outerRadius={80}>
                          {expenses.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </div>
                  </div>

                  {/* INSIGHTS (UNCHANGED) */}
                  <div className="flex-1 mt-6 bg-white/5 rounded-xl p-6">
                    <h3 className="text-lg mb-6 text-gray-300">Insights</h3>

                    {expenses.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-gray-500">
                        Add expenses to see analytics 📊
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white/5 p-4 rounded-lg">
                          <p className="text-gray-400 text-sm">Highest</p>
                          <h2 className="text-xl text-red-400">
                            ₹{Math.max(...expenses.map((e) => e.amount))}
                          </h2>
                        </div>

                        <div className="bg-white/5 p-4 rounded-lg">
                          <p className="text-gray-400 text-sm">Lowest</p>
                          <h2 className="text-xl text-green-400">
                            ₹{Math.min(...expenses.map((e) => e.amount))}
                          </h2>
                        </div>

                        <div className="bg-white/5 p-4 rounded-lg">
                          <p className="text-gray-400 text-sm">Average</p>
                          <h2 className="text-xl text-blue-400">
                            ₹{(total / expenses.length).toFixed(2)}
                          </h2>
                        </div>

                        <div className="bg-white/5 p-4 rounded-lg">
                          <p className="text-gray-400 text-sm">Entries</p>
                          <h2 className="text-xl">{expenses.length}</h2>
                        </div>

                        <div className="col-span-2 bg-white/5 p-4 rounded-lg">
                          <p className="text-gray-400 text-sm">Insight</p>
                          <p className="text-sm mt-2 text-gray-300">
                            You spend most on{" "}
                            <span className="text-blue-400 font-medium">
                              {top}
                            </span>{" "}
                            with an average of{" "}
                            <span className="text-yellow-400 font-medium">
                              ₹{(total / expenses.length).toFixed(2)}
                            </span>
                            .
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* EXPENSES VIEW */}
              {view === "expenses" && (
                <div className="flex flex-col h-full">
                  <div className="bg-white/5 p-6 rounded-xl">
                    <h2 className="text-xl mb-4">All Expenses</h2>

                    {expenses.length === 0 && (
                      <p className="text-gray-400">No expenses yet</p>
                    )}

                    {expenses.map((e, i) => (
                      <div
                        key={i}
                        className="flex justify-between py-3 border-b border-white/10"
                      >
                        <span>{e.name}</span>

                        <div className="flex gap-3">
                          <span>₹{e.amount}</span>
                          <FaTrash
                            className="cursor-pointer text-red-400"
                            onClick={() => deleteExpense(i)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex-1 mt-6 bg-white/5 rounded-xl flex items-center justify-center text-gray-500">
                    Track your spending patterns over time 📊
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
