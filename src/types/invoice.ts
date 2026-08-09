export interface InvoiceLine {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: number;
  documentType: "invoice" | "credit-note";
  invoiceNumber: string;
  invoiceDate: string;
  referenceInvoiceNumber: string;
  customerName: string;
  customerAddress: string;
  lines: InvoiceLine[];
  comments: string;
}

export interface InvoiceFormProps {
  onAddInvoice: (invoice: Omit<Invoice, "id">) => void;
}

export interface InvoiceListProps {
  invoices: Invoice[];
  onDeleteInvoice: (id: number) => void;
  onGeneratePDF: (invoice: Invoice) => void;
}
