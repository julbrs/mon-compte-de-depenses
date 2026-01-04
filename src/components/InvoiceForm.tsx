import { useState, FormEvent } from "react";
import type { InvoiceFormProps, InvoiceLine } from "../types/invoice";

function InvoiceForm({ onAddInvoice }: InvoiceFormProps) {
  const today = new Date();
  const defaultInvoiceNumber = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
    2,
    "0"
  )}-0001`;

  const [invoiceNumber, setInvoiceNumber] = useState(defaultInvoiceNumber);
  const [invoiceDate, setInvoiceDate] = useState(today.toISOString().split("T")[0]);
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [comments, setComments] = useState("");
  const [lines, setLines] = useState<InvoiceLine[]>([]);

  // Current line being edited
  const [currentDescription, setCurrentDescription] = useState("");
  const [currentQuantity, setCurrentQuantity] = useState("1");
  const [currentUnitPrice, setCurrentUnitPrice] = useState("");

  const handleAddLine = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!currentDescription.trim()) {
      alert("Veuillez entrer une description");
      return;
    }
    if (!currentQuantity || parseFloat(currentQuantity) <= 0) {
      alert("Veuillez entrer une quantité valide");
      return;
    }
    if (!currentUnitPrice || parseFloat(currentUnitPrice) < 0) {
      alert("Veuillez entrer un prix unitaire valide");
      return;
    }

    const newLine: InvoiceLine = {
      id: Date.now(),
      description: currentDescription,
      quantity: parseFloat(currentQuantity),
      unitPrice: parseFloat(currentUnitPrice),
    };

    setLines([...lines, newLine]);

    // Reset form
    setCurrentDescription("");
    setCurrentQuantity("1");
    setCurrentUnitPrice("");
  };

  const handleDeleteLine = (id: number) => {
    setLines(lines.filter((line) => line.id !== id));
  };

  const calculateTotal = (): number => {
    return lines.reduce((total, line) => total + line.quantity * line.unitPrice, 0);
  };

  const handleSubmitInvoice = () => {
    if (!invoiceNumber.trim()) {
      alert("Veuillez entrer un numéro de facture");
      return;
    }
    if (!invoiceDate) {
      alert("Veuillez entrer une date de facture");
      return;
    }
    if (!customerName.trim()) {
      alert("Veuillez entrer le nom du client");
      return;
    }
    if (lines.length === 0) {
      alert("Veuillez ajouter au moins une ligne à la facture");
      return;
    }

    onAddInvoice({
      invoiceNumber,
      invoiceDate,
      customerName,
      customerAddress,
      lines,
      comments,
    });

    // Reset form
    setInvoiceNumber(defaultInvoiceNumber);
    setInvoiceDate(today.toISOString().split("T")[0]);
    setCustomerName("");
    setCustomerAddress("");
    setComments("");
    setLines([]);
  };

  return (
    <div className="space-y-6">
      {/* Invoice Header Information */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Informations de la facture</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Numéro de facture
            </label>
            <input
              type="text"
              id="invoiceNumber"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="YYYY-MM-xxxx"
            />
          </div>
          <div>
            <label htmlFor="invoiceDate" className="block text-sm font-medium text-gray-700 mb-1">
              Date de facture
            </label>
            <input
              type="date"
              id="invoiceDate"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
              Client
            </label>
            <input
              type="text"
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nom du client"
            />
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="customerAddress"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Adresse du client (optionnel)
            </label>
            <textarea
              id="customerAddress"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Adresse complète du client"
            />
          </div>
        </div>
      </div>

      {/* Add Line Item Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Ajouter une ligne</h2>
        <form onSubmit={handleAddLine} className="space-y-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              id="description"
              value={currentDescription}
              onChange={(e) => setCurrentDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description de l'article"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantité
              </label>
              <input
                type="number"
                id="quantity"
                value={currentQuantity}
                onChange={(e) => setCurrentQuantity(e.target.value)}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1"
              />
            </div>
            <div>
              <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Prix unitaire ($CAD)
              </label>
              <input
                type="number"
                id="unitPrice"
                value={currentUnitPrice}
                onChange={(e) => setCurrentUnitPrice(e.target.value)}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Ajouter la ligne
          </button>
        </form>
      </div>

      {/* Lines List */}
      {lines.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Lignes de la facture</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2">Description</th>
                  <th className="text-right py-2 px-2">Quantité</th>
                  <th className="text-right py-2 px-2">Prix unitaire</th>
                  <th className="text-right py-2 px-2">Total</th>
                  <th className="text-center py-2 px-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => (
                  <tr key={line.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-2">{line.description}</td>
                    <td className="py-2 px-2 text-right">{line.quantity}</td>
                    <td className="py-2 px-2 text-right">{line.unitPrice.toFixed(2)} $</td>
                    <td className="py-2 px-2 text-right font-semibold">
                      {(line.quantity * line.unitPrice).toFixed(2)} $
                    </td>
                    <td className="py-2 px-2 text-center">
                      <button
                        onClick={() => handleDeleteLine(line.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td colSpan={3} className="py-2 px-2 text-right">
                    Total:
                  </td>
                  <td className="py-2 px-2 text-right text-lg">
                    {calculateTotal().toFixed(2)} $ CAD
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Commentaires (optionnel)</h2>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ajoutez des commentaires ou des notes supplémentaires..."
        />
      </div>

      {/* Submit Invoice Button */}
      {lines.length > 0 && (
        <button
          onClick={handleSubmitInvoice}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 font-semibold text-lg"
        >
          Créer la facture
        </button>
      )}
    </div>
  );
}

export default InvoiceForm;
