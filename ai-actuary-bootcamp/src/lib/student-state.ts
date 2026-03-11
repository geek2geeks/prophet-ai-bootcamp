export const PROGRESS_KEY = "aibootcamp-progress-v2";
export const STICKY_NOTES_KEY = "aibootcamp-sticky-notes-v1";

// ---------------------------------------------------------------------------
// Evidence-based progress model
// ---------------------------------------------------------------------------

export type EvidenceStatus = "done" | "submitted" | "reviewed";

export type ProgressEntry = {
  /** Whether the item is marked complete */
  done: boolean;
  /** Timestamp of completion */
  completedAt?: number;
  /** Evidence status — "done" = checkbox only, "submitted" = proof attached, "reviewed" = tutor/admin verified */
  evidence?: EvidenceStatus;
  /** Brief note about what was produced (optional, student-written) */
  note?: string;
};

/** New evidence-based progress map */
export type ProgressMap = Record<string, ProgressEntry>;

/** Legacy boolean map from v1 — used for migration */
export type LegacyProgressMap = Record<string, boolean>;

// ---------------------------------------------------------------------------
// Migration helper — converts old boolean map to new ProgressEntry map
// ---------------------------------------------------------------------------

export function migrateProgress(raw: unknown): ProgressMap {
  if (!raw || typeof raw !== "object") return {};
  const result: ProgressMap = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof value === "boolean") {
      // Legacy v1 entry
      result[key] = { done: value, evidence: value ? "done" : undefined };
    } else if (value && typeof value === "object" && "done" in value) {
      // Already v2 entry
      result[key] = value as ProgressEntry;
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// Convenience helpers
// ---------------------------------------------------------------------------

/** Check if an item is done (works with both old boolean and new ProgressEntry) */
export function isItemDone(progress: ProgressMap, id: string): boolean {
  const entry = progress[id];
  if (!entry) return false;
  return entry.done;
}

/** Check if an item has evidence submitted */
export function hasEvidence(progress: ProgressMap, id: string): boolean {
  const entry = progress[id];
  if (!entry) return false;
  return entry.evidence === "submitted" || entry.evidence === "reviewed";
}

/** Count completed items */
export function countDone(progress: ProgressMap): number {
  return Object.values(progress).filter((e) => e.done).length;
}

/** Convert to boolean map for backward-compatible reads (e.g. tutor context) */
export function toBooleanMap(progress: ProgressMap): Record<string, boolean> {
  const result: Record<string, boolean> = {};
  for (const [key, entry] of Object.entries(progress)) {
    result[key] = entry.done;
  }
  return result;
}

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

const LEGACY_PROGRESS_KEY = "aibootcamp-progress-v1";

export function readProgress(): ProgressMap {
  // Try v2 first
  const v2 = readJson<ProgressMap | null>(PROGRESS_KEY, null);
  if (v2) return v2;
  // Fall back to v1 and migrate
  const v1 = readJson<LegacyProgressMap | null>(LEGACY_PROGRESS_KEY, null);
  if (v1) {
    const migrated = migrateProgress(v1);
    writeProgress(migrated);
    return migrated;
  }
  return {};
}

export function writeProgress(progress: ProgressMap) {
  writeJson(PROGRESS_KEY, progress);
}
