async function loadProjects() {
  const res = await fetch("projects.json");
  const data = await res.json();

  const projectsEl = document.getElementById("projects");
  projectsEl.innerHTML = data.projects.map(renderCard).join("");

  const todoEl = document.getElementById("todo");
  todoEl.innerHTML = data.todo.map(renderTodo).join("");
}

function renderCard(p) {
  const statusLabel = p.status === "live" ? "Live" : "In progress";
  const statusNote = p.status_note ? `<div class="note">${escapeHtml(p.status_note)}</div>` : "";

  let repoLink = "";
  if (p.repo) {
    const badge = p.repo.private ? `<span class="badge">private</span>` : "";
    repoLink = `<a href="${p.repo.url}" target="_blank" rel="noopener">Repo</a> ${badge}`;
  } else if (p.repo_note) {
    repoLink = `<span class="note">${escapeHtml(p.repo_note)}</span>`;
  }

  let liveLink = "";
  if (p.live_url) {
    liveLink = `<a href="${p.live_url}" target="_blank" rel="noopener">Live app</a>`;
  } else if (p.live_note) {
    liveLink = `<span class="note">${escapeHtml(p.live_note)}</span>`;
  }

  return `
    <div class="card">
      <div class="card-head">
        <h3>${escapeHtml(p.name)}</h3>
        <span class="status ${p.status}">${statusLabel}</span>
      </div>
      <p class="problem">${escapeHtml(p.problem)}</p>
      <p class="blurb">${escapeHtml(p.blurb)}</p>
      <div class="meta">
        ${repoLink}
        ${liveLink}
      </div>
      ${statusNote}
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
