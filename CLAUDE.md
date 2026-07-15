@AGENTS.md

# Portfolio site (Boopalan M)

Single-page personal portfolio. Next.js 16 (App Router, Turbopack) + React 19 + Tailwind v4 + Framer Motion. Deployed on Vercel (`origin` = `github.com/Boopalan020/MyPortfolio`); pushes to `main` auto-redeploy.

## Structure

- `src/app/page.tsx` composes the page as an ordered list of section components: Navbar, Hero, About, Skills, Experience, Projects, Education, Certifications, Testimonials, Contact, Footer.
- `src/components/*.tsx` — one component per section. These are generic renderers over data, not hardcoded content.
- `src/data/resume.ts` — **all resume/content data** (typed exports: `contact`, `summary`, `skills`, `experience`, `education`, `featuredProjects`, `certifications`, `testimonials`). To change what's displayed (add a job, project, cert, skill, testimonial), edit this file, not the components.

## Adding a certification

Append an entry to the `certifications` array in `src/data/resume.ts` (`Certification` interface: `name`, `issuer`, `issueDate`, `expiryDate?`, `credentialId?`, `description`, `skills[]`, `badgeImage`, `credentialUrl`). `Certifications.tsx` and the `.cert-flip-*` classes in `globals.css` are fully generic — no component/CSS changes are needed for a new entry.

To extract badge details (issue date, expiry, credential ID, skills) from a Credly public badge link, see the `credly-badge-extraction` memory — Credly badge pages are JS-rendered SPAs, so use the public OBI JSON API rather than fetching the page HTML.

## Adding a testimonial

Append an entry to the `testimonials` array in `src/data/resume.ts` (`Testimonial` interface: `quote`, `name`, `title`, `company` — deliberately minimal, no photo/avatar image or LinkedIn link field). `Testimonials.tsx` is a generic single-card carousel (teal tone, prev/next + dot controls, auto-advance paused on hover/focus) — no component/CSS changes needed for a new entry.

To source recommendation text from LinkedIn, see the `linkedin-recommendation-extraction` memory — use `claude-in-chrome` on `linkedin.com/in/{handle}/details/recommendations/` rather than trying an unauthenticated fetch.

## Working from a mobile / remote session

When changes originate from a Claude Code on the web session (not an interactive local session where the user is present to say "push it"), always create a feature branch and open a pull request rather than pushing directly to `main`. This gives a Vercel Preview Deployment to review before the change reaches the live site. Merge to `main` — and the resulting production deploy — should only happen after explicit user approval of the preview.

## Verifying changes

- `npx tsc --noEmit` and `npm run lint` before considering a change done.
- Pre-existing, expected lint warning: `@next/next/no-img-element` on the certification card's `<img>` — not a regression, safe to ignore.
- `npm run dev` runs Turbopack dev server on `localhost:3000`.
