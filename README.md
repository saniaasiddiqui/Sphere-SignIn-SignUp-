# SPHERE — Synthesis Workspace

A React + Vite + Tailwind frontend implementing the SPHERE dashboard flow:
create/open a project repository, launch a synthesis meeting, and view a
repository's synced meetings, PRs, and architecture topology.

## Stack

- React 19 + Vite
- Tailwind CSS 3 (custom "ink navy" design tokens in `tailwind.config.js`)
- `react-router-dom` for routing (no TanStack)
- `lucide-react` for icons
- Plain React Context (`src/context/ProjectsContext.jsx`) for shared state —
  no external state/query library

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Flow coverage

- **Dashboard** (`/`) — greeting, quick stats, "Initiate Meeting" card, and
  an "Active Project Orbit" visual for the featured repository.
- **Initiate Meeting modal** — "Create New Project Repository" or "Open
  Existing Project Repository".
- **Create Project Repository modal** — project name with live slug,
  scope/domain textarea with a 200-character counter, and a Link Remote
  Git / Auto-Provision Staging toggle. Submitting adds the project to the
  sidebar with a "New" badge and redirects to `/projects/:id`.
- **Project Repositories** (`/projects`) — filterable, searchable grid of
  repository cards, each with an "Open Repository" action.
- **Project Detail** (`/projects/:id`) — "Enter Meeting URL" banner at the
  top; pasting a URL and launching flips a freshly created repository from
  its empty state into a populated Overview with stats, recent meetings,
  topology, and the orchestrator status card.

## Notes

- All data is in-memory (`src/data/seed.js` + `ProjectsContext`) — there is
  no backend. Refreshing the page resets state to the seeded four
  repositories.
- Design tokens (`ink-950 #0B132B`, `ink-800 #1C2541`, `canvas #F8F9FA`,
  `indigo-500 #3D5AFE`) live in `tailwind.config.js` for easy re-theming.
