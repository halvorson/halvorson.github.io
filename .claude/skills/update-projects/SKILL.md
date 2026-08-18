---
name: update-projects
description: Add or update a pet-project entry on the portfolio site (halvorson.github.io). Use when Michael wants to add a new project card, change a project's status/links, or retire one.
---

# Update Projects

The site's project cards are data-driven from `projects.json` at the repo root and
rendered client-side by `script.js` into `index.html`. There's no build step — edits to
`projects.json` go live as soon as they're committed and pushed.

## To add a project

Append an entry to the `projects` array in `projects.json` with this shape:

```json
{
  "id": "kebab-case-slug",
  "name": "Human-readable name",
  "problem": "One or two sentences: what personal problem/annoyance this was built to solve. Written from Michael's POV, no marketing language.",
  "blurb": "One or two sentences: what the thing actually does.",
  "status": "live" | "in-progress",
  "status_note": "optional — one line explaining why it's in-progress (stalled, broken deploy, etc). Omit if not needed.",
  "repo": { "url": "https://github.com/halvorson/...", "private": true|false } | null,
  "repo_note": "optional — only set when repo is null, e.g. 'Built directly, no repo to link.'",
  "live_url": "https://..." | null,
  "live_note": "optional — only set when live_url is null, e.g. 'SMS-based — no web page.'",
  "tags": ["short", "lowercase", "tags"]
}
```

Rules:
- Always fill in `problem` — it's the whole point of these stubs. If you don't know the
  original motivation, ask rather than inventing one.
- Set `repo.private: true` for private GitHub repos. Never omit the private flag — the
  site surfaces it as a visible badge so visitors aren't surprised by a 404.
- Use `status: "in-progress"` for anything not currently deployed/working, and add a short
  `status_note` explaining why (not deployed yet, deploy broken, paused, etc).
- Keep `problem` and `blurb` short — a couple of sentences each, plain and direct tone
  (matches the rest of the site — no "revolutionary" or "seamless").
- Check whether the project is actually reachable before marking it `live` — curl the
  `live_url` or check GitHub Actions/Firebase/Vercel deploy status, don't assume.

## To update a project

Find the entry by `id` and edit fields in place. Common updates:
- Project went live: flip `status` to `"live"`, set `live_url`, drop `status_note`.
- Project broke or was paused: flip `status` to `"in-progress"`, add a `status_note`.
- Repo went from private to public (or vice versa): update `repo.private`.

## To retire a project

Remove its object from the `projects` array. Don't leave dead entries around.

## The disclaimer and to-do list

- `index.html` has a standing disclaimer banner above the project grid — almost everything
  on this site was built for personal problems, not as products. Don't remove it when
  editing; if wording changes are needed, keep the same spirit (rough edges expected,
  personal-use framing).
- The `todo` array in `projects.json` is for things intentionally *not* fully represented
  here (e.g. the Second Brain project, which lives in Chime's infrastructure and can't be
  linked/described in detail from this repo). Add to it rather than fabricating a project
  card when something can't actually be shown.

## After editing

`projects.json` is plain JSON — validate it (e.g. `python3 -m json.tool projects.json`)
before committing so a syntax error doesn't blank the whole projects section.
