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
      {/* BACKGROUND */}
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="fixed inset-0 -z-10 bg-black/70" />

      <div className="flex">
        {/* OVERLAY (mobile) */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}

        {/* SIDEBAR */}
        <div
          className={`fixed top-0 left-0 w-64 h-full z-50 
          bg-gradient-to-b from-black/60 to-black/30 
          backdrop-blur-lg 
          shadow-[4px_0_25px_rgba(0,0,0,0.6)]
          px-6 py-8 transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
          {/* HEADER */}
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-2xl font-bold">Finance</h2>
              <p className="text-gray-400 text-sm">Dashboard Panel</p>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-white text-xl"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <div
              onClick={() => {
                setView("dashboard");
                setSidebarOpen(false);
              }}
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
              onClick={() => {
                setView("expenses");
                setSidebarOpen(false);
              }}
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
        <div className="flex-1 flex flex-col ml-0 md:ml-64 w-full">
          {/* HEADER */}
          <div className="flex justify-between items-center px-6 md:px-10 py-5 border-b border-white/10">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden bg-white/10 px-3 py-2 rounded"
              >
                ☰
              </button>

              <h1 className="text-xl md:text-3xl font-semibold capitalize">
                {view}
              </h1>
            </div>

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
          <div className="px-6 md:px-10 py-6 flex-1">
            {/* FORM */}
            {showForm && (
              <div className="flex flex-col md:flex-row gap-4 mb-6 bg-white/10 p-4 rounded-xl">
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
              </div>
            )}

            {/* DASHBOARD */}
            {view === "dashboard" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-white/10 p-6 rounded-xl">₹{total}</div>
                  <div className="bg-white/10 p-6 rounded-xl">
                    {expenses.length}
                  </div>
                  <div className="bg-white/10 p-6 rounded-xl">{top}</div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white/10 p-6 rounded-xl">
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

                  <div className="bg-white/10 p-6 rounded-xl">
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie data={expenses} dataKey="amount" outerRadius={80}>
                          {expenses.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* INSIGHTS */}
                <div className="bg-white/10 p-6 rounded-xl text-center">
                  <h3 className="text-gray-400 mb-2">Insights</h3>
                  <p>
                    You’ve logged {expenses.length} expenses totaling ₹{total}
                  </p>
                </div>
              </>
            )}

            {/* EXPENSES */}
            {view === "expenses" && (
              <div className="bg-white/10 p-6 rounded-xl">
                {expenses.map((e, i) => (
                  <div
                    key={i}
                    className="flex justify-between py-3 border-b border-white/10"
                  >
                    <span>{e.name}</span>
                    <div className="flex gap-3 items-center">
                      ₹{e.amount}
                      <FaTrash
                        className="cursor-pointer text-red-400"
                        onClick={() => deleteExpense(i)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
