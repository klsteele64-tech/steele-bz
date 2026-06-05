import { getProgress, saveProgress, exportProgressJson } from "./progress.js";

const cfg = window.TRAINING_CONFIG;
if (!cfg?.stream || !cfg?.apiBase) {
  document.getElementById("app").textContent = "Missing TRAINING_CONFIG";
  throw new Error("TRAINING_CONFIG required");
}

const { stream, apiBase, title, tagline } = cfg;
let timerRunning = false;
let timerSeconds = 300;
let timerInterval = null;

async function api(path, options) {
  const res = await fetch(`${apiBase}${path}`, options);
  if (!res.ok) throw new Error(`${path} → ${res.status}`);
  return res.json();
}

function prerequisitesMet(id, catalog, progress) {
  const lesson = catalog.lessons?.find((l) => l.id === id);
  if (!lesson) return { ok: false, missing: [] };
  const completed = progress.completed || {};
  const missing = (lesson.prerequisites || []).filter((p) => !completed[p]);
  return { ok: missing.length === 0, missing };
}

function trackProgressPercent(track, catalog, progress) {
  const completed = progress.completed || {};
  const done = track.lessonIds.filter((id) => completed[id]).length;
  return Math.round((done / track.lessonIds.length) * 100);
}

function renderMarkdownSimple(text) {
  return text
    .replace(/^### (.*)$/gm, "<h4>$1</h4>")
    .replace(/^## (.*)$/gm, "<h3>$1</h3>")
    .replace(/^# (.*)$/gm, "<h2>$1</h2>")
    .replace(/^> (.*)$/gm, "<blockquote>$1</blockquote>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br>");
}

function setupTimer(timerEl, pauseBtn) {
  timerSeconds = 300;
  timerRunning = true;
  const tick = () => {
    const m = Math.floor(timerSeconds / 60);
    const s = timerSeconds % 60;
    timerEl.textContent = `${m}:${String(s).padStart(2, "0")}`;
    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      timerRunning = false;
    } else {
      timerSeconds--;
    }
  };
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(tick, 1000);
  tick();
  pauseBtn.onclick = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
      timerRunning = false;
      pauseBtn.textContent = "Resume";
    } else {
      timerRunning = true;
      timerInterval = setInterval(tick, 1000);
      pauseBtn.textContent = "Pause";
    }
  };
}

function showAssistModal(markdown) {
  const dlg = document.createElement("dialog");
  dlg.className = "assist-dialog";
  dlg.innerHTML = `<h3>Assist copy</h3><pre></pre><button type="button">Close</button>`;
  dlg.querySelector("pre").textContent = markdown;
  dlg.querySelector("button").onclick = () => dlg.close();
  document.body.appendChild(dlg);
  dlg.showModal();
}

async function renderDocsTab(meta, panel) {
  const slugs = meta.offlineDocSlugs || [];
  if (!slugs.length) {
    panel.innerHTML = "<p>No offline docs linked for this lesson.</p>";
    return;
  }
  panel.innerHTML = "";
  for (const slug of slugs) {
    try {
      const doc = await api(`/docs/${slug}`);
      const article = document.createElement("article");
      article.className = "doc-excerpt";
      article.innerHTML = `
        <h3>${doc.title}</h3>
        <p class="doc-meta"><a href="${doc.canonicalUrl}" target="_blank" rel="noopener">Canonical docs</a></p>
        <div class="doc-body"><p>${renderMarkdownSimple(doc.markdown)}</p></div>
        <footer class="doc-footer">Last reviewed: ${doc.lastReviewed || "unknown"}</footer>
      `;
      panel.appendChild(article);
    } catch {
      panel.innerHTML += `<p class="error">Missing doc: ${slug}</p>`;
    }
  }
}

