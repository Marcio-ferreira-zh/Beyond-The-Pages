---
name: testing-beyond-the-pages
description: Test Beyond The Pages end-to-end locally, including mock login, Home, Pergaminhos, and recommendation CRUD flows.
---

# Testing Beyond The Pages

Use this skill when validating UI changes in the Beyond The Pages Next.js app.

## Devin Secrets Needed

None. The app uses mock local authentication and `localStorage`; do not ask for real credentials.

## Setup

1. Install dependencies if needed:
   ```bash
   npm install
   ```
2. Start the app locally:
   ```bash
   npm run dev -- --hostname 0.0.0.0
   ```
3. Open `http://localhost:3000` in Chrome.
4. If the preview deployment is protected or returns `HTTP 401`, test locally instead.
5. If browser state might be dirty, clear `localStorage` for `localhost:3000` before recording.

## Golden-path UI test

1. On the login screen, verify the app icon appears and sign in with any non-empty email/password, such as `teste@btp.dev` / `senha123`.
2. Verify the Home tab appears with:
   - `Bem-vindo ao Beyond The Pages`
   - `Obras na biblioteca` count `5`
   - `Pergaminhos aleatórios` count `20`
   - `Recomendações feitas` count matching the current stored recommendations.
3. Open `Pergaminhos`, search for a known unique term like `Imperador`, and verify `Imperador dos Sete Eclipse` is the visible result.
4. Click the result and verify the detail view shows:
   - title and author
   - `Classificação fictícia`
   - three fictitious recommendation cards (`Lia Codex`, `Theo Margem`, `Nina Folhas`).
5. Click the header title/logo and verify it returns to Home.
6. Open `Recomendações` and validate CRUD:
   - Create a recommendation for a library item with a unique author/content.
   - Edit that recommendation and verify the old content disappears.
   - Delete it and confirm the list returns to its original state.

## Evidence

When testing through the GUI, record the browser and annotate:
- setup: local app loaded
- Home assertion
- Pergaminhos search assertion
- Pergaminho detail assertion
- header/title navigation assertion
- recommendation create/edit/delete assertions

Capture screenshots of Home, Pergaminho detail, edited recommendation, and after deletion for the test report.
