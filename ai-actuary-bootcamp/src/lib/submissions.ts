export type SubmissionRecord = {
  id: string;
  missionId: string;
  missionTitle: string;
  summary: string;
  artifactTitle: string;
  fileName: string | null;
  filePath: string | null;
  fileSize: number | null;
  fileType: string | null;
  fileUrl: string | null;
  userId: string;
  userName: string;
  userEmail: string;
  createdAtMs: number;
  createdAtLabel: string;
  source: "cloud" | "local";
  status: "enviado" | "local";
};

export type SubmissionDraft = {
  missionId: string;
  missionTitle: string;
  summary: string;
  artifactTitle: string;
  fileName: string | null;
  filePath: string | null;
  fileSize: number | null;
  fileType: string | null;
  fileUrl: string | null;
  userId: string;
  userName: string;
  userEmail: string;
  createdAtMs: number;
};

const LOCAL_PREFIX = "mission-submissions";

function buildLocalKey(missionId: string, userId: string) {
  return `${LOCAL_PREFIX}:${missionId}:${userId}`;
}

function hasWindow() {
  return typeof window !== "undefined";
}

function createLocalId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `local-${crypto.randomUUID()}`;
  }

  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function formatSubmissionTime(timestamp: number) {
  const value = new Date(timestamp);
  const day = String(value.getDate()).padStart(2, "0");
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const year = value.getFullYear();
  const hours = String(value.getHours()).padStart(2, "0");
  const minutes = String(value.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export function buildSubmissionRecord(
  id: string,
  draft: SubmissionDraft,
  source: SubmissionRecord["source"],
  status: SubmissionRecord["status"],
): SubmissionRecord {
  return {
    id,
    ...draft,
    createdAtLabel: formatSubmissionTime(draft.createdAtMs),
    source,
    status,
  };
}

export function readLocalSubmissions(missionId: string, userId: string) {
  if (!hasWindow()) {
    return [] as SubmissionRecord[];
  }

  try {
    const stored = window.localStorage.getItem(buildLocalKey(missionId, userId));

    if (!stored) {
      return [] as SubmissionRecord[];
    }

    const parsed = JSON.parse(stored) as SubmissionRecord[];
    return parsed.sort((left, right) => right.createdAtMs - left.createdAtMs);
  } catch {
    return [] as SubmissionRecord[];
  }
}

export function saveLocalSubmission(draft: SubmissionDraft) {
  if (!hasWindow()) {
    return buildSubmissionRecord(createLocalId(), draft, "local", "local");
  }

  const entry = buildSubmissionRecord(createLocalId(), draft, "local", "local");
  const existing = readLocalSubmissions(draft.missionId, draft.userId);
  const next = [entry, ...existing].slice(0, 8);

  try {
    window.localStorage.setItem(
      buildLocalKey(draft.missionId, draft.userId),
      JSON.stringify(next),
    );
  } catch {
    return entry;
  }

  return entry;
}

export function mergeSubmissionRecords(
  remoteRecords: SubmissionRecord[],
  localRecords: SubmissionRecord[],
) {
  const merged = new Map<string, SubmissionRecord>();

  [...localRecords, ...remoteRecords].forEach((record) => {
    merged.set(record.id, record);
  });

  return Array.from(merged.values())
    .sort((left, right) => right.createdAtMs - left.createdAtMs)
    .slice(0, 8);
}
