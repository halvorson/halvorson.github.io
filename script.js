async function loadProjects() {
  const res = await fetch("projects.json");
  const data = await res.json();

  const projectsEl = document.getElementById("projects");
  projectsEl.innerHTML = data.projects.map(renderCard).join("");

  const todoSection = document.getElementById("todo-section");
  if (data.todo && data.todo.length) {
    document.getElementById("todo").innerHTML = data.todo.map(renderTodo).join("");
  } else {
    todoSection.style.display = "none";
  }
}

function renderCard(p) {
  const isLive = p.status === "live";
  const statusBadge = isLive
    ? `<span class="status live">Live</span>`
    : `<span class="status in-progress">In progress</span>`;

  let repoLink = "";
  if (p.repo) {
    const badge = p.repo.private ? `<span class="badge">private</span>` : "";
    repoLink = `<a href="${p.repo.url}" target="_blank" rel="noopener">Repo</a> ${badge}`;
    if (p.repo.private_reason) {
      repoLink += `<div class="note">${escapeHtml(p.repo.private_reason)}</div>`;
    }
  } else if (p.repo_note) {
    repoLink = `<span class="note">${escapeHtml(p.repo_note)}</span>`;
  }

  let cta = "";
  if (p.live_url) {
    cta = `<a class="cta" href="${p.live_url}" target="_blank" rel="noopener">Try it →</a>`;
  } else if (p.live_note) {
    cta = `<span class="note">${escapeHtml(p.live_note)}</span>`;
  } else if (!isLive) {
    cta = `<span class="note">Not live yet — check back soon.</span>`;
  }

  return `
    <div class="card">
      <div class="card-head">
        <h3>${escapeHtml(p.name)}</h3>
        ${statusBadge}
      </div>
      <p class="pitch">${escapeHtml(p.pitch)}</p>
      <div class="meta">
        ${cta}
        ${repoLink}
      </div>
    </div>
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
