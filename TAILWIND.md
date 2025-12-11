# Tailwind CSS v4 - Guide de référence

Ce projet utilise Tailwind CSS v4 avec la nouvelle syntaxe `@import`.

## Configuration

Le fichier `src/index.css` importe simplement Tailwind :

```css
@import "tailwindcss";
```

## Différences avec v3

### Gradients

- **v3** : `bg-gradient-to-br`
- **v4** : `bg-linear-to-br`

## Classes principales utilisées

### Layout

- `min-h-screen` : hauteur minimale 100vh
- `max-w-7xl` : largeur maximale conteneur
- `mx-auto` : centrage horizontal
- `px-4 sm:px-6 lg:px-8` : padding responsive

### Flexbox

- `flex` : display flex
- `flex-col` : direction colonne
- `gap-4` : espacement entre items
- `justify-between` : répartition espace
- `items-center` : alignement centré

### Colors

- `bg-white` : fond blanc
- `text-gray-700` : texte gris
- `text-indigo-600` : texte indigo
- `bg-green-600` : fond vert
- `hover:bg-green-700` : fond vert au survol

### Typography

- `text-3xl` : taille texte grande
- `font-bold` : gras
- `font-semibold` : semi-gras

### Spacing

- `p-6` : padding 1.5rem
- `mb-8` : margin-bottom 2rem
- `py-4` : padding vertical 1rem

### Effects

- `rounded-lg` : bordures arrondies
- `shadow-lg` : ombre portée
- `hover:` : état survol
- `transition` : animation douce

### Forms

- `border-2` : bordure épaisse
- `focus:ring-2` : anneau au focus
- `focus:outline-none` : pas d'outline

### Responsive

- `sm:` : > 640px
- `md:` : > 768px
- `lg:` : > 1024px

## Documentation officielle

https://tailwindcss.com/docs
