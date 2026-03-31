# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

GymBracket is a React web app that tracks results of the NCAA Women's Gymnastics Championship tournament and runs a bracket challenge (pick'em) competition. Built with React + Vite, deployed to Vercel.

## Development

```bash
npm install          # install dependencies
npm run dev          # start dev server (Vite HMR)
npm run build        # production build to dist/
npm run preview      # preview production build
npm test             # run tests (vitest)
npm run test:watch   # run tests in watch mode
```

## Tech Stack

- **React 19** + **Vite 8** — no SSR, client-side SPA
- **React Router** (HashRouter) — `/`, `/leaderboard`, `/picks/:name`
- **Vitest** + **@testing-library/react** — unit and component tests
- **Plain CSS** with custom properties — no CSS-in-JS, no Tailwind
- **No database** — all data lives in `src/data/` modules
- **No external API calls** — data is hardcoded (results updated by committing code)

## File Structure

```
src/
  main.jsx                    -- React entry point, router setup
  App.jsx                     -- Layout shell (skip-link, Nav, routes)
  components/
    Nav.jsx                   -- Persistent top navigation
    Bracket.jsx               -- Full tournament bracket view (main page)
    BracketRegional.jsx       -- One regional quadrant
    BracketRound.jsx          -- Round column with team pills
    TeamPill.jsx              -- Single team display (seed, name, NQS, status)
    Leaderboard.jsx           -- Ranked participant table
    PicksBracket.jsx          -- Individual bracket with scoring overlay
    PicksSelector.jsx         -- Participant dropdown
    ScoreSummary.jsx          -- Score breakdown cards
  data/
    tournament.js             -- Static bracket structure (36 teams, 4 regionals)
    results.js                -- Actual results (updated as tournament progresses)
    picks.js                  -- Participant bracket picks (parsed from PDFs)
    scoring.js                -- Point values per round
  utils/
    scoring.js                -- scoreBracket(), scoreAll() functions
  styles/
    main.css                  -- CSS custom properties, reset, nav, shared
    bracket.css               -- Bracket grid, team pills, regionals
    leaderboard.css           -- Leaderboard table
    picks.css                 -- Picks view, score summary
  __tests__/
    scoring.test.js           -- Scoring engine tests
```

## Data Model

- **tournament.js**: Immutable bracket structure — teams, seeds, NQS scores, regionals, rounds.
- **results.js**: Actual results keyed by `round → regional/semi → [team names]`. Missing keys = round not played. Updated by committing code.
- **picks.js**: Array of `{ name, picks }` where picks has same shape as results. Populated from PDFs.
- **scoring.js**: Point scale per round (configurable).

Scoring is a set intersection: for each round/region, count how many picked teams appear in the actual results array.

## Test-Driven Development (Canon TDD)

All code follows Kent Beck's Canon TDD workflow. Source: https://tidyfirst.substack.com/p/canon-tdd

### The Five Steps

1. **Write a test list** — Before touching code, list all expected behavioral variants.
2. **Write one test** — Convert one item into a concrete test.
3. **Make it pass** — Fix code genuinely.
4. **Refactor (optional)** — Never mix refactoring with making a test pass.
5. **Repeat** — Until the test list is empty.

### Key Rules

- Write tests one at a time; do not speculatively write all tests upfront.
- Never refactor while a test is failing.

## UI/UX Design Principles

Optimize for intuitive use over clever design.

### Core Philosophy

- Clarity over cleverness, speed over ornamentation, consistency over novelty.
- Primary objective: help users accomplish their goal with minimal cognitive load.

### Visual Hierarchy & Layout

- One clear primary action per screen/view; secondary actions visually de-emphasized.
- 8px base spacing system. Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64.
- Use whitespace generously; chunk information.

### Typography

- Limit to 1–2 font families. Clear heading hierarchy: H1 → H2 → H3 → body → caption.

### Color

- 1 primary color (#1a1a2e), accent (#c8102e NCAA red), neutral grayscale.
- Semantic: green = success/correct, red = error/incorrect, gray = pending.
- Meet WCAG AA contrast minimums.

### States & Feedback

- Design for all states: loading, empty, success, error.
- Empty states should explain what to do next.

### Accessibility

- WCAG AA contrast (4.5:1 normal, 3:1 large text).
- Keyboard navigable. Clear labels on all inputs. Touch targets ≥ 44px.

### Cognitive UX Laws

- **Hick's Law**: reduce choices. **Fitts's Law**: large primary actions.
- **Jakob's Law**: follow known patterns. **Von Restorff Effect**: important elements stand out.

## Security

- **Never commit API keys, tokens, or credentials.**
- **No `eval()`, `document.write()`, or `new Function()`** with dynamic input.
- All external URLs use `https://`.
- `.gitignore` excludes `.env`, credentials, editor configs.
