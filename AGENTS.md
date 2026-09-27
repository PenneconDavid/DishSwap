# Agent Instructions — DishSwap

## Project

- **Name:** DishSwap
- **Purpose:** Friend-first recipe-sharing platform with auth, favorites, and reactions
- **Stack:** Next.js 14, MongoDB/Mongoose, JWT, Tailwind

## Dev servers

- **Web app:** `npm run dev` → http://localhost:3000
- **Production:** https://dishswap.vercel.app

## Commands

| Task | Command |
|------|---------|
| Install | `npm install` |
| Dev server | `npm run dev` → http://localhost:3000 |
| Typecheck | `npx tsc --noEmit` |
| Lint | `npm run lint` |
| Build | `npm run build` |

There is no test runner. Ask before adding one, per the shared dependency rule.

## Definition of done

- Typecheck, lint, and build pass.
- `visual-qa-testing` on the changed page, console clean.
- `ConnectionGuide.txt` updated if any API route or MongoDB connection detail changed.

## Shared config

- **Skills:** `.agents/skills/` → [cursor-skills](https://github.com/PenneconDavid/cursor-skills)
- **Rules:** `.cursor/rules/` → [cursor-rules](https://github.com/PenneconDavid/cursor-rules)
- **Connections:** maintain `ConnectionGuide.txt` at repo root (create when adding endpoints)

## Conventions

- Update `ConnectionGuide.txt` for API routes and MongoDB-related connection info (no secrets).
- Tier 2 UI skills apply (Next.js + Tailwind).
- Ask before installing npm packages.
