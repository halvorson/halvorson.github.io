document.getElementById("year").textContent = new Date().getFullYear();

async function loadProjects() {
  const projectsEl = document.getElementById("projects");
  try {
    const res = await fetch("projects.json");
    if (!res.ok) throw new Error(`projects.json responded ${res.status}`);
    const data = await res.json();

    projectsEl.innerHTML = data.projects.map(renderCard).join("");

    const todoSection = document.getElementById("todo-section");
    if (data.todo && data.todo.length) {
      document.getElementById("todo").innerHTML = data.todo.map(renderTodo).join("");
    } else {
      todoSection.style.display = "none";
    }
  } catch (err) {
    console.error("Failed to load projects.json", err);
    projectsEl.innerHTML =
      `<p class="note">Couldn't load the project list right now — try refreshing, or see
       <a href="https://github.com/halvorson" target="_blank" rel="noopener">GitHub</a> directly.</p>`;
  }
}

function renderCard(p) {
  const isLive = p.status === "live";
  const statusBadge = isLive
    ? `<span class="status live">Live</span>`
    : `<span class="status in-progress">In progress</span>`;

  const stackPills = (p.stack || [])
    .map((s) => `<span class="pill">${escapeHtml(s)}</span>`)
    .join("");

  let repoLink = "";
  if (p.repo) {
    const badge = p.repo.private ? `<span class="badge">private</span>` : "";
    const repoUrl = escapeHtml(p.repo.url);
    repoLink = `<a href="${repoUrl}" target="_blank" rel="noopener" aria-label="${escapeHtml(p.name)} repository">Repo</a> ${badge}`;
    if (p.repo.private_reason) {
      repoLink += `<div class="note">${escapeHtml(p.repo.private_reason)}</div>`;
    }
  } else if (p.repo_note) {
    repoLink = `<span class="note">${escapeHtml(p.repo_note)}</span>`;
  }

  let cta = "";
  if (p.live_url) {
    const liveUrl = escapeHtml(p.live_url);
    cta = `<a class="cta" href="${liveUrl}" target="_blank" rel="noopener" aria-label="Try ${escapeHtml(p.name)}">Try it →</a>`;
  } else if (p.live_note) {
    cta = `<span class="note">${escapeHtml(p.live_note)}</span>`;
  } else if (!isLive) {
    cta = `<span class="note">Not live yet — check back soon.</span>`;
  }

  return `
    <article class="card" role="listitem">
      <div class="card-head">
        <h3>${escapeHtml(p.name)}</h3>
        ${statusBadge}
      </div>
      <p class="pitch">${escapeHtml(p.pitch)}</p>
      ${stackPills ? `<div class="stack">${stackPills}</div>` : ""}
      <div class="meta">
        ${cta}
        ${repoLink}
      </div>
    </article>
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
