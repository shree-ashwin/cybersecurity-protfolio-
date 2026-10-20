# Shree Ashwin A G — Swiss Manga: Ink in Motion

A compact, character-free personal cybersecurity portfolio built with React and Vite. The homepage prioritizes identity, projects, skills, achievements, and contact; no backend or live security feed is used.

## Run locally

From the folder containing `package.json`:

```sh
npm install
npm run dev
```

Create a production build with `npm run build`, or preview it locally with `npm run preview`.

## Content and configuration

Edit [`src/data/portfolio.js`](./src/data/portfolio.js) to maintain the portfolio:

- **Contact and resume:** Set `contact.githubUrl`, `contact.linkedinUrl`, `contact.email`, and `contact.resumeUrl` to real details. Empty values intentionally display an unavailable placeholder and do not create fake links or documents.
- **Projects:** Add or update entries in `projects`. Keep `status`, problem, technologies, contribution, scope/outcome, repository URL, and optional image details accurate. A blank repository URL or image list is supported.
- **Skills:** Update `skillGroups` and choose `practised` or `learning` for the skill kind. Do not add percentage ratings.
- **Interactive mission map:** Update skill entries in `skillMap`, position verified destinations with `mapPosition`, and maintain project/event links with `relatedMapIds` or `related`. Projects and achievements are derived from their existing data; status labels do not imply undocumented completion.
- **Roadmap:** Update each `roadmap` entry's `status` (`Not Started`, `Learning`, or `Completed`) and its summary/detail. Stages are never marked complete automatically.
- **Achievements and write-ups:** Add verified participation to `events`. Use a human-readable date or state that it was not provided; add an organizer, achievement, areas, and write-up URL only when known.

Project category/search filters, skill filters, expandable roadmap details, project dialogs, the interactive Journey timeline, and the field terminal are rendered from this data. The terminal supports `help`, `about`, `skills`, `projects`, `journey`, `contact`, and `clear`; it is read-only and does not execute system commands. The timeline derives its achievement, project, and current-learning entries from the editable portfolio data, and does not infer missing dates or project status. No CTF challenge details, project outcomes, contact information, certifications, or metrics should be inferred.

## Design and accessibility

- The initial portfolio visit shows a brief, abstract manga-style ink loader. Its timing and status copy live in `src/CinematicLoader.jsx`; its SVG artwork and splash are in the same component, and its isolated responsive styling is in `src/cinematic-loader.css`. The loader uses the existing palette tokens and honors reduced-motion preferences.
- Swiss editorial grid with abstract ink forms, halftone textures, and manga-inspired panel reveals; no people or character illustrations.
- Palette: aged paper `#F1EEE5`, deep ink `#24241F`, vermilion `#A3412D`, muted moss `#777D60`, and neutral `#C7C3B8`.
- Compact Home, About, Projects, Skills, Terminal, Achievements, and Contact navigation; light/dark toggle, visible keyboard focus, semantic project dialogs, and reduced-motion handling.
- A viewport-fixed cursor dot follows mouse and pen input; its ring eases behind, a short ink trail fades during movement, and hero actions respond with a restrained magnetic shift.
- The cursor overlay is click-through and only becomes active after mouse/pen movement. Touch keeps the native cursor behavior; reduced motion keeps the dot/ring feedback but removes the trail and magnetic/hero movement.
- The hero ink panel shifts subtly with mouse or pen movement; the identity card and project panels show a cursor-following ink highlight.
- Project panels add a contained pointer spotlight, a slight mouse/pen tilt, and a vermilion ink-mark reveal on hover or keyboard focus. Their existing detail dialogs and any configured repository links remain unchanged; panels reveal once as they enter view. Touch input avoids tilt, and reduced-motion settings disable the tilt and entrance movement.
- Content remains usable without animation; project and roadmap details are not dependent on hover.
- Internal section links use a short, non-interactive manga panel wipe and a brief destination-heading reveal. Reduced-motion users navigate immediately; the cursor layer remains above the transition panels.
- The Journey section includes category filters, keyboard-accessible expandable milestone details, and a scroll-progress ink line. The line uses a cleaned-up, observer-based size listener and passive scroll handling.
- The Skills section includes a data-driven, keyboard-accessible mission map of learning topics, portfolio projects, and the verified CTF achievement. Selecting a destination reveals its documented status and details, highlights relevant paths, and offers connected destinations. SVG paths are decorative and switch to a vertical mobile layout on small screens.
- The Field Terminal presents portfolio content through local, case-insensitive commands; leading and trailing whitespace is ignored, and contact details appear only when configured.

## Optional features

Project search/filtering and the manually maintained achievement spotlight are implemented. A write-up viewer can be added when genuine write-ups exist. An ATT&CK learning map should wait until it can link to personal learning material; the resume action remains unavailable until an actual resume file is provided. A command palette, skill-match score, and live activity feed are intentionally omitted to keep the portfolio focused.
