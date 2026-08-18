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
  "pitch": "One sentence that merges the problem and the solution — what personal annoyance this fixes AND what it actually does, in Michael's voice, no marketing language.",
  "status": "live" | "in-progress",
  "repo": {
    "url": "https://github.com/halvorson/...",
    "private": true|false,
    "private_reason": "optional — only when private, a short reason it has to stay private (shared secrets, personal API keys, an answer you don't want spoiled, etc). Omit if it's just private by default."
  } | null,
  "repo_note": "optional — only set when repo is null, e.g. 'Built directly, no repo to link.'",
  "live_url": "https://..." | null,
  "live_note": "optional — only set when live_url is null and status is 'live', e.g. 'SMS-based — no web page.'",
  "tags": ["short", "lowercase", "tags"]
}
```

Rules:
- `pitch` is the whole card copy — one sentence, problem and solution merged (e.g. "The
  Presidio is foggier than the Mission or Marin — this points you the exact direction and
  distance to walk to get out of the gloom."). If you don't know the original motivation,
  ask rather than inventing one. Don't split it back into separate problem/blurb fields.
- Set `repo.private: true` for private GitHub repos. Never omit the private flag — the
  site surfaces it as a visible badge so visitors aren't surprised by a 404. Only add
  `private_reason` when there's a real, specific reason (shared state, personal API keys,
  spoilers) — don't invent one just to fill the field.
- Use `status: "in-progress"` for anything not currently deployed/working. The card shows
  a prominent "In progress" badge and a plain "Not live yet" note automatically — don't add
  language about failed builds or broken deploys, just mark it in-progress.
- When `status: "live"`, the live URL renders as a prominent "Try it →" button — that's the
  primary call to action, so always double-check it actually resolves before marking a
  project live. Curl the `live_url` or check GitHub Actions/Firebase/Vercel deploy status,
  don't assume.

## To update a project

Find the entry by `id` and edit fields in place. Common updates:
- Project went live: flip `status` to `"live"` and set `live_url`.
- Project broke or was paused: flip `status` to `"in-progress"` and clear `live_url`.
- Repo went from private to public (or vice versa): update `repo.private` (and drop
  `private_reason` if it's no longer private).

## To retire a project

Remove its object from the `projects` array. Don't leave dead entries around.

## The disclaimer and to-do list

- `index.html` has a standing disclaimer banner above the project grid — almost everything
  on this site was built for personal problems, not as products. Don't remove it when
  editing; if wording changes are needed, keep the same spirit (rough edges expected,
  personal-use framing).
- The `todo` array in `projects.json` is for things intentionally *not* fully represented
  here — projects that can't be described or linked publicly (e.g. work-infrastructure
  projects with sensitive details). It's empty by default; the "To-do" section on the site
  hides itself automatically when the array is empty. Add to it rather than fabricating a
  project card when something can't actually be shown, but check with Michael first — this
  list is meant to stay short and deliberate, not a catch-all.

## After editing

`projects.json` is plain JSON — validate it (e.g. `python3 -m json.tool projects.json`)
before committing so a syntax error doesn't blank the whole projects section.
