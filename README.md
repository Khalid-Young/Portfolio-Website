# Minimal Developer Portfolio (Vanilla HTML/CSS/JS)

A clean, responsive, and accessible portfolio template. Mobile-first, no frameworks, deploy anywhere.

## File structure

```
.
├─ index.html
├─ css/
│  └─ styles.css
├─ js/
│  └─ main.js
├─ assets/
│  ├─ icons/
│  │  ├─ favicon.svg
│  │  ├─ github.svg
│  │  ├─ linkedin.svg
│  │  └─ mail.svg
│  └─ img/
│     ├─ avatar.svg
│     ├─ project-1.svg
│     ├─ project-2.svg
│     └─ project-3.svg
├─ resume.pdf (placeholder)
└─ README.md
```

## Run locally

- Open `index.html` directly in your browser, or
- Use a simple static server:

```bash
npx http-server -p 8080 -c-1
```

Then visit `http://localhost:8080`.

## Customize

- Content: edit `index.html` — update name, sections, links.
- Colors/typography: see CSS variables in `css/styles.css` under `:root`.
  - `--color-accent`: primary brand color
  - `--font-sans`: font stack
- Images: replace files in `assets/img/` with same names or update `src` paths.
- Icons/Favicon: update SVGs in `assets/icons/`.
- Theme: light/dark toggled with the button in footer; persisted via `localStorage`.

## Deployment

### GitHub Pages
1. Push this folder to a GitHub repo.
2. In repo settings → Pages → Source: deploy from `main` branch `/root`.
3. Wait for the page to build; your site will be live at the Pages URL.

### Netlify
1. Drag-and-drop the project folder into the Netlify dashboard, or connect repo.
2. Build command: none. Publish directory: root.
3. Set a custom domain if desired.

### Vercel
1. Import the repository in Vercel.
2. Framework preset: "Other"; build command: none; output: root.
3. Deploy.

## Accessibility & testing

- Navigate entirely with keyboard (Tab/Shift+Tab, Enter, Space, Escape).
- Check focus rings and skip link.
- Test color contrast (WCAG AA+) — adjust variables if needed.
- Use browser devtools Lighthouse for Accessibility/Performance/SEO.
- Test on mobile; verify the menu button and modals work with screen readers.

## Contact form integration

This template includes a no-JS fallback via `mailto:`. For more robust handling:

### Formspree
1. Create a Formspree form and get the endpoint URL.
2. Replace the form tag in `index.html`:

```html
<form id="contactForm" action="https://formspree.io/f/YOUR_ID" method="POST" novalidate>
```

3. Ensure inputs have `name` attributes (`name`, `email`, `message`).

### EmailJS
1. Sign up at EmailJS, create a service and template.
2. Include EmailJS SDK and send on submit in `js/main.js` (inside the form submit handler).
3. Prevent default submit and call `emailjs.send(...)` with the fields.

### Simple server endpoint
- Point `action="/api/contact"` and implement a minimal handler that validates and sends email.

## Images & performance

- Use modern formats (SVG/PNG/WebP). Keep images under ~150 KB where possible.
- Provide dimensions (`width`/`height`) and use `loading="lazy"` for below-the-fold images.
- Example `srcset` pattern if using raster images:

```html
<img src="/assets/img/project-1-800.jpg" srcset="/assets/img/project-1-400.jpg 400w, /assets/img/project-1-800.jpg 800w, /assets/img/project-1-1200.jpg 1200w" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" alt="Screenshot of Project Alpha">
```

## Résumé

- Replace the root `resume.pdf` with your own file using the same name, or update the link in the Résumé section of `index.html`.

## Optional

- Intersection Observer is used for simple fade-in reveals. Remove `.reveal` classes if you prefer static rendering.
- Add simple unit tests with Playwright for nav, modal, and form flows.

## License

MIT — free to use and modify.


