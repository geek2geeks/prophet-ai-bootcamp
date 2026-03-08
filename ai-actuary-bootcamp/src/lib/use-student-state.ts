"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "./auth-context";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import {
  readProgress,
  writeProgress,
  readStickyNotes,
  writeStickyNotes,
  ProgressMap,
  StickyNote,
} from "./student-state";
import type { Day1AnswerMap, Day1ReviewMap } from "./day1-review";

type StudentDocument = {
  progress?: ProgressMap;
  stickyNotes?: StickyNote[];
  day1Answers?: Day1AnswerMap;
  day1Reviews?: Day1ReviewMap;
};

export function useStudentState() {
  const { user } = useAuth();
  const [progress, setProgressState] = useState<ProgressMap>(() => typeof window !== "undefined" ? readProgress() : {});
  const [stickyNotes, setStickyNotesState] = useState<StickyNote[]>(() => typeof window !== "undefined" ? readStickyNotes() : []);
  const [day1Answers, setDay1AnswersState] = useState<Day1AnswerMap>({});
  const [day1Reviews, setDay1ReviewsState] = useState<Day1ReviewMap>({});
  const [loading, setLoading] = useState(true);

  // Debounce timer for sticky notes Firestore writes — avoids a write per
  // keystroke/drag while still keeping React state and localStorage instant.
  const stickyDebounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function loadData() {
      if (user) {
        try {
          const docRef = doc(db, "students", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as StudentDocument;
            const p = data.progress || {};
            const sn = (data.stickyNotes || []) as StickyNote[];
            const answers = (data.day1Answers || {}) as Day1AnswerMap;
            const reviews = (data.day1Reviews || {}) as Day1ReviewMap;

            setProgressState(p);
            setStickyNotesState(sn);
            setDay1AnswersState(answers);
            setDay1ReviewsState(reviews);

            // Sync to local storage for offline use
            writeProgress(p);
            writeStickyNotes(sn);
          } else {
            // First time login, push local storage to firestore
            await setDoc(docRef, {
              progress: readProgress(),
              stickyNotes: readStickyNotes(),
              day1Answers: {},
              day1Reviews: {},
            });
          }
        } catch (err) {
          console.error("Failed to load state from Firestore:", err);
        }
      } else {
        // Not logged in, rely on local storage
        setProgressState(readProgress());
        setStickyNotesState(readStickyNotes());
      }
      setLoading(false);
    }
    loadData();
  }, [user]);

  const updateProgress = async (newProgress: ProgressMap) => {
    setProgressState(newProgress);
    writeProgress(newProgress);
    if (user) {
      const docRef = doc(db, "students", user.uid);
      await setDoc(docRef, { progress: newProgress }, { merge: true });
    }
  };

  const updateStickyNotes = (notes: StickyNote[]) => {
    // Immediate: update React state + localStorage for snappy UI.
    setStickyNotesState(notes);
    writeStickyNotes(notes);
    // Debounced: write to Firestore 1.5 s after the last call so rapid
    // drag/resize/keypress events are coalesced into a single network round-trip.
    if (stickyDebounceTimer.current) clearTimeout(stickyDebounceTimer.current);
    stickyDebounceTimer.current = setTimeout(() => {
      if (user) {
        const docRef = doc(db, "students", user.uid);
        void setDoc(docRef, { stickyNotes: notes }, { merge: true });
      }
    }, 1500);
  };

  const updateDay1Answer = async (itemId: string, answer: string) => {
    const next = { ...day1Answers, [itemId]: answer };
    setDay1AnswersState(next);
    if (user) {
      const docRef = doc(db, "students", user.uid);
      await setDoc(docRef, { day1Answers: next }, { merge: true });
    }
  };

  const updateDay1Review = async (itemId: string, review: Day1ReviewMap[string]) => {
    const next = { ...day1Reviews, [itemId]: review };
    setDay1ReviewsState(next);
    if (user) {
      const docRef = doc(db, "students", user.uid);
      await setDoc(docRef, { day1Reviews: next }, { merge: true });
    }
  };

  const toggleProgress = async (id: string, checked: boolean) => {
    const next = { ...progress, [id]: checked };
    await updateProgress(next);
  };

  return {
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
  };
}
