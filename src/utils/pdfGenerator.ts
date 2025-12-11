import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { PDFDocument } from "pdf-lib";
import type { Expense } from "../types/expense";

export const generatePDF = async (
  volunteerName: string,
  expenses: Expense[],
  kmRate: number,
  total: number,
  additionalInfo?: string
): Promise<void> => {
  const doc = new jsPDF();

  // En-tête
  doc.setFontSize(20);
  doc.text("COMPTE DE DÉPENSES", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.text("Pour: Sentiers Frontaliers", 105, 30, { align: "center" });

  // Informations du bénévole
  doc.setFontSize(11);
  doc.text(`Bénévole : ${volunteerName}`, 20, 45);
  doc.text(`Date : ${new Date().toLocaleDateString("fr-CA")}`, 20, 52);

  // Préparer les données pour le tableau
  const tableData = expenses.map((expense, index) => {
    if (expense.type === "invoice") {
      return [
        index + 1,
        "Facture",
        expense.description,
        expense.fileName || "",
        `${expense.amount?.toFixed(2)} $`,
      ];
    } else {
      const formattedDate = expense.kmDate
        ? new Date(expense.kmDate).toLocaleDateString("fr-CA")
        : "";
      return [
        index + 1,
        "Kilométrage",
        expense.description,
        `Date: ${formattedDate}\n${expense.kilometers} km × ${kmRate} $/km`,
        `${((expense.kilometers || 0) * kmRate).toFixed(2)} $`,
      ];
    }
  });

  // Tableau des dépenses
  autoTable(doc, {
    startY: 60,
    head: [["#", "Type", "Description", "Détails", "Montant"]],
    body: tableData,
    theme: "grid",
    styles: { fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 30 },
      2: { cellWidth: 60 },
      3: { cellWidth: 50 },
      4: { cellWidth: 30, halign: "right" },
    },
  });

  // Total
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`TOTAL À REMBOURSER : ${total.toFixed(2)} $`, 105, finalY, {
    align: "center",
  });

  // Informations complémentaires (si présentes)
  let currentY = finalY + 15;
  if (additionalInfo && additionalInfo.trim()) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Informations complémentaires :", 20, currentY);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(additionalInfo, 170);
    doc.text(lines, 20, currentY + 6);
    currentY += 6 + lines.length * 5 + 5;
  }

  // Note de bas de page
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Taux de remboursement kilométrique : " + kmRate + " $/km", 20, currentY);

  const invoiceExpenses = expenses.filter((e) => e.type === "invoice");
  if (invoiceExpenses.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.text("Les factures suivantes sont jointes à ce document :", 20, currentY + 6);
    doc.setFont("helvetica", "normal");
    invoiceExpenses.forEach((expense, index) => {
      doc.text(`- ${expense.fileName}`, 25, currentY + 12 + index * 5);
    });
  }

  // Convertir le PDF principal en bytes
  const mainPdfBytes = doc.output("arraybuffer");

  // Créer le document PDF final avec pdf-lib
  const finalPdfDoc = await PDFDocument.load(mainPdfBytes);

  // Ajouter les factures PDF
  for (const expense of invoiceExpenses) {
    if (expense.file) {
      try {
        const fileArrayBuffer = await expense.file.arrayBuffer();
        const invoicePdf = await PDFDocument.load(fileArrayBuffer);
        const copiedPages = await finalPdfDoc.copyPages(invoicePdf, invoicePdf.getPageIndices());
        copiedPages.forEach((page) => finalPdfDoc.addPage(page));
      } catch (error) {
        console.error(`Erreur lors de l'ajout de ${expense.fileName}:`, error);
      }
    }
  }

  // Générer le PDF final
  const finalPdfBytes = await finalPdfDoc.save();

  // Télécharger le PDF
  const fileName = `Compte_Depenses_${volunteerName.replace(/\s+/g, "_")}_${
    new Date().toISOString().split("T")[0]
  }.pdf`;

  const blob = new Blob([finalPdfBytes as BlobPart], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};
