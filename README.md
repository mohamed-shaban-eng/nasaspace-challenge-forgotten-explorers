# 🚀 Forgotten Explorers | المستكشفون المنسيون

An interactive, Arabic (RTL) learning website about NASA hardware that finished its mission and stayed behind on Mars and the Moon. Pick an explorer, listen to its story in its own voice while a kids'-doodle animation plays, then answer the challenge to earn stars.

موقع تعليمي تفاعلي بالعربية عن معدات ناسا التي أكملت مهمتها وبقيت على المريخ والقمر. اختر مستكشفًا، استمع إلى قصته مع رسم كروكي متحرك، ثم أجب عن التحدي لتنال نجومك.

## The explorers

| Explorer | World | Story |
|---|---|---|
| Spirit Rover (سبيريت) | Mars | Planned for ~90 sols, explored for 6+ years |
| Opportunity Rover (أوبورتيونيتي) | Mars | "Martian blueberries", ~45 km, silenced by a dust storm |
| Ingenuity Helicopter (إنجينيويتي) | Mars | Planned for 5 flights, completed 72 |
| ALSEP (محطة ألسيب) | Moon | Five Apollo science stations that reported until 1977 |

## Features

- **Audio stories** with a full player: play/pause, seek bar, ±10 s, speed 0.75×–1.5×, click any paragraph to jump to it. Falls back to browser text-to-speech if an audio file is missing.
- **Animated doodle scenes**: four hand-drawn-style SVG scenes per explorer that change with each paragraph. The character "talks" while the audio plays.
- **Challenge quiz**: two questions per explorer, 1–2 stars, confetti, progress saved in `localStorage`.
- **Extras**: progress ring, animated stats, "planned vs actual" comparison, interactive timeline, downloadable certificate, share links (`#spirit`, `#opp`, `#ing`, `#alsep`).
- **Accessibility and UX**: keyboard navigation, focus trap in dialogs, `Esc` to close, `Space` to play/pause, text size controls, reduced-motion mode, responsive down to phone width.
- No build step, no dependencies, no server needed.

## Run locally

Open `index.html` in any modern browser. The internet is only needed for the Cairo font from Google Fonts (a system font is used as a fallback).

## Publish on GitHub Pages

1. Create a new repository and upload all files (keep the `audio/` folder).
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
4. After a minute the site is live at `https://<your-username>.github.io/<repo-name>/`.

## Project structure

```
├── index.html     Page markup
├── style.css      Styling and doodle animations
├── data.js        Stories, quiz questions, sources, timeline, stats
├── scenes.js      Doodle SVG scenes (4 per explorer) and captions
├── app.js         Logic: player, quiz, progress, certificate, settings
└── audio/
    ├── spirit.mp3
    ├── opportunity.mp3
    ├── ingenuity.mp3
    └── alsep.mp3
```

## Customising

- **Content**: edit `data.js` (stories, questions `qs`, sources `src`, timeline `TL`, comparison `VS`, numbers `STATS`).
- **Audio**: put an `.mp3` in `audio/` and set the explorer's `audio` path in `data.js`. Leave it empty to use text-to-speech.
- **Drawings**: edit the scene functions in `scenes.js`; captions are in the `CAP` object.

## Sources

All facts come from NASA/JPL material linked at the end of every story inside the app (NASA Science, JPL, NASA NTRS, NASA PDS). Illustrations are expressive cartoons, not accurate depictions of the hardware, and the map is schematic and not to scale.

## Credits

Audio narration generated with Lahajati. Story content, code and illustrations belong to the project authors.

## License

Add a license of your choice (for example MIT for the code) before publishing. Check the usage terms of the audio files and any NASA content you reuse.
