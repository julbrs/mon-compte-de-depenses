import jsPDF from "jspdf";
import "jspdf-autotable";
import type { Expense } from "../types/expense";

// Extend jsPDF type to include autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: { finalY: number };
  }
}

export const generatePDF = (
  volunteerName: string,
  expenses: Expense[],
  kmRate: number,
  total: number
): void => {
  const doc = new jsPDF();

  // En-tête
  doc.setFontSize(20);
  doc.text("COMPTE DE DÉPENSES", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.text("Association de sentier pédestre", 105, 30, { align: "center" });

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
      return [
        index + 1,
        "Kilométrage",
        expense.description,
        `${expense.kilometers} km × ${kmRate} $/km`,
        `${((expense.kilometers || 0) * kmRate).toFixed(2)} $`,
      ];
    }
  });

  // Tableau des dépenses
  doc.autoTable({
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
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`TOTAL À REMBOURSER : ${total.toFixed(2)} $`, 105, finalY, {
    align: "center",
  });

  // Note de bas de page
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const noteY = finalY + 20;
  doc.text("Note : Les factures originales sont jointes à ce compte de dépenses.", 20, noteY);
  doc.text("Taux de remboursement kilométrique : " + kmRate + " $/km", 20, noteY + 5);

  // Signature
  const signatureY = Math.max(noteY + 25, 250);
  doc.text("Signature du bénévole : _________________________", 20, signatureY);
  doc.text("Date : _________________________", 20, signatureY + 7);

  // Générer le nom du fichier
  const fileName = `Compte_Depenses_${volunteerName.replace(/\s+/g, "_")}_${
    new Date().toISOString().split("T")[0]
  }.pdf`;

  // Télécharger le PDF
  doc.save(fileName);
};
