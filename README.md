# Subham Tiwari — Portfolio

Personal portfolio website built with React, TypeScript, Vite, and Tailwind CSS.

**Live:** [subham-tiwari-portfolio.vercel.app](https://subham-tiwari-portfolio.vercel.app/)

---

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 6** — build tooling
- **Tailwind CSS v4** — styling
- **Motion (Framer Motion)** — animations
- **Lucide React** — icons

---

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# → http://localhost:3000

# Production build
npm run build

# Preview production build
npm run preview
```

---

## Project Structure

```
my-portfolio/
├── src/
│   ├── App.tsx        # Main component — all sections and logic
│   ├── main.tsx       # React entry point
│   └── index.css      # Global styles and Tailwind theme
├── index.html         # HTML entry point
├── vite.config.ts     # Vite configuration
├── package.json
└── tsconfig.json
```

---

## Customisation

All content lives in `src/App.tsx` at the top of the file in clearly labelled constant arrays:

- **`SKILLS`** — update skill categories and items
- **`PROJECTS`** — add or edit project cards
- **`SOCIALS`** — update social links
- **`RESUME_PDF_URL`** — set path to your resume PDF (place the file in `/public/resume.pdf`)

### Adding your resume

1. Place your resume PDF at `public/resume.pdf`
2. The "Download Resume" button on the hero will open it directly

---

## Deployment

The site deploys automatically to Vercel on push to `main`. No environment variables required.

---

## About

Built and maintained by [Subham Tiwari](mailto:subhamt958@gmail.com) — DevOps & Cloud Engineer based in Dehradun, Uttarakhand.

[![GitHub](https://img.shields.io/badge/GitHub-W0nder0fy0u-black?logo=github)](https://github.com/W0nder0fy0u)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-subham--tiwari-blue?logo=linkedin)](https://www.linkedin.com/in/subham-tiwari-ab38971b4/)
