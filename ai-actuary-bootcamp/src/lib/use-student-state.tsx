"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { useAuth } from "./auth-context";
import type { Day1AnswerMap, Day1ReviewMap } from "./day1-review";
import { db } from "./firebase";
import {
  type ProgressMap,
  readProgress,
  readStickyNotes,
  type StickyNote,
  writeProgress,
  writeStickyNotes,
} from "./student-state";

type StudentDocument = {
  progress?: ProgressMap;
  stickyNotes?: StickyNote[];
  day1Answers?: Day1AnswerMap;
  day1Reviews?: Day1ReviewMap;
};

type StickyNotesUpdater = StickyNote[] | ((current: StickyNote[]) => StickyNote[]);

type StudentStateValue = {
  progress: ProgressMap;
  updateProgress: (newProgress: ProgressMap) => Promise<void>;
  toggleProgress: (id: string, checked: boolean) => Promise<void>;
  stickyNotes: StickyNote[];
  updateStickyNotes: (notes: StickyNotesUpdater) => void;
  day1Answers: Day1AnswerMap;
  updateDay1Answer: (itemId: string, answer: string) => Promise<void>;
  day1Reviews: Day1ReviewMap;
  updateDay1Review: (itemId: string, review: Day1ReviewMap[string]) => Promise<void>;
  loading: boolean;
};

const StudentStateContext = createContext<StudentStateValue | null>(null);

function stripUndefinedDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value
      .map((entry) => stripUndefinedDeep(entry))
      .filter((entry) => entry !== undefined);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).flatMap(([key, entry]) => {
        if (entry === undefined) {
          return [];
        }

        const nextEntry = stripUndefinedDeep(entry);
        return nextEntry === undefined ? [] : [[key, nextEntry]];
      }),
    );
  }

  return value;
}

function mergeStickyNotes(remoteNotes: StickyNote[], localNotes: StickyNote[]) {
  const merged = new Map<string, StickyNote>();

  for (const note of remoteNotes) {
    merged.set(note.id, note);
  }

  for (const note of localNotes) {
    merged.set(note.id, note);
  }

  return Array.from(merged.values()).sort((left, right) => left.createdAt - right.createdAt);
}

function resolveStickyNotesUpdate(current: StickyNote[], next: StickyNotesUpdater) {
  return typeof next === "function" ? next(current) : next;
}

