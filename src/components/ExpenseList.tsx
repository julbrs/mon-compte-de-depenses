import type { ExpenseListProps } from "../types/expense";

function ExpenseList({ expenses, onDeleteExpense, kmRate }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8 border-t-4 border-green-500">
        <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-2">
          📋 Liste des dépenses
        </h2>
        <p className="text-center text-gray-500 italic py-8">
          🌿 Aucune dépense ajoutée pour le moment
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8 border-t-4 border-green-500">
      <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-2">
        📋 Liste des dépenses
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-50 border-b-2 border-green-200">
              <th className="text-left py-4 px-4 font-semibold text-gray-700">Type</th>
              <th className="text-left py-4 px-4 font-semibold text-gray-700">Description</th>
              <th className="text-left py-4 px-4 font-semibold text-gray-700">Détails</th>
              <th className="text-left py-4 px-4 font-semibold text-gray-700">Montant</th>
              <th className="text-left py-4 px-4 font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr
                key={expense.id}
                className="border-b border-gray-200 hover:bg-green-50 transition"
              >
                <td className="py-4 px-4">
                  {expense.type === "invoice" ? (
                    <span className="inline-flex items-center gap-1">
                      <span>📄</span>
                      <span className="hidden sm:inline">Facture</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      <span>🚶</span>
                      <span className="hidden sm:inline">Kilométrage</span>
                    </span>
                  )}
                </td>
                <td className="py-4 px-4 text-gray-700">{expense.description}</td>
                <td className="py-4 px-4 text-gray-600 text-sm">
                  {expense.type === "invoice" ? (
                    <span className="truncate max-w-xs block">{expense.fileName}</span>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <span>📅 {new Date(expense.kmDate || "").toLocaleDateString("fr-CA")}</span>
                      <span>
                        {expense.kilometers} km × {kmRate} $/km
                      </span>
                    </div>
                  )}
                </td>
                <td className="py-4 px-4 font-semibold text-green-700">
                  {expense.type === "invoice"
                    ? expense.amount?.toFixed(2)
                    : ((expense.kilometers || 0) * kmRate).toFixed(2)}{" "}
                  $
                </td>
                <td className="py-4 px-4">
                  <button
                    onClick={() => onDeleteExpense(expense.id)}
                    className="text-red-600 hover:text-red-800 hover:scale-110 transition transform"
                    title="Supprimer"
                  >
                    ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExpenseList;