async function renderLesson(id) {
  const catalog = await api("/catalog");
  const app = document.getElementById("app");
  const lessonEntry = catalog.lessons?.find((l) => l.id === id);

  if (!lessonEntry) {
    app.innerHTML = `<p class="error">Lesson not found: ${id}</p><p><a href="index.html">← Catalog</a></p>`;
    return;
  }

  const progress = getProgress(stream);
  const preCheck = prerequisitesMet(id, catalog, progress);
  let lesson;
  try {
    lesson = await api(`/lessons/${id}`);
  } catch (err) {
    app.innerHTML = `<p><a href="index.html">← Catalog</a></p><p class="error">${err.message}</p>`;
    return;
  }

  progress.lastLessonId = id;
  saveProgress(stream, progress);

  const preWarning = !preCheck.ok
    ? `<div class="prereq-warn">Prerequisites not complete: ${preCheck.missing.join(", ")}.</div>`
    : "";

  app.innerHTML = `
    <p><a href="index.html">← Catalog</a></p>
    <h2>${lesson.id}: ${lesson.title}</h2>
    ${preWarning}
    <nav class="tabs" role="tablist">
      <button type="button" role="tab" aria-selected="true" data-tab="lesson">Lesson</button>
      <button type="button" role="tab" aria-selected="false" data-tab="docs">Docs</button>
      <button type="button" role="tab" aria-selected="false" data-tab="quiz-panel">Quiz</button>
    </nav>
    <div id="tab-lesson" class="tab-panel" role="tabpanel">
      <div class="timer" id="timer">5:00</div>
      <button id="pause" type="button">Pause</button>
      <ol id="steps"></ol>
      <div id="demo" class="demo-md"></div>
    </div>
    <div id="tab-docs" class="tab-panel hidden" role="tabpanel"></div>
    <div id="tab-quiz-panel" class="tab-panel hidden" role="tabpanel"><section id="quiz"></section></div>
    <div class="btn-row" id="assist-row"></div>
  `;

  document.getElementById("demo").innerHTML = `<p>${renderMarkdownSimple(lesson.demoMarkdown)}</p>`;
  const steps = document.getElementById("steps");
  (lesson.timeline || []).forEach((t) => {
    const li = document.createElement("li");
    li.textContent = `${t.label} (${t.atSec}s): ${t.action}`;
    steps.appendChild(li);
  });
  setupTimer(document.getElementById("timer"), document.getElementById("pause"));

  if (lesson.hasAssist) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "Open Assist copy";
    btn.onclick = async () => {
      try {
        const assist = await api(`/lessons/${id}/assist`);
        showAssistModal(assist.markdown);
      } catch {
        alert("Assist unavailable for this lesson.");
      }
    };
    document.getElementById("assist-row").appendChild(btn);
  }

  const tabs = app.querySelectorAll(".tabs button");
  const panels = {
    lesson: document.getElementById("tab-lesson"),
    docs: document.getElementById("tab-docs"),
    "quiz-panel": document.getElementById("tab-quiz-panel"),
  };
  tabs.forEach((tab) => {
    tab.onclick = () => {
      tabs.forEach((t) => t.setAttribute("aria-selected", t === tab ? "true" : "false"));
      Object.values(panels).forEach((p) => p.classList.add("hidden"));
      panels[tab.dataset.tab].classList.remove("hidden");
    };
  });

  await renderDocsTab(lesson, panels.docs);

  const quizEl = document.getElementById("quiz");
  quizEl.innerHTML = "<h3>Quiz</h3>";
  (lesson.quiz || []).forEach((q, qi) => {
    const field = document.createElement("fieldset");
    field.innerHTML = `<legend>${q.q}</legend>`;
    q.choices.forEach((c, ci) => {
      const label = document.createElement("label");
      label.innerHTML = `<input type="radio" name="q${qi}" value="${ci}" /> ${c}`;
      field.appendChild(label);
    });
    quizEl.appendChild(field);
  });

  const submit = document.createElement("button");
  submit.type = "button";
  submit.textContent = "Submit quiz";
  submit.onclick = async () => {
    const answers = lesson.quiz.map((_, qi) => {
      const sel = document.querySelector(`input[name="q${qi}"]:checked`);
      return sel ? Number(sel.value) : -1;
    });
    try {
      const result = await api(`/lessons/${id}/quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (result.passed) {
        const p = getProgress(stream);
        p.completed = p.completed || {};
        p.completed[id] = { score: result.score, at: new Date().toISOString() };
        saveProgress(stream, p);
        alert(`Passed (${result.score}/${result.total}). Lesson marked complete.`);
      } else {
        alert(`Need 2/3 to pass. Score: ${result.score}/${result.total}`);
      }
    } catch (err) {
      alert(err.message);
    }
  };
  quizEl.appendChild(submit);
}

function renderPowerUserSection(track, catalog, progress, parent) {
  const completed = progress.completed || {};
  const submodules = catalog.submodules || [
    { title: "5A — Agent orchestration", lessonIds: ["L21", "L22", "L23", "L24", "L25"] },
    { title: "5B — Isolation, git & review", lessonIds: ["L26", "L27", "L28", "L29", "L30"] },
    { title: "5C — Automation, hooks & APIs", lessonIds: ["L31", "L32", "L33", "L34", "L35", "L36"] },
    { title: "5D — Team rollout", lessonIds: ["L37", "L38", "L39", "L40"] },
  ];
  for (const sub of submodules) {
    const h3 = document.createElement("h3");
    h3.className = "submodule-header";
    h3.textContent = sub.title;
    parent.appendChild(h3);
    for (const lid of sub.lessonIds) {
      const lesson = catalog.lessons?.find((l) => l.id === lid);
      if (!lesson) continue;
      const pre = prerequisitesMet(lid, catalog, progress);
      const a = document.createElement("a");
      a.className = "lesson-card" + (completed[lid] ? " done" : "") + (pre.ok ? "" : " locked");
      a.href = `lesson.html?id=${lid}`;
      a.textContent = `${lid}: ${lesson.title} (${lesson.level || ""})`;
      if (!pre.ok) a.title = `Prerequisites: ${pre.missing.join(", ")}`;
      parent.appendChild(a);
    }
  }
}

function renderHome(catalog) {
  const progress = getProgress(stream);
  const completed = progress.completed || {};
  const app = document.getElementById("app");
  app.innerHTML = "";

  const exportBtn = document.createElement("button");
  exportBtn.type = "button";
  exportBtn.textContent = "Export progress JSON";
  exportBtn.onclick = () => {
    const json = exportProgressJson(stream);
    navigator.clipboard?.writeText(json);
    alert("Progress JSON copied to clipboard.");
  };
  app.appendChild(exportBtn);

  for (const track of catalog.tracks || []) {
    const section = document.createElement("section");
    section.className = "track";
    const pct = trackProgressPercent(track, catalog, progress);
    section.innerHTML = `<h2>${track.title} <span class="pct">${pct}%</span></h2>`;

    if (track.id === "power-user") {
      renderPowerUserSection(track, catalog, progress, section);
    } else {
      for (const lid of track.lessonIds) {
        const lesson = catalog.lessons?.find((l) => l.id === lid);
        if (!lesson) continue;
        const pre = prerequisitesMet(lid, catalog, progress);
        const a = document.createElement("a");
        a.className = "lesson-card" + (completed[lid] ? " done" : "");
        a.href = `lesson.html?id=${lid}`;
        a.textContent = `${lid}: ${lesson.title} (${lesson.level || ""})`;
        if (!pre.ok) {
          a.classList.add("locked");
          a.title = `Prerequisites: ${pre.missing.join(", ")}`;
        }
        section.appendChild(a);
      }
    }
    app.appendChild(section);
  }
}

async function init() {
  document.title = title;
  const tagEl = document.querySelector(".stream");
  if (tagEl) tagEl.innerHTML = tagline;

  const params = new URLSearchParams(location.search);
  const lessonId = params.get("id");
  try {
    if (lessonId) await renderLesson(lessonId);
    else renderHome(await api("/catalog"));
  } catch (err) {
    document.getElementById("app").textContent = "Failed to load: " + err.message;
  }
}

init();
