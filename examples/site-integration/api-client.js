/**
 * Example: call the training API from your site (vanilla JS).
 * Set API_BASE to your deployed origin.
 */
const API_BASE = "https://steele-bz.pages.dev";

export async function fetchCatalog() {
  const res = await fetch(`${API_BASE}/api/v1/catalog`);
  if (!res.ok) throw new Error(`catalog ${res.status}`);
  return res.json();
}

export async function fetchLesson(id) {
  const res = await fetch(`${API_BASE}/api/v1/lessons/${id}`);
  if (!res.ok) throw new Error(`lesson ${res.status}`);
  return res.json();
}

export async function submitQuiz(id, answers) {
  const res = await fetch(`${API_BASE}/api/v1/lessons/${id}/quiz`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });
  if (!res.ok) throw new Error(`quiz ${res.status}`);
  return res.json();
}

// Progress stays on your site
const PROGRESS_KEY = "cursor-training-progress";

export function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveLessonComplete(id, score) {
  const p = loadProgress();
  p.completed = p.completed || {};
  p.completed[id] = { score, at: new Date().toISOString() };
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
}
