# Repository Guide

## Commands

- Use pnpm (the lockfile is `pnpm-lock.yaml`): `pnpm install`, `pnpm run dev`, `pnpm run build`, and `pnpm run lint`.
- There is no test suite or `typecheck` script. Run `pnpm exec tsc --noEmit` separately; Vite builds do not replace strict TypeScript checking.
- ESLint is configured only for `*.js` and `*.jsx`, so it does not lint the TypeScript/TSX app source.

## Application Boundaries

- `src/main.tsx` mounts the single `App.tsx`; `App.tsx` owns all in-memory expense and invoice state and switches between the two views.
- Expense and invoice data contracts live in `src/types/expense.ts` and `src/types/invoice.ts`. Keep form components, list components, and PDF generators aligned with these types.
- `src/utils/pdfGenerator.ts` creates the expense report and appends attached invoice PDF pages with `pdf-lib`; attachments are browser `File` objects and are not persisted. `src/utils/invoicePdfGenerator.ts` generates customer invoices.
- Kilometer reimbursement is currently fixed at `0.40` in `App.tsx`; change that source of truth rather than duplicating the rate.

## Frontend And Deployment

- Tailwind is v4 and is loaded only through `@import "tailwindcss";` in `src/index.css`; use v4 utilities such as `bg-linear-to-br`, not the v3 gradient name.
- Vite `base` is `/mon-compte-de-depenses/`; retain or deliberately update it with the GitHub repository Pages path.
- Pushing `main` deploys `dist/` through `.github/workflows/deploy.yml` using Node 20 and pnpm 9. `pnpm run deploy` instead publishes `dist/` to the legacy `gh-pages` branch.
