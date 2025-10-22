## Event Site – LLM Agent Guide

Welcome to `event-site`. This document captures the project’s structure, conventions, and near-term direction so autonomous or human-in-the-loop agents can navigate quickly, plan confidently, and ship safely.

---

### 1. Mission Snapshot
- **Product**: High-conversion landing page for JAM Events, focused on collecting qualified leads.
- **Framework**: Next.js 15 (App Router) with React 19 and TypeScript.
- **Styling**: Tailwind CSS v4 via `@tailwindcss/postcss`, plus a light layer of custom utilities (`src/styles/globals.css`).
- **Form & Validation**: `react-hook-form` wired to `zod` schemas for real-time feedback and error handling.
- **Data Layer**: Appwrite JS SDK (`appwrite` 18.x) performs client-side document writes with duplicate detection.
- **Tooling**: TypeScript 5.6, ESLint (`next/core-web-vitals`, `next/typescript`), Prettier + Tailwind plugin, path alias `@/* → ./src/*`.

Primary goal: deliver an immersive marketing experience that routes signup data into an Appwrite database while remaining easy to extend with future sections, analytics, and backend automation.

---

### 2. Repository Map
```
.
├── public/                       # Static assets (favicon etc.)
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout, fonts, metadata, global styling
│   │   └── page.tsx              # Landing page composition (Hero → Highlights → Form → Footer)
│   ├── components/
│   │   ├── Footer.tsx            # Footer content and social links
│   │   ├── Hero.tsx              # Headline, stats, CTA buttons
│   │   ├── Highlights.tsx        # Value proposition cards
│   │   └── SignupForm.tsx        # Form UI, validation, and submission UX
│   ├── lib/
│   │   └── appwrite.ts           # Appwrite client, submitSignup helper, typed errors
│   └── styles/
│       └── globals.css           # Tailwind import and bespoke utility classes
├── docs/
│   └── appwrite-setup.md         # Console checklist: database, attributes, indexes, permissions
├── .env / .env.example           # Public Appwrite environment variables
├── .eslintrc.json                # Next.js lint configuration
├── next-env.d.ts                 # Generated Next.js TS types
├── next.config.mjs               # Placeholder (currently empty)
├── package.json / package-lock.json
├── postcss.config.mjs            # Tailwind/PostCSS pipeline
├── prettier.config.js            # Prettier + Tailwind plugin config
├── tsconfig.json                 # TypeScript compiler options (strict)
└── README.md                     # Human-facing project overview
```

---

