const KEY_PREFIX = "cursor-training-";

export function progressKey(stream) {
  return `${KEY_PREFIX}${stream}`;
}

export function getProgress(stream) {
  try {
    return JSON.parse(localStorage.getItem(progressKey(stream)) || "{}");
  } catch {
    return {};
  }
}

export function saveProgress(stream, data) {
  localStorage.setItem(progressKey(stream), JSON.stringify(data));
}

export function exportProgressJson(stream) {
  return JSON.stringify(getProgress(stream), null, 2);
}
