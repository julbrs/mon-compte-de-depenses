import { useState } from "react";
import ExpenseForm from "./components/ExpenseForm.tsx";
import ExpenseList from "./components/ExpenseList.tsx";
import { generatePDF } from "./utils/pdfGenerator.ts";
import type { Expense } from "./types/expense";

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [volunteerName, setVolunteerName] = useState("");
  const [kmRate] = useState(0.25); // Taux par km en dollars

  const addExpense = (expense: Omit<Expense, "id">) => {
    setExpenses([...expenses, { ...expense, id: Date.now() }]);
  };

  const deleteExpense = (id: number) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
  };

  const calculateTotal = (): number => {
    return expenses.reduce((total, expense) => {
      if (expense.type === "km") {
        return total + (expense.kilometers || 0) * kmRate;
      } else {
        return total + (expense.amount || 0);
      }
    }, 0);
  };

  const handleGeneratePDF = () => {
    if (!volunteerName.trim()) {
      alert("Veuillez entrer le nom du bénévole");
      return;
    }
    if (expenses.length === 0) {
      alert("Veuillez ajouter au moins une dépense");
      return;
    }
    generatePDF(volunteerName, expenses, kmRate, calculateTotal());
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-500 to-purple-600">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
            Compte de Dépenses - Sentier Pédestre
          </h1>
          <p className="text-gray-600 text-lg">Gestion des remboursements pour bénévoles</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <label htmlFor="volunteerName" className="block text-gray-700 font-semibold mb-2">
            Nom du bénévole :
          </label>
          <input
            id="volunteerName"
            type="text"
            value={volunteerName}
            onChange={(e) => setVolunteerName(e.target.value)}
            placeholder="Entrez votre nom"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>

        <ExpenseForm onAddExpense={addExpense} kmRate={kmRate} />

        <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} kmRate={kmRate} />

        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Résumé</h2>
          <div className="bg-gray-50 rounded-md p-6 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-xl font-semibold text-gray-700">Total à rembourser :</span>
            <span className="text-3xl font-bold text-green-600">
              {calculateTotal().toFixed(2)} $
            </span>
          </div>
          <button
            onClick={handleGeneratePDF}
            disabled={expenses.length === 0 || !volunteerName.trim()}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-md transition duration-200 text-lg"
          >
            Générer le PDF du compte de dépenses
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