### 3. Environment & Credentials
The UI executes fully on the client, so all required Appwrite identifiers are public (prefixed with `NEXT_PUBLIC_`). Ensure both `.env` and `.env.example` include:
- `NEXT_PUBLIC_APPWRITE_ENDPOINT`
- `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
- `NEXT_PUBLIC_APPWRITE_PROJECT_NAME`
- `NEXT_PUBLIC_APPWRITE_DATABASE_ID`
- `NEXT_PUBLIC_APPWRITE_COLLECTION_ID`

Permissions: the target collection must allow unauthenticated `create` operations (or the session you supply). Refer to `docs/appwrite-setup.md` for the exact attribute schema and required email index that powers duplicate prevention. If future work brings secrets or privileged mutations, migrate submission logic into a server action, API route, or Appwrite Function.

---

### 4. Commands & Quality Gates
- `npm install` – install dependencies.
- `npm run dev` – start dev server (http://localhost:3000).
- `npm run build` – production build.
- `npm run start` – serve built output.
- `npm run lint` – Next.js ESLint rules (must stay clean before shipping).
- `npx prettier --write .` – optional formatting sweep (Tailwind-aware).

No automated tests are configured yet; introduce Jest/Playwright if you add non-trivial logic.

---

### 5. Runtime Architecture
1. **Root Layout (`src/app/layout.tsx`)**
   - Loads Inter and Poppins via `next/font`, applies metadata, imports global styles, and sets dark theme background.

2. **Landing Page (`src/app/page.tsx`)**
   - Renders shared gradient layers and composes the hero, highlights, signup form, and footer sections.

3. **Hero (`src/components/Hero.tsx`)**
   - Marketing copy, CTA buttons linking to the signup form/section, stats, and a teaser card for upcoming events.

4. **Highlights (`src/components/Highlights.tsx`)**
   - Three-card grid explaining strategy, experience design, and community focus.

5. **Signup Form (`src/components/SignupForm.tsx`)**
   - Marked `"use client"`; handles local state, validation, loading states, success/error banners, and interest chip toggles.
   - Validation uses `zod` schema to enforce required fields, phone format, consent opt-in, and note length.
   - Submits via `submitSignup`, which:
     1. Verifies environment variables.
     2. Normalizes email and checks for duplicates (`Query.equal`).
     3. Creates a document with `ID.unique()` and a timestamp.
   - Surfaces custom errors (`DuplicateSignupError`, `AppwriteEnvironmentError`) to inform the user.

6. **Footer (`src/components/Footer.tsx`)**
   - JAM brand tagline, contact email, placeholder social links, and copyright.

7. **Appwrite Helper (`src/lib/appwrite.ts`)**
   - Exports configured `client`, `account`, and `databases` for future reuse.
   - Houses typed payload definitions and error classes to standardize handling.

---

### 6. Styling & UX Notes
- Tailwind utilities dominate markup; bespoke utility classes live in `globals.css` (gradient helpers, focus rings).
- Dark theme with layered gradients and subtle transitions; maintain accessible color contrast.
- Buttons and chips provide `focus-visible` outlines and adequate interaction targets.
- Form fields surface inline errors, loading spinners, and success messaging for a polished UX.

---

### 7. Working Guidelines for Agents
1. **Recon** – Scan `page.tsx`, component files, and `lib/appwrite.ts` before modifying flows.
2. **Schema Synchronization** – When adding/removing form fields, update:
   - `zod` schema + default values in `SignupForm.tsx`
   - `SignupPayload` in `src/lib/appwrite.ts`
   - Appwrite collection attributes/indexes
   - `.env.example` and `docs/appwrite-setup.md`
3. **Environment Discipline** – Only expose public identifiers in the client; move secrets server-side.
4. **Quality** – Run `npm run lint`; add tests if logic grows complex.
5. **Formatting** – Let Prettier manage Tailwind class order; avoid manual shuffling.
6. **Docs** – Update this guide and the README whenever architecture or workflows change.

---

### 8. Roadmap & Extension Ideas
- Content: add testimonials, partner carousels, photo galleries, or schedule teasers as new components.
- Analytics: integrate metrics hooks (Segment, PostHog, etc.) via API routes or client-side modules.
- Backend: shift signup logic into a Next.js API route or Appwrite Function for CRM syncs or secure automations.
- Design System: refactor repeated patterns (cards, buttons, chips) into reusable primitives.
- Testing: bootstrap Jest/RTL for component logic and Playwright for end-to-end coverage.

---

### 9. Known Work Items
- `README.md` has been rewritten but should remain in sync with future changes.
- No automated test harness is present; plan to add one as complexity grows.
- `next.config.mjs` is empty; populate when remote images, headers, or experimental flags are required.

---

### 10. Quick Reference
- Hero: `src/components/Hero.tsx`
- Highlights: `src/components/Highlights.tsx`
- Signup Form: `src/components/SignupForm.tsx`
- Appwrite logic: `src/lib/appwrite.ts`
- Appwrite console walkthrough: `docs/appwrite-setup.md`
- Global styles: `src/styles/globals.css`
- Lint/format: `npm run lint`, `npx prettier --write .`

Keep this guide current to ensure every agent—human or otherwise—can orient fast and deliver quality updates without surprises.
