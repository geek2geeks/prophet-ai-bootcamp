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

export function useStudentState() {
  const { user } = useAuth();
  const [progress, setProgressState] = useState<ProgressMap>(() => typeof window !== "undefined" ? readProgress() : {});
  const [stickyNotes, setStickyNotesState] = useState<StickyNote[]>(() => typeof window !== "undefined" ? readStickyNotes() : []);
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
            const data = docSnap.data();
            const p = data.progress || {};
            const sn = (data.stickyNotes || []) as StickyNote[];

            setProgressState(p);
            setStickyNotesState(sn);

            // Sync to local storage for offline use
            writeProgress(p);
            writeStickyNotes(sn);
          } else {
            // First time login, push local storage to firestore
            await setDoc(docRef, {
              progress: readProgress(),
              stickyNotes: readStickyNotes(),
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
    loading,
  };
}
