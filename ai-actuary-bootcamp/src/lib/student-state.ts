export const PROGRESS_KEY = "aibootcamp-progress-v1";
export const STICKY_NOTES_KEY = "aibootcamp-sticky-notes-v1";

export type ProgressMap = Record<string, boolean>;

export type StickyColor = "yellow" | "rose" | "sky" | "sage" | "lavender";

export interface StickyNote {
  id: string;
  content: string;
  color: StickyColor;
  x: number;
  y: number;
  width: number;
  height: number;
  createdAt: number;
}

export function readStickyNotes(): StickyNote[] {
  return readJson<StickyNote[]>(STICKY_NOTES_KEY, []);
}

export function writeStickyNotes(notes: StickyNote[]) {
  writeJson(STICKY_NOTES_KEY, notes);
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
}

export function readProgress(): ProgressMap {
  return readJson<ProgressMap>(PROGRESS_KEY, {});
}

export function writeProgress(progress: ProgressMap) {
  writeJson(PROGRESS_KEY, progress);
}
