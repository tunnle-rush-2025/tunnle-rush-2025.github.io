# Standard Calculator (React + Vite)

This is a precise, responsive, English-only standard calculator inspired by calculator.net’s Standard Calculator (no code/assets copied). It ships as a React + Vite + TypeScript app with a robust expression engine powered by `decimal.js-light` for correct decimal arithmetic.

- Tech stack: React + Vite + TypeScript, CSS Modules (global CSS with CSS variables), decimal.js-light
- Testing: Vitest + @testing-library/react
- Deployment: GitHub Pages via GitHub Actions

## Project layout

The calculator app lives under `calculator/` to avoid clashing with the existing static site files in the repository root.

```
calculator/
  index.html
  public/
    favicon.svg
    404.html
  src/
    App.tsx
    main.tsx
    components/
      Display.tsx
      Key.tsx
      Keypad.tsx
      HistoryPanel.tsx
    engine/
      tokenize.ts
      parse.ts
      evaluate.ts
      index.ts
    styles/
      variables.css
      globals.css
```

At the repo root:

- `vite.config.ts` sets the app root to `calculator/` and reads the base path from `PUBLIC_BASE` (defaults to '/') for GitHub Pages compatibility.
- `tsconfig.json` configures TypeScript.
- `.github/workflows/deploy.yml` builds and deploys the Vite app to GitHub Pages on push to `main`.

## Running locally

Requirements: Node.js 18+ (20+ recommended) and npm.

- Install dependencies:

```
npm ci
```

- Start dev server:

```
npm run dev
```

Then open the printed local URL (default http://localhost:5173). The app root is `calculator/` (handled by Vite config), so you will see the calculator immediately.

## Build

```
npm run build
```

Build output goes to `calculator/dist/`. You can preview with:

```
npm run preview
```

## GitHub Pages deployment

This repository is configured to deploy via GitHub Actions using the workflow at `.github/workflows/deploy.yml`.

- On every push to `main`, the workflow:
  - Sets `PUBLIC_BASE` to `/<repo-name>/` automatically
  - Builds the app
  - Publishes `calculator/dist/` to GitHub Pages

If your repository name changes or you want to deploy to a custom base path, set `PUBLIC_BASE` accordingly in the workflow or repository environment.

## Keyboard support

- Digits 0–9 and '.'
- Operators: `+`, `-`, `*`, `/`
- Parentheses `(` and `)`
- Enter/Return: `=`
- Esc: `AC/C`
- Backspace: delete last character

## Accessibility

- Semantic buttons with accessible names
- Visible focus ring
- Screen-reader-friendly display regions
- Full keyboard operability

## Tests

Run unit and integration tests:

```
npm test
```

The test suite covers:
- Engine operations (+, −, ×, ÷, %, parentheses, unary negation)
- A few end-to-end key sequences (clicks and keyboard)

## Notes

- Percent is implemented as a postfix unary operator: `x%` = `x / 100`, so expressions like `200*10%` result in `20` as expected.
- There is no dark mode, and the UI strings are English-only.
