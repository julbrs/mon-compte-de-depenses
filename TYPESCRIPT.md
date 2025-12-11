# Guide TypeScript

Ce projet utilise TypeScript pour une meilleure sécurité des types et une expérience de développement améliorée.

## Types principaux

### Expense

Interface principale représentant une dépense :

```typescript
interface Expense {
  id: number;
  type: "invoice" | "km";
  description: string;
  amount?: number; // Pour type 'invoice'
  kilometers?: number; // Pour type 'km'
  fileName?: string; // Nom du fichier PDF pour type 'invoice'
  file?: File; // Fichier PDF attaché pour type 'invoice'
}
```

### Props des composants

- **ExpenseFormProps** : Props du formulaire d'ajout de dépenses
- **ExpenseListProps** : Props de la liste des dépenses

## Extension des types jsPDF

Le fichier `pdfGenerator.ts` étend les types de jsPDF pour inclure la méthode `autoTable` :

```typescript
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: { finalY: number };
  }
}
```

## Vérification des types

Exécutez la vérification TypeScript :

```bash
npx tsc --noEmit
```

## IDE Support

Ce projet est optimisé pour VS Code avec les extensions suivantes :

- ESLint
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)
