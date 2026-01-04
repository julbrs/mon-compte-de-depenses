import { useState } from "react";
import ExpenseForm from "./components/ExpenseForm.tsx";
import ExpenseList from "./components/ExpenseList.tsx";
import InvoiceForm from "./components/InvoiceForm.tsx";
import InvoiceList from "./components/InvoiceList.tsx";
import { generatePDF } from "./utils/pdfGenerator.ts";
import { generateInvoicePDF } from "./utils/invoicePdfGenerator.ts";
import type { Expense } from "./types/expense";
import type { Invoice } from "./types/invoice";

type PageView = "expenses" | "invoices";

function App() {
  const [currentPage, setCurrentPage] = useState<PageView>("expenses");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [volunteerName, setVolunteerName] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [kmRate] = useState(0.25); // Taux par km en dollars

  const addExpense = (expense: Omit<Expense, "id">) => {
    setExpenses([...expenses, { ...expense, id: Date.now() }]);
  };

  const addMultipleExpenses = (newExpenses: Omit<Expense, "id">[]) => {
    setExpenses((prevExpenses) => [
      ...prevExpenses,
      ...newExpenses.map((expense, index) => ({
        ...expense,
        id: Date.now() + index,
      })),
    ]);
  };

  const deleteExpense = (id: number) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
  };

  const addInvoice = (invoice: Omit<Invoice, "id">) => {
    setInvoices([...invoices, { ...invoice, id: Date.now() }]);
  };

  const deleteInvoice = (id: number) => {
    setInvoices(invoices.filter((inv) => inv.id !== id));
  };

  const handleGenerateInvoicePDF = async (invoice: Invoice) => {
    try {
      await generateInvoicePDF(invoice);
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      alert("Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.");
    }
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

  const handleGeneratePDF = async () => {
    if (!volunteerName.trim()) {
      alert("Veuillez entrer le nom du bénévole");
      return;
    }
    if (expenses.length === 0) {
      alert("Veuillez ajouter au moins une dépense");
      return;
    }

    try {
      await generatePDF(volunteerName, expenses, kmRate, calculateTotal(), additionalInfo);
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      alert("Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-600 to-emerald-800">
      <header className="bg-white shadow-md border-b-4 border-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-2 flex items-center justify-center gap-3">
            🌲 Sentiers Frontaliers Inc. 🌲
          </h1>
          <p className="text-gray-600 text-lg flex items-center justify-center gap-2">
            🥾 Gestion des remboursements et facturation 🍃
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setCurrentPage("expenses")}
              className={`px-6 py-3 font-semibold transition ${
                currentPage === "expenses"
                  ? "border-b-4 border-green-600 text-green-700"
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              📝 Compte de dépenses
            </button>
            <button
              onClick={() => setCurrentPage("invoices")}
              className={`px-6 py-3 font-semibold transition ${
                currentPage === "invoices"
                  ? "border-b-4 border-green-600 text-green-700"
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              🧾 Facturation
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === "expenses" ? (
          <>
            {/* Instructions Box */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-green-600">
              <h2 className="text-xl font-semibold text-green-800 mb-3 flex items-center gap-2">
                <span>ℹ️</span>
                Comment utiliser cet outil
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Ajoutez toutes vos dépenses (factures PDF ou remboursements kilométriques)</li>
                <li>Cliquez sur "Générer le PDF" pour créer votre compte de dépenses</li>
                <li>Envoyez le PDF généré par email à la comptabilité des Sentiers Frontaliers</li>
              </ol>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-t-4 border-green-500">
              <label htmlFor="volunteerName" className="block text-gray-700 font-semibold mb-2">
                🌿 Nom du bénévole :
              </label>
              <input
                id="volunteerName"
                type="text"
                value={volunteerName}
                onChange={(e) => setVolunteerName(e.target.value)}
                placeholder="Entrez votre nom"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-t-4 border-green-500">
              <label htmlFor="additionalInfo" className="block text-gray-700 font-semibold mb-2">
                📝 Informations complémentaires (facultatif) :
              </label>
              <textarea
                id="additionalInfo"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Ajoutez un commentaire si nécessaire..."
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none"
              />
            </div>

            <ExpenseForm
              onAddExpense={addExpense}
              onAddMultipleExpenses={addMultipleExpenses}
              kmRate={kmRate}
            />

            <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} kmRate={kmRate} />

            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 border-t-4 border-green-500">
              <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-2">
                📊 Résumé
              </h2>
              <div className="bg-green-50 rounded-md p-6 mb-6 flex flex-col md:flex-row justify-between items-center gap-4 border-2 border-green-200">
                <span className="text-xl font-semibold text-gray-700">💰 Total à rembourser :</span>
                <span className="text-3xl font-bold text-green-700">
                  {calculateTotal().toFixed(2)} $
                </span>
              </div>

              {expenses.some((exp) => exp.type === "invoice") && (
                <div className="bg-green-50 border-2 border-green-300 rounded-md p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">✅</span>
                    <div className="flex-1">
                      <p className="font-semibold text-green-800 mb-2">
                        Factures incluses automatiquement
                      </p>
                      <p className="text-sm text-green-700 mb-2">
                        Les factures PDF seront automatiquement ajoutées à la fin du document
                        généré.
                      </p>
                      <div className="text-sm text-green-700">
                        <strong>Factures qui seront incluses :</strong>
                        <ul className="list-disc ml-5 mt-1">
                          {expenses
                            .filter((exp) => exp.type === "invoice")
                            .map((exp) => (
                              <li key={exp.id}>{exp.fileName}</li>
                            ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleGeneratePDF}
                disabled={expenses.length === 0 || !volunteerName.trim()}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-md transition duration-200 text-lg shadow-md hover:shadow-lg"
              >
                📄 Générer le PDF du compte de dépenses
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Invoices Page */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-green-600">
              <h2 className="text-xl font-semibold text-green-800 mb-3 flex items-center gap-2">
                <span>ℹ️</span>
                Gestion des factures
              </h2>
              <p className="text-gray-700">
                Créez des factures professionnelles au nom de Sentiers Frontaliers Inc. pour vos
                clients.
              </p>
            </div>

            <InvoiceForm onAddInvoice={addInvoice} />

            {invoices.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-green-800 mb-4">Factures créées</h2>
                <InvoiceList
                  invoices={invoices}
                  onDeleteInvoice={deleteInvoice}
                  onGeneratePDF={handleGenerateInvoicePDF}
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
