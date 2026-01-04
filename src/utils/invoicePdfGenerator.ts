import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { Invoice } from "../types/invoice";

const formatLocalDate = (value: string): string => {
  const [year, month, day] = value.split("-").map(Number);
  const localDate = new Date(year, (month || 1) - 1, day || 1);
  return localDate.toLocaleDateString("fr-CA");
};

export const generateInvoicePDF = async (invoice: Invoice): Promise<void> => {
  const doc = new jsPDF();

  // En-tête avec logo/nom de l'entreprise
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Sentiers Frontaliers Inc.", 105, 20, { align: "center" });

  // Adresse de l'entreprise
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Case postale 23", 105, 27, { align: "center" });
  doc.text("Lac-Mégantic, QC G6B 2S5", 105, 32, { align: "center" });

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("FACTURE", 105, 42, { align: "center" });

  // Informations de la facture
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Facture #:", 20, 55);
  doc.setFont("helvetica", "normal");
  doc.text(invoice.invoiceNumber, 50, 55);

  doc.setFont("helvetica", "bold");
  doc.text("Date:", 20, 62);
  doc.setFont("helvetica", "normal");
  doc.text(formatLocalDate(invoice.invoiceDate), 50, 62);

  // Informations du client
  doc.setFont("helvetica", "bold");
  doc.text("Facturé à:", 20, 75);
  doc.setFont("helvetica", "normal");
  doc.text(invoice.customerName, 20, 82);

  let currentY = 87;
  if (invoice.customerAddress && invoice.customerAddress.trim()) {
    const addressLines = doc.splitTextToSize(invoice.customerAddress, 80);
    doc.text(addressLines, 20, currentY);
    currentY += addressLines.length * 5;
  }

  // Préparer les données pour le tableau
  const tableData = invoice.lines.map((line, index) => [
    index + 1,
    line.description,
    line.quantity.toString(),
    `${line.unitPrice.toFixed(2)} $`,
    `${(line.quantity * line.unitPrice).toFixed(2)} $`,
  ]);

  // Calculer le total
  const total = invoice.lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);

  // Tableau des lignes de facture
  const startY = currentY + 10;
  autoTable(doc, {
    startY: startY,
    head: [["#", "Description", "Quantité", "Prix unitaire", "Total"]],
    body: tableData,
    theme: "grid",
    styles: { fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 80 },
      2: { cellWidth: 25, halign: "center" },
      3: { cellWidth: 35, halign: "right" },
      4: { cellWidth: 35, halign: "right" },
    },
    foot: [
      [
        {
          content: "TOTAL",
          colSpan: 4,
          styles: { halign: "right", fontStyle: "bold", fontSize: 11 },
        },
        {
          content: `${total.toFixed(2)} $ CAD`,
          styles: { halign: "right", fontStyle: "bold", fontSize: 11, fillColor: [240, 240, 240] },
        },
      ],
    ],
    footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
  });

  // Commentaires (si présents)
  currentY = (doc as any).lastAutoTable.finalY + 15;
  if (invoice.comments && invoice.comments.trim()) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Commentaires:", 20, currentY);
    doc.setFont("helvetica", "normal");
    const commentLines = doc.splitTextToSize(invoice.comments, 170);
    doc.text(commentLines, 20, currentY + 6);
    currentY += 6 + commentLines.length * 5 + 10;
  }

  // Note de bas de page
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100, 100, 100);
  doc.text("Merci de votre confiance!", 105, pageHeight - 20, { align: "center" });
  doc.text("Sentiers Frontaliers Inc.", 105, pageHeight - 15, { align: "center" });

  // Télécharger le PDF
  const fileName = `Facture_${invoice.invoiceNumber.replace(
    /\//g,
    "-"
  )}_${invoice.customerName.replace(/\s+/g, "_")}.pdf`;
  doc.save(fileName);
};
