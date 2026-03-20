# FES Website Quick Guide

## Project Structure

- `index.html`, `team.html`, `our-mission.html`, `newsletter.html`, `fes-union.html`, `semana-orcamento-estado.html`, `other-events.html`
- `assets/css/styles.css`
- `assets/js/script.js`
- `assets/images/logo-vetorial.png`
- `assets/carousel/` (homepage hero carousel images)
- `newsletters/` (newsletter PDF files)

## Update Carousel Images

1. Add image files to `assets/carousel/`.
2. Use lowercase names with dashes, for example: `img-1761.jpg`.
3. In `assets/css/styles.css`, update these selectors:
   - `.hero-carousel` fallback background
   - `.hero-slide.slide-1`
   - `.hero-slide.slide-2`
4. If you add more than 2 images, add extra `.hero-slide.slide-N` blocks and adjust animation timing.

## Update Newsletter PDFs

1. Add PDF files to `newsletters/`.
2. Use simple lowercase names, for example: `mar-2026.pdf`.
3. In `newsletter.html`, update:
   - `<select id="edition-select">` options
   - `.edition-chip` buttons (`data-pdf` values)
4. Keep file paths relative, for example: `newsletters/mar-2026.pdf`.

## Subscription Storage

- The subscription form currently stores emails in browser `localStorage` only.
- Key used: `fes_newsletter_subscribers`.
- For production, connect the form to a backend service (Mailchimp/Brevo/Supabase/etc.).

## Cross-Device Reliability Tips

- Avoid spaces and uppercase in new asset filenames.
- Keep all references relative (already configured this way).
- Hard refresh after changes (`Ctrl+F5`) to clear old cached CSS/JS.
