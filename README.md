# JAM Events Landing Page

A modern marketing site built with Next.js 15 and Appwrite that showcases the JAM Events brand and collects qualified leads through a rich signup flow.

---

## ✨ Highlights
- Immersive hero section with stats, storytelling, and bold gradients.
- Validated signup form backed by Appwrite—includes duplicate protection, success/error feedback, and consent tracking.
- Tailwind CSS v4 styling with responsive, accessible UI patterns.
- Strict TypeScript + ESLint setup to keep contributions reliable.
- Documentation for spinning up the Appwrite backend (`docs/appwrite-setup.md`) and for LLM contributors (`agents.md`).

---

## 🛠 Tech Stack
- **Framework**: Next.js 15 (App Router) + React 19
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4, custom utilities in `src/styles/globals.css`
- **Forms**: `react-hook-form` + `zod`
- **Backend SDK**: Appwrite JavaScript SDK (`appwrite` 18.x)
- **Linting/Formatting**: ESLint (`next/core-web-vitals`, `next/typescript`), Prettier + Tailwind plugin

---

## 📁 Project Structure
```
.
├── public/                       # Static assets (favicons, etc.)
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout, fonts, metadata, global styles
│   │   └── page.tsx              # Landing page composition
│   ├── components/
│   │   ├── Hero.tsx              # Hero section with CTAs and stats
│   │   ├── Highlights.tsx        # Value proposition card grid
│   │   ├── SignupForm.tsx        # Form UI with validation + Appwrite submission
│   │   └── Footer.tsx            # Footer with contact + socials
│   ├── lib/
│   │   └── appwrite.ts           # Appwrite client helper + submitSignup function
│   └── styles/
│       └── globals.css           # Tailwind import and custom utility classes
├── docs/
│   └── appwrite-setup.md         # Console checklist for database, attributes, indexes
├── agents.md                     # Orientation guide for LLM contributors
├── .env / .env.example           # Public Appwrite environment variables
├── tsconfig.json                 # TypeScript configuration
├── .eslintrc.json                # ESLint configuration
├── postcss.config.mjs            # Tailwind/PostCSS pipeline
├── prettier.config.js            # Prettier + Tailwind plugin config
└── package.json                  # Scripts and dependencies
```

---

## ⚙️ Prerequisites
1. **Node.js** 20.x or later (LTS recommended)
2. **npm** (bundled with Node)
3. An Appwrite project with database access (see setup below)

---

## 🚀 Getting Started
```bash
# install dependencies
npm install

# start the dev server
npm run dev

# run lint checks
npm run lint

# production build
npm run build
npm run start
```

Visit `http://localhost:3000` while `npm run dev` is running.

---

## 🔐 Environment Variables
Copy `.env.example` to `.env` and fill in values from your Appwrite project:

```
NEXT_PUBLIC_APPWRITE_ENDPOINT=
NEXT_PUBLIC_APPWRITE_PROJECT_ID=
NEXT_PUBLIC_APPWRITE_PROJECT_NAME=
NEXT_PUBLIC_APPWRITE_DATABASE_ID=
NEXT_PUBLIC_APPWRITE_COLLECTION_ID=
```

All variables are prefixed with `NEXT_PUBLIC_` because the form runs entirely on the client. Do not store private keys here—use a server action or API route if you need secrets.

---

## 🗄 Appwrite Configuration
Follow `docs/appwrite-setup.md` for a detailed walkthrough (database creation, attributes, index, permissions). High level:
1. Create a database (`jam_events`) and collection (`jam_signups` or your own IDs).
2. Add attributes for full name, email, phone, interests, notes, marketing consent, and `createdAt`.
3. Create a key index on `email` to enable duplicate checks.
4. Allow unauthenticated `create` access (or proxy through a server component if you prefer).

Once complete, submitting the form will create documents in the configured collection.

---

## 🧱 Architecture Overview
- `layout.tsx` loads Google Fonts, sets metadata, and applies global Tailwind styles.
- `page.tsx` composes the hero, highlights, signup form, and footer while rendering shared gradient backdrops.
- `Hero.tsx` presents the brand pitch and CTA buttons (scrolls to the form).
- `Highlights.tsx` showcases JAM’s value pillars with responsive hover cards.
- `SignupForm.tsx` is a client component that:
  - Validates input with `zod` and `react-hook-form`
  - Shows inline errors, loading spinner, and success/duplicate states
  - Calls `submitSignup` to write to Appwrite and guard against duplicates
- `appwrite.ts` configures the Appwrite client, defines the `SignupPayload`, and exposes typed errors for UI handling.

---

## 🎨 Design & UX Notes
- Tailwind utility classes dominate markup; custom CSS lives in `globals.css`.
- Dark theme with layered gradients, hover motion, and accessible focus styles.
- Form inputs respect minimum tap sizes, real-time validation, and micro-interactions.
- CTA buttons use consistent gradient treatments and transitions.

---

## 🧭 Project Direction
- **Content Expansion**: Add testimonials, galleries, press, or partner sections.
- **Analytics**: Hook in tracking (Segment, PostHog, GA) via client hooks or API routes.
- **Backend Automation**: Consider Next.js API routes or Appwrite Functions to sync signups with CRMs and send emails.
- **Testing**: Introduce Jest/React Testing Library for components and Playwright for end-to-end flows.
- **Design System**: Extract recurring UI patterns (cards, buttons, chips) into shared primitives as the site grows.

---

## 🤖 Contributors & Automation
- `agents.md` documents conventions and workflows for LLM agents or new contributors.
- Run `npm run lint` before opening PRs. Optionally run `npx prettier --write .` to ensure formatting.

---

## 📄 License
This project inherits the licensing found in `LICENSE` (MIT).

---

Need help or have ideas? Open an issue or drop us a line—let’s build unforgettable events together. 🌟
