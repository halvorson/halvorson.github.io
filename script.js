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
  const titleHtml = p.live_url
    ? `<a class="title-link" href="${escapeHtml(p.live_url)}" target="_blank" rel="noopener" aria-label="Try ${titleText}">${titleText} →</a>`
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

  return `
    <article class="card" role="listitem">
      <h3 class="card-title">${titleHtml}</h3>
      ${stackPills ? `<div class="stack">${stackPills}</div>` : ""}
      <p class="pitch">${escapeHtml(prefix)}${escapeHtml(p.pitch)}${githubLink}</p>
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
