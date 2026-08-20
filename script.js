document.getElementById("year").textContent = new Date().getFullYear();

async function loadProjects() {
  const outdoorsEl = document.getElementById("projects-outdoors");
  const familyEl = document.getElementById("projects-family");
  try {
    const res = await fetch("projects.json");
    if (!res.ok) throw new Error(`projects.json responded ${res.status}`);
    const data = await res.json();

    const outdoors = data.projects.filter((p) => p.theme === "outdoors");
    const family = data.projects.filter((p) => p.theme !== "outdoors");

    outdoorsEl.innerHTML = outdoors.map(renderCard).join("");
    familyEl.innerHTML = family.map(renderCard).join("");

    const todoSection = document.getElementById("todo-section");
    if (data.todo && data.todo.length) {
      document.getElementById("todo").innerHTML = data.todo.map(renderTodo).join("");
    } else {
      todoSection.style.display = "none";
    }
  } catch (err) {
    console.error("Failed to load projects.json", err);
    const fallback =
      `<p class="note">Couldn't load the project list right now — try refreshing, or see
       <a href="https://github.com/halvorson" target="_blank" rel="noopener">GitHub</a> directly.</p>`;
    outdoorsEl.innerHTML = fallback;
    familyEl.innerHTML = "";
  }
}

function renderCard(p) {
  const inProgress = p.status !== "live";

  const titleText = escapeHtml(p.name);
  const linkIcon = `<svg class="link-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;
  const titleHtml = p.live_url
    ? `<a class="title-link" href="${escapeHtml(p.live_url)}" target="_blank" rel="noopener" aria-label="Try ${titleText}">${titleText} ${linkIcon}</a>`
    : titleText;

  const stackPills = (p.stack || [])
    .map((s) => `<span class="pill">${escapeHtml(s)}</span>`)
    .join("");

  let githubLink = "";
  if (p.repo && !p.repo_hidden) {
    githubLink = ` <a class="inline-link" href="${escapeHtml(p.repo.url)}" target="_blank" rel="noopener" aria-label="${titleText} on GitHub">GitHub</a>`;
    if (p.repo.private_reason) {
      githubLink += ` (${escapeHtml(p.repo.private_reason)})`;
    }
  } else if (p.repo_note && !p.repo_hidden) {
    githubLink = ` <span class="note">${escapeHtml(p.repo_note)}</span>`;
  }

  const prefix = inProgress ? "[In Development] " : "";

  const body = `
      <h3 class="card-title">${titleHtml}</h3>
      ${stackPills ? `<div class="stack">${stackPills}</div>` : ""}
      <p class="pitch">${escapeHtml(prefix)}${escapeHtml(p.pitch)}${githubLink}</p>
  `;

  if (p.screenshot) {
    return `
      <article class="card has-image" role="listitem">
        <img class="card-image" src="${escapeHtml(p.screenshot)}" alt="${titleText} screenshot" loading="lazy">
        <div class="card-body">${body}</div>
      </article>
    `;
  }

  return `
    <article class="card" role="listitem">${body}</article>
  `;
}

function renderTodo(t) {
  return `<li><strong>${escapeHtml(t.name)}:</strong> ${escapeHtml(t.note)}</li>`;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

loadProjects();
