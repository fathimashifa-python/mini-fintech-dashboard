import { useState, useEffect } from "react";
import "./App.css";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
function App() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("Income");
  const [note, setNote] = useState("");
  const [budget, setBudget] = useState(() => {
  const savedBudget =
    localStorage.getItem("budget");

  return savedBudget
    ? Number(savedBudget)
    : 5000;
});
  const [date, setDate] = useState(
  new Date().toISOString().split("T")[0]
);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [editId, setEditId] = useState(null);

  const [transactions, setTransactions] = useState(() => {
  const savedTransactions = localStorage.getItem("transactions");

  if (savedTransactions) {
    return JSON.parse(savedTransactions);
  }
    return  [
        {
          id: 1,
          amount: 10000,
          category: "Salary",
          type: "Income",
          date: "2026-06-13",
        },
        {
          id: 2,
          amount: 500,
          category: "Food",
          type: "Expense",
          date: "2026-06-13",
        },
        {
          id: 3,
          amount: 12000,
          category: "Freelance",
          type: "Income",
          date: "2026-06-04"
        },
        {
          id: 4,
          amount: 2500,
          category: "Groceries",
          type: "Expense",
          date: "2026-06-05"
        },
          {
            id: 5,
            amount: 12000,
            category: "Rent",
            type: "Expense",
            date: "2026-06-01"
          },
          {
            id: 6,
            amount: 1800,
            category: "Utilities",
            type: "Expense",
            date: "2026-06-06"
          },
          {
            id: 7,
            amount: 800,
            category: "Internet",
            type: "Expense",
            date: "2026-06-07"
          },
          {
            id: 8,
            amount: 3500,
            category: "Transportation",
            type: "Expense",
            date: "2026-06-08"
          },
          {
            id: 9,
            amount: 2200,
            category: "Entertainment",
            type: "Expense",
            date: "2026-06-09"
          }
      ];
    });
  useEffect(() => {
  localStorage.setItem(
    "transactions",
    JSON.stringify(transactions)
  );
}, [transactions]);

