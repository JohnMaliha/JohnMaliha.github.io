# johnmaliha.github.io

Personal portfolio / CV for John Maliha — [Astro](https://astro.build) for the
static shell, React islands only where the page is actually interactive.

## Stack

- **Astro** for static HTML — the Hero, Experience, Projects, Skills, and
  Education sections ship zero JavaScript.
- **React**, hydrated only for the three interactive pieces
  (`client:visible`): the code stepper, the pathfinding visualizer, and Snake.
- **TypeScript** throughout, hand-written CSS with custom properties (no CSS
  framework).
- All CV content lives in [src/data/cv.ts](src/data/cv.ts), separate from
  markup — edit that file to update anything about the résumé itself.

## Run locally

```bash
npm install
npm run dev
```

Then open the printed `localhost` URL. `npm run build` type-checks
(`astro check`) and builds the static site to `dist/`; `npm run preview`
serves that build locally.

## Swap in your résumé

Replace [public/resume.pdf](public/resume.pdf) with the real PDF — same
filename, same path. It's linked from the hero automatically.

## Deploy (GitHub Pages)

This repo is set up as a GitHub **user site**
(`JohnMaliha/johnmaliha.github.io`), so `astro.config.mjs` sets
`site: "https://johnmaliha.github.io"` and `base: "/"`.

Pushing to `main` triggers [.github/workflows/deploy.yml](.github/workflows/deploy.yml),
which builds the site and publishes `dist/` to GitHub Pages. The only
one-time setup needed on GitHub: **Settings → Pages → Source → GitHub
Actions**.

## Project structure

```
src/
  data/cv.ts              # all CV content (experience, projects, skills, education)
  styles/tokens.css       # design tokens: colors, type scale, spacing
  styles/global.css       # base styles, reset, reduced-motion handling
  layouts/BaseLayout.astro
  components/
    Hero.astro / Section.astro / Entry.astro / Skills.astro / Footer.astro
    islands/
      CodeExplained.tsx   # annotated code stepper (C++/Python/TypeScript)
      Pathfinding.tsx      # A*/Dijkstra grid visualizer
      Snake.tsx            # playable Snake
  pages/index.astro
```
