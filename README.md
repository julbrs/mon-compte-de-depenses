# Compte de Dépenses

Application web pour la gestion des comptes de dépenses des bénévoles.

## 📋 Fonctionnalités

- ✅ Ajout de dépenses avec factures PDF jointes
- ✅ Ajout de dépenses kilométriques (0,25 $/km)
- ✅ Description obligatoire pour chaque dépense
- ✅ Calcul automatique du total à rembourser
- ✅ Génération d'un PDF professionnel du compte de dépenses
- ✅ Interface responsive (mobile et desktop)
- ✅ Déployable sur GitHub Pages

## 🚀 Démarrage rapide

### Installation

```bash
pnpm install
```

### Développement

```bash
pnpm run dev
```

L'application sera accessible à l'adresse : `http://localhost:5173/mon-compte-de-depenses/`

### Build de production

```bash
pnpm run build
```

### Déploiement sur GitHub Pages

1. Assurez-vous que votre dépôt GitHub est configuré
2. Exécutez la commande de déploiement :

```bash
pnpm run deploy
```

3. Activez GitHub Pages dans les paramètres de votre dépôt (branch: `gh-pages`)

## 📖 Guide d'utilisation

### Pour les bénévoles

1. **Entrez votre nom** dans le champ prévu à cet effet
2. **Ajoutez vos dépenses** :
   - **Pour une facture** : Sélectionnez "Facture à rembourser", ajoutez une description, le montant et joignez le PDF de la facture
   - **Pour du kilométrage** : Sélectionnez "Kilométrage", ajoutez une description et le nombre de kilomètres parcourus
3. **Vérifiez la liste** de vos dépenses (vous pouvez supprimer une dépense en cliquant sur ❌)
4. **Générez le PDF** en cliquant sur le bouton vert en bas de page
5. **Envoyez le PDF** généré à votre trésorier

### Configuration du taux kilométrique

Le taux kilométrique est actuellement fixé à **0,25 $/km**. Pour le modifier, éditez le fichier `src/App.tsx` à la ligne :

```typescript
const [kmRate] = useState(0.25);
```

## 🛠️ Technologies utilisées

- **React 19** - Framework JavaScript
- **TypeScript** - Typage statique pour plus de sécurité
- **Vite** - Build tool et dev server ultra-rapide
- **Tailwind CSS v4** - Framework CSS utilitaire moderne
- **jsPDF** - Génération de PDF
- **jsPDF-autotable** - Tableaux dans les PDF

## 📁 Structure du projet

```
mon-compte-de-depenses/
├── src/
│   ├── components/
│   │   ├── ExpenseForm.tsx    # Formulaire d'ajout de dépenses
│   │   └── ExpenseList.tsx    # Liste et affichage des dépenses
│   ├── types/
│   │   └── expense.ts         # Définitions TypeScript
│   ├── utils/
│   │   └── pdfGenerator.ts    # Logique de génération PDF
│   ├── App.tsx                # Composant principal
│   ├── index.css              # Imports Tailwind CSS
│   └── main.tsx               # Point d'entrée
├── public/                    # Fichiers statiques
├── index.html                 # Template HTML
├── postcss.config.js          # Configuration PostCSS
├── tsconfig.json              # Configuration TypeScript
├── vite.config.js             # Configuration Vite
└── package.json               # Dépendances et scripts
```

## 🎨 Personnalisation

### Couleurs

Les couleurs sont gérées par Tailwind CSS. Pour personnaliser les couleurs principales, vous pouvez créer un fichier de configuration Tailwind ou utiliser directement les classes utilitaires dans les composants.

Gradient de fond actuel dans `src/App.tsx` :

```typescript
className = "min-h-screen bg-linear-to-br from-indigo-500 to-purple-600";
```

### En-tête du PDF

Le contenu de l'en-tête du PDF peut être personnalisé dans `src/utils/pdfGenerator.ts`.

## 📝 Format du PDF généré

Le PDF généré contient :

- En-tête avec le titre "COMPTE DE DÉPENSES"
- Nom du bénévole et date
- Tableau détaillé de toutes les dépenses
- Total à rembourser en évidence
- Notes sur les pièces jointes et le taux kilométrique
- Espace pour signature

## 🤝 Contribution

N'hésitez pas à créer des issues ou des pull requests pour améliorer l'application.

## 📄 Licence

Ce projet est libre d'utilisation pour les associations à but non lucratif.

## 💡 Support

Pour toute question ou problème, veuillez ouvrir une issue sur GitHub.
