# Boopalan M — Portfolio

Personal portfolio site for Boopalan M, SAP ABAP & BTP Consultant. Built with Next.js and designed to be easy to extend as new projects, skills, and experience come in.

**Live site:** deployed via Vercel from this repo's `main` branch.

## Features

- Content-driven sections (About, Skills, Experience, Projects, Education, Contact) sourced from a single typed data file
- Dark / light theme toggle with flash-free initial load
- Scroll-triggered reveal animations and an animated Hero entrance (Framer Motion)
- Custom WebGL "liquid ether" cursor-reactive fluid background, theme-aware and with idle ambient motion
- Hybrid glassmorphism styling on nav, buttons, and cards
- Theme-aware logo used in the navbar, footer, and favicon

## Tech Stack

- [Next.js](https://nextjs.org) (App Router) + React + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) (CSS-first `@theme` config)
- [Framer Motion](https://www.framer.com/motion/) for animation
- Custom vanilla WebGL fluid simulation (no external animation library)
- [Lucide](https://lucide.dev) icons

## Project Structure

```text
src/
  app/            # App Router pages, layout, theme init script, favicon assets
  components/     # UI components (Navbar, Hero, sections, LiquidEther background, Logo, etc.)
  data/
    resume.ts     # All content: contact info, summary, skills, experience, education, projects
    tones.ts      # Per-section color "tone" definitions
public/
  images/         # Profile photo, logo variants, static assets
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 20 or later
- npm (comes with Node.js)

### Clone and run locally

```bash
git clone https://github.com/Boopalan020/MyPortfolio.git
cd MyPortfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site. The page hot-reloads as you edit files.

### Other scripts

```bash
npm run build   # production build
npm run start   # serve the production build locally
npm run lint    # run ESLint
```

## Updating Content

Almost all text on the site (name, summary, skills, work history, education, featured projects, contact links) lives in [`src/data/resume.ts`](src/data/resume.ts). Update that file and the relevant sections will reflect the changes automatically — no need to touch individual components for content-only edits.

Section accent colors are controlled per-section via the `tone` prop, defined in [`src/data/tones.ts`](src/data/tones.ts).

## Notes for Future Scaling

- Raw/original source assets (unedited photo, CV PDF, source logo files) are intentionally excluded from the repo via `.gitignore` — only the optimized, in-use assets under `public/` are tracked.
- New sections can follow the existing pattern: a component using the shared `Section` wrapper (`src/components/Section.tsx`) and `Reveal` for scroll animation, with content pulled from `resume.ts`.
- This project uses Next.js 16, which includes breaking changes relative to older Next.js versions — check `node_modules/next/dist/docs/` for current API references before making structural changes.

## Deployment

The site auto-deploys via Vercel on every push to `main`. To deploy your own copy:

1. Push this repo to your own GitHub account.
2. Import it in [Vercel](https://vercel.com/new).
3. Vercel auto-detects Next.js — no extra configuration needed.

## License

Personal portfolio — all rights reserved.