useEffect(() => {
  localStorage.setItem(
    "budget",
    budget
  );
}, [budget]);
  const addTransaction = () => {
    if (!amount || !category) return;
    if (Number(amount) <= 0) {
  alert("Amount must be greater than 0");
  return;
}

    if (editId) {
  setTransactions(
    transactions.map((t) =>
      t.id === editId
        ? {
            ...t,
            amount: Number(amount),
            category,
            type,
            date,
          }
        : t
    )
  );

  setEditId(null);
} else {
  const newTransaction = {
    id: Date.now(),
    amount: Number(amount),
    category,
    type,
    date,
    note,
  };

  setTransactions([
    ...transactions,
    newTransaction,
  ]);
}
    setAmount("");
    setCategory("");
    setNote("");
    setType("Income");
    setDate(
  new Date().toISOString().split("T")[0]
);
  };

  const deleteTransaction = (id) => {
    setTransactions(
      transactions.filter((t) => t.id !== id)
    );
  };
  const editTransaction = (transaction) => {
  setAmount(transaction.amount);
  setCategory(transaction.category);
  setType(transaction.type);
  setDate(transaction.date);
  setEditId(transaction.id);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
  const exportCSV = () => {
  const headers =
    "Category,Type,Amount,Date\n";

  const rows = transactions
    .map(
      (t) =>
        `${t.category},${t.type},${t.amount},${t.date}`
    )
    .join("\n");

  const csv = headers + rows;

  const blob = new Blob([csv], {
    type: "text/csv",
  });

  const url =
    window.URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;
  a.download = "transactions.csv";

  a.click();
};

  const totalIncome = transactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const expenseCategories = {};

  transactions
    .filter((t) => t.type === "Expense")
    .forEach((t) => {
      expenseCategories[t.category] =
        (expenseCategories[t.category] || 0) +
        t.amount;
    });

  const topCategory =
    Object.keys(expenseCategories).length > 0
      ? Object.keys(expenseCategories).reduce(
          (a, b) =>
            expenseCategories[a] >
            expenseCategories[b]
              ? a
              : b
        )
      : "None";
      
  const chartData = Object.keys(expenseCategories).map(
  (category) => ({
    name: category,
    value: expenseCategories[category],
  })
);

const COLORS = [
  "#6366F1", // Indigo
  "#06B6D4", // Cyan
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Violet
];
const filteredTransactions = transactions.filter(
  (t) =>
    (filter === "All" ||
      t.category === filter) &&
    t.category
      .toLowerCase()
      .includes(search.toLowerCase())
);

  return (
    <div className="App">
      <h1>💰 FinTrack Pro</h1>

      <p className="subtitle">
        Track your income and expenses efficiently
      </p>

      <div className="card">
      <h2>
  {editId
    ? "✏️ Edit Transaction"
    : "➕ Add Transaction"}
</h2>
        
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Amount"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
        />

        <input
          placeholder="Category"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        />

        <input
          type="date"
          value={date}
          onChange={(e) =>
            setDate(e.target.value)
          }
        />
        <select
          value={type}
          onChange={(e) =>
            setType(e.target.value)
          }
        >
          <option>Income</option>
          <option>Expense</option>
        </select>
        <label>📝 Note (Optional)</label>
<input
  type="text"
  placeholder="Enter a note..."
  value={note}
  onChange={(e) => setNote(e.target.value)}
/>
        <label>💰 Budget Limit</label>
        <input
        className="budget-input"
  type="number"
  placeholder="Monthly Budget"
  value={budget}
  onChange={(e) =>
    setBudget(Number(e.target.value))
  }
/>

       <button onClick={addTransaction}>
  {editId
    ? "Update Transaction"
    : "Add Transaction"}
</button>

<button
  onClick={() => {
    if (
      window.confirm(
        "Delete all transactions?"
      )
    ) {
      setTransactions([]);
    }
  }}
>
  Clear All
</button>
<button onClick={exportCSV}>
  Export CSV
</button>
      </div>

      <div className="stats-container">
        <div className="stat-card income">
          <h3>Total Income</h3>
          <h2>₹{totalIncome.toLocaleString("en-IN")}</h2>
        </div>

        <div className="stat-card expense">
          <h3>Total Expense</h3>
          <h2>₹{totalExpense.toLocaleString("en-IN")}</h2>
        </div>

        <div className="stat-card balance">
          <h3>Net Balance</h3>
          <h2
  style={{
    color:
  netBalance >= 0
    ? "#4ade80"
    : "#ef4444",
  }}
>
  ₹{netBalance.toLocaleString("en-IN")}
</h2>
        </div>
        
       <div className="stat-card category-card">
  <h3>Top Category</h3>
  <h2>
    {topCategory.charAt(0).toUpperCase() +
      topCategory.slice(1)}
  </h2>
</div>
      </div>
      
      <div className="card">
  <h2>💡 Recommendation</h2>

  {transactions.length === 0 ? (
    <p>
      Add your first transaction to start
      tracking your finances.
    </p>
  ) : totalExpense > budget ? (
    <p>
      You have exceeded your budget by ₹
      {(totalExpense - budget).toLocaleString("en-IN")}.
      <br />
      Reducing spending in{" "}
      <strong>
        {topCategory.charAt(0).toUpperCase() +
          topCategory.slice(1)}
      </strong>{" "}
      may help you stay within budget next month.
    </p>
  ) : (
    <p>
      Great job! You saved ₹
      {netBalance.toLocaleString("en-IN")} this month.
    </p>
  )}
</div>
      <div className="card">
  <h2>Expense Distribution</h2>

  {chartData.length === 0 ? (
    <p>No expense data available.</p>
  ) : (
    <ResponsiveContainer
      width="100%"
      height={300}
    >
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          outerRadius={120}
          label
        >
          {chartData.map((entry, index) => (
            <Cell
              key={index}
              fill={
                COLORS[index % COLORS.length]
              }
            />
          ))}
        </Pie>

        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )}
  <div className="card">
  <h2>Expense Comparison</h2>

  {chartData.length === 0 ? (
    <p>No expense data available.</p>
  ) : (
    <ResponsiveContainer
      width="100%"
      height={300}
    >
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar
          dataKey="value"
          fill="#5B8DEF"
        />
      </BarChart>
    </ResponsiveContainer>
  )}
</div>
</div>
      <div className="card">
        <h2>Transactions</h2>

         <input
          type="text"
          placeholder="Search category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value)
          }
          style={{
            marginBottom: "15px",
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          <option value="All">
            All Categories
          </option>

          {[...new Set(
            transactions.map(
              (t) => t.category
            )
          )].map((category) => (
            <option
              key={category}
              value={category}
            >
              {category}
            </option>
          ))}
        </select>

        {filteredTransactions.length === 0 ? (
          <div>
  <h3>📭 No Transactions Found</h3>
  <p>Add your first transaction above.</p>
</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Note</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.map(
                (transaction) => (
                  <tr
                    key={transaction.id}
                  >
                    <td>
  {transaction.category.charAt(0).toUpperCase() +
    transaction.category.slice(1)}
</td>

                    <td>
                      {transaction.type}
                    </td>

                    <td>
                      ₹{transaction.amount.toLocaleString("en-IN")}
                    </td>
                    <td>{transaction.date || "No date"}</td>
<td>{transaction.note || "-"}</td>
                    <td>
                      <button
  onClick={() =>
    editTransaction(transaction)
  }
>
  Edit
</button>

<button
  onClick={() =>
    deleteTransaction(
      transaction.id
    )
  }
>
  Delete
</button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>

      

<footer className="footer">
 <p>FinTrack Pro v1.0</p> 
   <p>Developed by Fathima Shifa </p> 
  <p>React . Recharts . Local Storage</p>

</footer>

</div>
);
}

export default App;