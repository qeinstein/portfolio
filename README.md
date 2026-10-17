Personal research profile for Toheeb Ogunade, built with React, TypeScript, and Vite.

## Develop

```sh
npm install
npm run dev -- --host 0.0.0.0
```

Open the Network URL printed by Vite. `npm run build` creates the production site; `npm test` runs the existing test suite.

## Edit the profile

- `src/pages/home-page.tsx`: biography and section layout.
- `lib/academic-profile.ts`: education and the three research pill descriptions.
- `lib/blog-posts.ts`: Medium blog titles, dates, links, and local cover illustrations.
- `lib/portfolio-data.ts`: name, tagline, contact profiles, and publication details.
- `public/publications/`: first-page previews rendered from the two arXiv PDFs.
- `public/toheeb-ogunade.png`: portrait. Framing is controlled by `.portrait img` in `src/styles.css`.
- `src/styles.css`: typography, spacing, beige/dark theme variables, selection color, and link animation.

The theme follows the system preference until the visitor chooses a mode, then saves their choice locally. Selected text uses the same purple text color with a transparent background in both modes.

The UNILAG crest is stored locally in `public/unilag-logo.png`, sourced from the university’s official website: https://unilag.edu.ng/wp-content/uploads/2024/02/UNILAG-LOGO-700x700.png.
