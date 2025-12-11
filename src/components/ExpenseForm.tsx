import { useState, FormEvent, ChangeEvent } from "react";
import type { ExpenseFormProps, Expense } from "../types/expense";

function ExpenseForm({ onAddExpense, onAddMultipleExpenses, kmRate }: ExpenseFormProps) {
  const [expenseType, setExpenseType] = useState<"invoice" | "km">("invoice");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [kilometers, setKilometers] = useState("");
  const [kmDate, setKmDate] = useState(new Date().toISOString().split("T")[0]);
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkImportText, setBulkImportText] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!description.trim()) {
      alert("Veuillez entrer une description");
      return;
    }

    if (expenseType === "invoice") {
      if (!amount || parseFloat(amount) <= 0) {
        alert("Veuillez entrer un montant valide");
        return;
      }
      if (!invoiceFile) {
        alert("Veuillez joindre une facture PDF");
        return;
      }

      const expense: Omit<Expense, "id"> = {
        type: "invoice",
        description,
        amount: parseFloat(amount),
        fileName: invoiceFile.name,
        file: invoiceFile,
      };
      onAddExpense(expense);
    } else {
      if (!kilometers || parseFloat(kilometers) <= 0) {
        alert("Veuillez entrer un nombre de kilomètres valide");
        return;
      }
      if (!kmDate) {
        alert("Veuillez entrer une date");
        return;
      }

      const expense: Omit<Expense, "id"> = {
        type: "km",
        description,
        kilometers: parseFloat(kilometers),
        kmDate,
      };
      onAddExpense(expense);
    }

    // Reset form
    setDescription("");
    setAmount("");
    setKilometers("");
    setKmDate(new Date().toISOString().split("T")[0]);
    setInvoiceFile(null);
    const fileInput = document.getElementById("invoiceFile") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setInvoiceFile(e.target.files[0]);
    }
  };

  const handleBulkImport = () => {
    if (!bulkImportText.trim()) {
      alert("Veuillez entrer des données à importer");
      return;
    }

    const lines = bulkImportText.trim().split("\n");
    const expenses: Omit<Expense, "id">[] = [];
    let errorCount = 0;

    lines.forEach((line, index) => {
      const parts = line.split(";");
      if (parts.length !== 3) {
        console.error(`Ligne ${index + 1} ignorée (format invalide): ${line}`);
        errorCount++;
        return;
      }

      const [desc, date, km] = parts.map((p) => p.trim());
      const kmValue = parseFloat(km);

      if (!desc || !date || isNaN(kmValue) || kmValue <= 0) {
        console.error(`Ligne ${index + 1} ignorée (données invalides): ${line}`);
        errorCount++;
        return;
      }

      expenses.push({
        type: "km",
        description: desc,
        kilometers: kmValue,
        kmDate: date,
      });
    });

    if (expenses.length > 0) {
      onAddMultipleExpenses(expenses);
      alert(
        `${expenses.length} dépense(s) importée(s) avec succès${
          errorCount > 0 ? ` (${errorCount} erreur(s))` : ""
        }`
      );
      setBulkImportText("");
      setShowBulkImport(false);
    } else {
      alert("Aucune dépense n'a pu être importée. Vérifiez le format.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8 border-t-4 border-green-500">
      <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-2">
        ➕ Ajouter une dépense
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-3">Type de dépense :</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="invoice"
                checked={expenseType === "invoice"}
                onChange={(e) => setExpenseType(e.target.value as "invoice" | "km")}
                className="w-4 h-4 text-green-600 focus:ring-green-500"
              />
              <span className="text-gray-700">📄 Facture à rembourser</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="km"
                checked={expenseType === "km"}
                onChange={(e) => setExpenseType(e.target.value as "invoice" | "km")}
                className="w-4 h-4 text-green-600 focus:ring-green-500"
              />
              <span className="text-gray-700">Kilométrage ({kmRate} $/km)</span>
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
            Description * :
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Essence pour transport de matériel"
            required
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
          />
        </div>

        {expenseType === "invoice" ? (
          <>
            <div>
              <label htmlFor="amount" className="block text-gray-700 font-medium mb-2">
                Montant ($) * :
              </label>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label htmlFor="invoiceFile" className="block text-gray-700 font-medium mb-2">
                Facture PDF * :
              </label>
              <input
                id="invoiceFile"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label htmlFor="kmDate" className="block text-gray-700 font-medium mb-2">
                📅 Date * :
              </label>
              <input
                id="kmDate"
                type="date"
                value={kmDate}
                onChange={(e) => setKmDate(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label htmlFor="kilometers" className="block text-gray-700 font-medium mb-2">
                🚶 Nombre de kilomètres * :
              </label>
              <input
                id="kilometers"
                type="number"
                step="0.1"
                min="0"
                value={kilometers}
                onChange={(e) => setKilometers(e.target.value)}
                placeholder="0.0"
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
              {kilometers && (
                <p className="mt-2 text-sm text-green-600 font-medium">
                  💰 Remboursement : {(parseFloat(kilometers) * kmRate).toFixed(2)} $
                </p>
              )}
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-md transition duration-200 shadow-md hover:shadow-lg"
        >
          ✅ Ajouter la dépense
        </button>
      </form>

      {/* Section d'import en masse - repliable et discrète */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => setShowBulkImport(!showBulkImport)}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 transition"
        >
          {showBulkImport ? "▼" : "▶"} Import en masse (admin)
        </button>

        {showBulkImport && (
          <div className="mt-4 space-y-3">
            <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
              <p className="font-semibold mb-1">Format attendu (une ligne par dépense) :</p>
              <code className="block bg-white p-2 rounded border">
                description;date;km
                <br />
                Exemple: Déplacement Lac-Mégantic;2025-12-10;45.5
              </code>
            </div>

            <textarea
              value={bulkImportText}
              onChange={(e) => setBulkImportText(e.target.value)}
              placeholder="Description;YYYY-MM-DD;km&#10;Déplacement site A;2025-12-10;25&#10;Visite chantier B;2025-12-08;32.5"
              rows={6}
              className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleBulkImport}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-md transition"
              >
                📥 Importer
              </button>
              <button
                type="button"
                onClick={() => {
                  setBulkImportText("");
                  setShowBulkImport(false);
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExpenseForm;
