"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { StickyNotesPanel, StickyNotesFloating } from "@/components/sticky-notes-widget";
import { AiTutorWidget } from "@/components/ai-tutor-widget";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Tab = "notes" | "peter";

// ---------------------------------------------------------------------------
// WorkspaceDrawer
// ---------------------------------------------------------------------------

export function WorkspaceDrawer() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("peter");

  const toggle = useCallback(() => setOpen((prev) => !prev), []);

  if (!user) return null;

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Floating sticky notes rendered over the page when Notes tab active  */}
      {/* ------------------------------------------------------------------ */}
      <StickyNotesFloating notesOpen={open && tab === "notes"} />

      {/* ------------------------------------------------------------------ */}
      {/* Drawer panel                                                        */}
      {/* ------------------------------------------------------------------ */}
      {open && (
        <div className="fixed inset-x-3 bottom-24 z-50 flex max-h-[calc(100vh-7.5rem)] w-auto flex-col rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] shadow-[0_24px_60px_rgba(22,27,45,0.14)] sm:inset-x-auto sm:bottom-20 sm:right-6 sm:max-h-none sm:w-[calc(100vw-3rem)] sm:max-w-[26rem]">
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-[1.75rem] border-b border-[var(--border)] bg-[var(--surface-subtle)] px-5 py-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                Workspace
              </p>
              <p className="text-sm font-semibold text-[var(--foreground)]">
                {tab === "notes" ? "Notas rapidas" : "Peter · AI Tutor"}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 text-[var(--muted-foreground)] transition hover:bg-white hover:text-[var(--foreground)]"
              title="Fechar"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-[var(--border)] px-4 py-2">
            <button
              type="button"
              onClick={() => setTab("notes")}
              className={`flex-1 rounded-full px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                tab === "notes"
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              Notas
            </button>
            <button
              type="button"
              onClick={() => setTab("peter")}
              className={`flex-1 rounded-full px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                tab === "peter"
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              Peter
            </button>
          </div>

          {/* Tab content */}
          <div className="min-h-0 flex-1 overflow-hidden rounded-b-[1.75rem] sm:h-[28rem] sm:flex-none">
            {tab === "notes" ? (
              <div className="h-full overflow-y-auto">
                <StickyNotesPanel />
              </div>
            ) : (
              <AiTutorWidget embedded />
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* FAB — single bottom-right pill                                      */}
      {/* ------------------------------------------------------------------ */}
      <div className="fixed bottom-20 right-3 z-50 sm:bottom-6 sm:right-6">
        <button
          onClick={toggle}
          className="flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2.5 text-white shadow-[0_8px_30px_rgba(124,63,88,0.4)] transition hover:bg-[var(--accent-strong)] hover:shadow-[0_12px_36px_rgba(124,63,88,0.5)]"
          title="Workspace"
        >
          <span className="relative flex h-2 w-2 items-center justify-center">
            {open && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
            )}
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white opacity-90" />
          </span>
          <span className="text-xs font-semibold tracking-wide">
            {open ? "Fechar" : "Workspace"}
          </span>
          {open ? (
            <svg className="h-3.5 w-3.5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          ) : (
            <svg className="h-3.5 w-3.5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          )}
        </button>
      </div>
    </>
  );
}
