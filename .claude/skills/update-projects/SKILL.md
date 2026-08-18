---
name: update-projects
description: Add or update a project entry on the portfolio site (halvorson.github.io). Use when Michael wants to add a new project card, change a project's status/links, or retire one.
---

# Update Projects

The site's project cards are data-driven from `projects.json` at the repo root and
rendered client-side by `script.js` into `index.html`. There's no build step — edits to
`projects.json` go live as soon as they're committed and pushed.

The page has two sections, "Exploring outdoors" and "Family apps" — `script.js` splits
`data.projects` into them by `theme === "outdoors"` vs. everything else. There's no third
section; a project that doesn't obviously fit either still has to land in one (see BitLock
in the current data — it's not outdoors-tech, but the story is about a cabin lockbox, so it
reads better there than in "Family apps").

## To add a project

Append an entry to the `projects` array in `projects.json` with this shape:

```json
{
  "id": "kebab-case-slug",
  "name": "Human-readable name",
  "pitch": "One or two sentences, first person, that tell the actual story: the specific
    problem AND what got built, in Michael's casual voice. A GitHub link gets appended
    automatically to the end of this text on render (unless repo_hidden is set) — don't add
    your own link/CTA language, just end the sentence naturally.",
  "status": "live" | "in-development",
  "theme": "outdoors" | "parenting" | "household" | "relationships" | "utility",
  "stack": ["React", "Firestore", "..."],
  "repo": {
    "url": "https://github.com/halvorson/...",
    "private": true|false,
    "private_reason": "optional — only when private, a short reason it has to stay private
      (shared secrets, personal API keys, an answer you don't want spoiled,
      commercialization optionality, etc). Renders inline right after the GitHub link, in
      parens, e.g. 'GitHub (Private Repo - uses a personal Twilio account)'. Omit if it's
      just private by default with no story worth telling."
  } | null,
  "repo_hidden": "optional bool — when true, no GitHub link/repo info renders at all, even
    though repo data is still kept in this file for reference. Use when Michael doesn't
    want the repo surfaced (not just marked private) — e.g. keeping a commercialization
    option fully quiet, not just gated behind a private-repo badge.",
  "repo_note": "optional — only set when repo is null, e.g. 'Built directly, no repo to link.'",
  "live_url": "https://..." | null
}
```

Rules:
- `pitch` is the whole card copy. Write it as a story, not a spec sheet — see BitLock,
  Ins-and-Outs, and Teaching Toddlers Typing in the current data for the tone: specific,
  a little funny, first person, includes what actually happened (not just what it does). If
  you don't know the real story, ask Michael rather than inventing one.
- **The card title is the primary call to action.** If `live_url` is set, the project name
  renders as a link with a trailing arrow ("Bearings →") using the same underline-on-hover
  treatment as the GitHub/LinkedIn links in the header — no separate "Try it" button. If
  `live_url` is null, the title is just plain text (no arrow, not clickable). Never set
  `live_url` to a link that doesn't actually work — the whole title is the affordance now,
  so a dead link there is worse than before.
- The GitHub link renders automatically at the end of the pitch paragraph, labeled
  "GitHub" (not "Repo"). There's no "private" badge anymore — if there's something worth
  telling a visitor about why a repo is private, put it in `private_reason` and it'll render
  inline right after the link. If a repo shouldn't be surfaced at all (link, badge, or note),
  set `repo_hidden: true` instead of just leaving `private_reason` off.
- `theme` drives which section a card lands in (outdoors vs. everything else) and the
  within-section order (see below). Pick the closest match to what actually motivated the
  project, not the tech stack. If none fit, ask rather than forcing one.
- `stack` is a short list (2–4) of real technologies rendered as pills on the card — pull
  from the repo's actual `package.json`/`firebase.json`, don't guess. Prefer specific
  services over generic ones (`Firestore` over `Firebase` when Firestore is what's actually
  used; `Vercel` when that's the host).
- Set `repo.private: true` for private GitHub repos even when `repo_hidden` is also set —
  keep the data accurate regardless of what's currently shown on the page.
- **There are no "Live" / status badges anymore.** Instead, anything with
  `status: "in-development"` gets a plain `[In Development] ` text prefix automatically
  added to the front of the pitch — don't write that into `pitch` yourself, and don't add
  language about failed builds, broken deploys, or whether the thing has ever been verified
  to work. If a project's actual working status is genuinely uncertain, that's a
  conversation to have with Michael before publishing anything about it, not a caveat to
  soften into public copy — and it's Michael's call whether an unverified project is still
  shown as `"live"` (no prefix) or `"in-development"` (prefixed), not something to decide
  unilaterally.

## Ordering

Array order is display order within each section — there's no separate sort logic in
`script.js`, just the outdoors/not-outdoors split. Current convention within each section:
live projects before in-development ones, and among live projects, ones with a real working
`live_url` before ones that are live but keeping their link private/hidden (BitLock, Ask the
Stars). Slot new entries in to match this rather than appending to the end by default.

## To update a project

Find the entry by `id` and edit fields in place. Common updates:
- Project went live: flip `status` to `"live"` and set `live_url`.
- Project stalled or got pulled back into active work: flip `status` to `"in-development"`
  and clear `live_url`.
- Repo went from private to public (or vice versa): update `repo.private` (and drop
  `private_reason` if it's no longer private).

## To retire a project

Remove its object from the `projects` array. Don't leave dead entries around.

## The disclaimer and to-do list

- `index.html` has a single-line disclaimer as a footnote at the very bottom of the page
  (below the project sections, above the copyright) — not a warning banner up top. Keep it
  there and keep it low-key; it should read as a footnote, not a caveat you have to get past
  before reaching the projects.
- The `todo` array in `projects.json` is for things intentionally *not* fully represented
  here — projects that can't be described or linked publicly (e.g. work-infrastructure
  projects with sensitive details). It's empty by default; the "To-do" section on the site
  hides itself automatically when the array is empty. Add to it rather than fabricating a
  project card when something can't actually be shown, but check with Michael first — this
  list is meant to stay short and deliberate, not a catch-all.

## After editing

`projects.json` is plain JSON — validate it (e.g. `python3 -m json.tool projects.json`)
before committing so a syntax error doesn't blank the whole projects section.
