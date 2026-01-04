import type { InvoiceListProps } from "../types/invoice";

function InvoiceList({ invoices, onDeleteInvoice, onGeneratePDF }: InvoiceListProps) {
  if (invoices.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
        Aucune facture créée pour le moment
      </div>
    );
  }

  const calculateInvoiceTotal = (invoice: (typeof invoices)[0]): number => {
    return invoice.lines.reduce((total, line) => total + line.quantity * line.unitPrice, 0);
  };

  return (
    <div className="space-y-4">
      {invoices.map((invoice) => (
        <div key={invoice.id} className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">Facture #{invoice.invoiceNumber}</h3>
              <p className="text-gray-600">
                Date: {new Date(invoice.invoiceDate).toLocaleDateString("fr-CA")}
              </p>
              <p className="text-gray-600">Client: {invoice.customerName}</p>
              {invoice.customerAddress && (
                <p className="text-sm text-gray-500 whitespace-pre-line">
                  {invoice.customerAddress}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">
                {calculateInvoiceTotal(invoice).toFixed(2)} $ CAD
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Lignes:</h4>
            <div className="space-y-2">
              {invoice.lines.map((line) => (
                <div key={line.id} className="flex justify-between text-sm">
                  <span className="flex-1">{line.description}</span>
                  <span className="mx-4 text-gray-600">
                    {line.quantity} x {line.unitPrice.toFixed(2)} $
                  </span>
                  <span className="font-semibold">
                    {(line.quantity * line.unitPrice).toFixed(2)} $
                  </span>
                </div>
              ))}
            </div>
          </div>

          {invoice.comments && (
            <div className="border-t pt-4 mt-4">
              <h4 className="font-semibold mb-2">Commentaires:</h4>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{invoice.comments}</p>
            </div>
          )}

          <div className="flex gap-2 mt-4 pt-4 border-t">
            <button
              onClick={() => onGeneratePDF(invoice)}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Télécharger PDF
            </button>
            <button
              onClick={() => {
                if (confirm("Êtes-vous sûr de vouloir supprimer cette facture ?")) {
                  onDeleteInvoice(invoice.id);
                }
              }}
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Supprimer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default InvoiceList;
