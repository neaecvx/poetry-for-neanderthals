# Poetry for Neanderthals

A pass-and-play party game by **NeonDev Code Studio**. Describe the word (1 pt), then the phrase that contains it (3 pts) — using only one-syllable clues. Bonk your teammates for speaking like a poet.

Built with React + TypeScript + Vite + Zustand. Dark cave theme, 90s turn timer (configurable), Web Audio sound effects, and a 1040-card deck with no-repeat play.

## Rules

- Two teams, each turn one player is the **Poet**, the rest are the **Team**
- The Poet describes the **easy word** (1 pt), then may push for the **hard phrase** (3 pts total — it contains the word)
- Clues must use only one-syllable words. Say the answer word itself, a multi-syllable clue, or any other language? **BONK** — team loses 1 pt
- Skipping a card costs 1 pt. Timer runs out? Turn over
- Equal turns per team; highest score wins

## Setup

```bash
npm install
npm run dev
```

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check + production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Lint with oxlint |
| `npm run validate` | Validate all deck JSON files against card rules |

## Cards

Cards live in `src/data/` (`blue.json` = easy, `red.json` = hard, `green.json` = festive bonus — always mixed in). Each card:

```json
{
  "id": "blue_0001",
  "category": "blue",
  "easy": "Moon",
  "hard": "Moonlight",
  "easySyllables": 1,
  "hardSyllables": 2
}
```

Rules (enforced by `npm run validate`): `easy` is a single dictionary word; `hard` contains `easy` and has more syllables (max 7); easy words are unique across all decks. Cards are bundled at build time — no runtime API or database.

## Deploy

Static build → any static host. On Cloudflare Pages:

```bash
npm run build
npx wrangler pages deploy dist
```

Or connect the GitHub repo in the Cloudflare dashboard for auto-deploys.

---

Made by NeonDev Code Studio (NeonDevCS)
