# Portfolio Website

Personal portfolio website for **Jhon Emmanuele S. Alcanices** — BS Information
Technology student specializing in Web and Mobile Application Development.

Built with **React 18 + Vite**. No CSS framework, no UI library — just plain
CSS so every line is easy to read and change.

---

## How to run it

You need [Node.js](https://nodejs.org) version 18 or newer.

```bash
npm install     # install the packages (only needed once)
npm run dev     # start the site at http://localhost:5173
```

Other useful commands:

```bash
npm run build   # make the final production site in the "dist" folder
npm run preview # preview the built site locally
```

To publish it free, upload the **dist** folder to
[Netlify Drop](https://app.netlify.com/drop), Vercel, or GitHub Pages.

---

## Where to change things

Almost all the content lives in **one file**:

```
src/data/resume.js
```

That single file holds your name, contact details, objective, skills, projects,
education, and certifications. Edit it and the whole site updates.

### Adding a new project

Add another object to the `projects` array in `src/data/resume.js`:

```js
{
  id: 'my-project',                 // unique, used as a key
  title: 'My Project',
  subtitle: 'Short description',
  icon: 'MP',                       // 2-3 letters shown in the square
  year: '2026',
  stack: ['HTML', 'CSS', 'JavaScript'],  // becomes the filter buttons too
  short: 'One sentence for the card.',
  description: ['First paragraph.', 'Second paragraph.'],
  features: ['Feature one', 'Feature two'],
  gains: [{ value: 85, label: 'faster something' }],
}
```

The new project appears in the grid and gets its own filter button and popup
automatically.

### Your GitHub and LinkedIn links

1. Copy `.env.example` and rename it to `.env`
2. Put your real links inside

```
VITE_GITHUB_URL=https://github.com/yourusername
VITE_LINKEDIN_URL=https://www.linkedin.com/in/yourusername
```

Restart `npm run dev` after editing `.env`.

---

## Colors and theme

The whole color scheme lives at the top of `src/styles.css`:

```css
:root {
  --cyan: #22d3ee;
  --violet: #a78bfa;
  --pink: #f472b6;
  --green: #34d399;
}
```

Change those four values and every gradient, glow, and bar on the site
updates. Light mode colors are in the `body.light` block right below them.

---

## What makes it interactive

| Feature | Where it lives |
| --- | --- |
| Typing text animation | `components/TypingText.jsx` |
| Numbers that count up | `components/CountUp.jsx` |
| Fade-in on scroll | `components/Reveal.jsx` |
| Cards that tilt with the mouse | `components/TiltCard.jsx` |
| Project popup window | `components/Modal.jsx` |
| Navbar that highlights your position | `App.jsx` (scroll listener) |
| Reading progress bar | `App.jsx` + `.progress` in CSS |
| Dark / light mode | `components/Navbar.jsx` + `body.light` in CSS |

---

## Project structure

```
portfolio-web/
├─ index.html
├─ package.json
├─ vite.config.js
├─ .env.example
└─ src/
   ├─ main.jsx          # starts React
   ├─ App.jsx           # puts all the sections together
   ├─ styles.css        # all the styling and animations
   ├─ data/
   │  └─ resume.js      # <-- your content is here
   └─ components/
      ├─ Navbar.jsx
      ├─ Hero.jsx
      ├─ About.jsx
      ├─ Skills.jsx
      ├─ Projects.jsx
      ├─ Education.jsx
      ├─ Contact.jsx
      ├─ Footer.jsx
      ├─ CountUp.jsx
      ├─ TypingText.jsx
      ├─ TiltCard.jsx
      ├─ Reveal.jsx
      ├─ Modal.jsx
      └─ SectionTitle.jsx
```