export function StudentStateProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [progress, setProgressState] = useState<ProgressMap>(() =>
    typeof window !== "undefined" ? readProgress() : {},
  );
  const [stickyNotes, setStickyNotesState] = useState<StickyNote[]>(() =>
    typeof window !== "undefined" ? readStickyNotes() : [],
  );
  const [day1Answers, setDay1AnswersState] = useState<Day1AnswerMap>({});
  const [day1Reviews, setDay1ReviewsState] = useState<Day1ReviewMap>({});
  const [loading, setLoading] = useState(true);

  const stickyDebounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stickyDirtySinceHydration = useRef(false);
  const currentUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    currentUserIdRef.current = user?.uid ?? null;
  }, [user?.uid]);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);

      const localProgress = readProgress();
      const localStickyNotes = readStickyNotes();

      if (!user) {
        if (!cancelled) {
          setProgressState(localProgress);
          setStickyNotesState(localStickyNotes);
          setDay1AnswersState({});
          setDay1ReviewsState({});
          stickyDirtySinceHydration.current = false;
          setLoading(false);
        }
        return;
      }

      try {
        const docRef = doc(db, "students", user.uid);
        const docSnap = await getDoc(docRef);

        if (cancelled) {
          return;
        }

        if (docSnap.exists()) {
          const data = docSnap.data() as StudentDocument;
          const nextProgress = data.progress || {};
          const remoteStickyNotes = (data.stickyNotes || []) as StickyNote[];
          const nextStickyNotes = stickyDirtySinceHydration.current
            ? mergeStickyNotes(remoteStickyNotes, localStickyNotes)
            : remoteStickyNotes;
          const nextAnswers = stripUndefinedDeep(
            (data.day1Answers || {}) as Day1AnswerMap,
          ) as Day1AnswerMap;
          const nextReviews = stripUndefinedDeep(
            (data.day1Reviews || {}) as Day1ReviewMap,
          ) as Day1ReviewMap;

          setProgressState(nextProgress);
          setStickyNotesState(nextStickyNotes);
          setDay1AnswersState(nextAnswers);
          setDay1ReviewsState(nextReviews);

          writeProgress(nextProgress);
          writeStickyNotes(nextStickyNotes);
        } else {
          const bootstrapPayload = {
            progress: localProgress,
            stickyNotes: localStickyNotes,
            day1Answers: {},
            day1Reviews: {},
          };

          await setDoc(docRef, bootstrapPayload);

          if (cancelled) {
            return;
          }

          setProgressState(localProgress);
          setStickyNotesState(localStickyNotes);
          setDay1AnswersState({});
          setDay1ReviewsState({});
        }

        stickyDirtySinceHydration.current = false;
      } catch (error) {
        console.error("Failed to load state from Firestore:", error);

        if (!cancelled) {
          setProgressState(localProgress);
          setStickyNotesState(localStickyNotes);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    return () => {
      if (stickyDebounceTimer.current) {
        clearTimeout(stickyDebounceTimer.current);
      }
    };
  }, []);

  const updateProgress = useCallback(
    async (newProgress: ProgressMap) => {
      setProgressState(newProgress);
      writeProgress(newProgress);

      if (user) {
        const docRef = doc(db, "students", user.uid);
        await setDoc(docRef, { progress: newProgress }, { merge: true });
      }
    },
    [user],
  );

  const updateStickyNotes = useCallback((notes: StickyNotesUpdater) => {
    let nextNotes: StickyNote[] = [];

    setStickyNotesState((current) => {
      nextNotes = stripUndefinedDeep(resolveStickyNotesUpdate(current, notes)) as StickyNote[];
      return nextNotes;
    });

    stickyDirtySinceHydration.current = true;
    writeStickyNotes(nextNotes);

    if (stickyDebounceTimer.current) {
      clearTimeout(stickyDebounceTimer.current);
    }

    stickyDebounceTimer.current = setTimeout(() => {
      const userId = currentUserIdRef.current;

      if (!userId) {
        return;
      }

      const docRef = doc(db, "students", userId);
      void setDoc(docRef, { stickyNotes: nextNotes }, { merge: true });
    }, 1500);
  }, []);

  const updateDay1Answer = useCallback(
    async (itemId: string, answer: string) => {
      const next = stripUndefinedDeep({ ...day1Answers, [itemId]: answer }) as Day1AnswerMap;
      setDay1AnswersState(next);

      if (user) {
        const docRef = doc(db, "students", user.uid);
        await setDoc(docRef, { day1Answers: next }, { merge: true });
      }
    },
    [day1Answers, user],
  );

  const updateDay1Review = useCallback(
    async (itemId: string, review: Day1ReviewMap[string]) => {
      const next = stripUndefinedDeep({ ...day1Reviews, [itemId]: review }) as Day1ReviewMap;
      setDay1ReviewsState(next);

      if (user) {
        const docRef = doc(db, "students", user.uid);
        await setDoc(docRef, { day1Reviews: next }, { merge: true });
      }
    },
    [day1Reviews, user],
  );

  const toggleProgress = useCallback(
    async (id: string, checked: boolean) => {
      const next = { ...progress, [id]: checked };
      await updateProgress(next);
    },
    [progress, updateProgress],
  );

  const value = useMemo<StudentStateValue>(
    () => ({
      progress,
      updateProgress,
      toggleProgress,
      stickyNotes,
      updateStickyNotes,
      day1Answers,
      updateDay1Answer,
      day1Reviews,
      updateDay1Review,
      loading,
    }),
    [
      day1Answers,
      day1Reviews,
      loading,
      progress,
      stickyNotes,
      toggleProgress,
      updateDay1Answer,
      updateDay1Review,
      updateProgress,
      updateStickyNotes,
    ],
  );

  return <StudentStateContext.Provider value={value}>{children}</StudentStateContext.Provider>;
}

export function useStudentState() {
  const context = useContext(StudentStateContext);

  if (!context) {
    throw new Error("useStudentState must be used within StudentStateProvider");
  }

  return context;
}
