"use client";

import { useState } from "react";
import { Rnd } from "react-rnd";
import { useAuth } from "@/lib/auth-context";
import { useStudentState } from "@/lib/use-student-state";
import { type StickyColor, type StickyNote } from "@/lib/student-state";

// ---------------------------------------------------------------------------
// Colour palette
// ---------------------------------------------------------------------------

const COLORS: { id: StickyColor; bg: string; border: string; dot: string; text: string }[] = [
  { id: "yellow",   bg: "#fffbeb", border: "#fde68a", dot: "#f59e0b", text: "#78350f" },
  { id: "rose",     bg: "#fff1f2", border: "#fecdd3", dot: "#f43f5e", text: "#881337" },
  { id: "sky",      bg: "#f0f9ff", border: "#bae6fd", dot: "#0ea5e9", text: "#0c4a6e" },
  { id: "sage",     bg: "#f0fdf4", border: "#bbf7d0", dot: "#22c55e", text: "#14532d" },
  { id: "lavender", bg: "#faf5ff", border: "#e9d5ff", dot: "#a855f7", text: "#581c87" },
];

function getColor(id: StickyColor) {
  return COLORS.find((c) => c.id === id) ?? COLORS[0];
}

function newId() {
  return `sn_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

function spawnPosition(count: number): { x: number; y: number } {
  const base = { x: 80, y: 120 };
  const offset = (count % 6) * 32;
  return { x: base.x + offset, y: base.y + offset };
}

// ---------------------------------------------------------------------------
// Shared hook — extracted so both exports share state
// ---------------------------------------------------------------------------

function useStickyNotes() {
  const { stickyNotes, updateStickyNotes } = useStudentState();

  function applyUpdate(next: StickyNote[] | ((current: StickyNote[]) => StickyNote[])) {
    updateStickyNotes(next);
  }

  function addNote(color: StickyColor) {
    applyUpdate((current) => {
      const pos = spawnPosition(current.length);
      const note: StickyNote = {
        id: newId(),
        content: "",
        color,
        x: pos.x,
        y: pos.y,
        width: 220,
        height: 180,
        createdAt: Date.now(),
      };
      return [...current, note];
    });
  }

  function updateContent(id: string, content: string) {
    applyUpdate((current) => current.map((n) => (n.id === id ? { ...n, content } : n)));
  }

  function updatePosition(id: string, x: number, y: number) {
    applyUpdate((current) => current.map((n) => (n.id === id ? { ...n, x, y } : n)));
  }

  function updateFrame(id: string, patch: Partial<Pick<StickyNote, "x" | "y" | "width" | "height">>) {
    applyUpdate((current) => current.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  }

  function updateColor(id: string, color: StickyColor) {
    applyUpdate((current) => current.map((n) => (n.id === id ? { ...n, color } : n)));
  }

  function deleteNote(id: string) {
    applyUpdate((current) => current.filter((n) => n.id !== id));
  }

  return { stickyNotes, addNote, updateContent, updatePosition, updateFrame, updateColor, deleteNote };
}

// ---------------------------------------------------------------------------
// StickyNotesFloating — renders draggable cards over the full page
// ---------------------------------------------------------------------------

export function StickyNotesFloating({ notesOpen }: { notesOpen: boolean }) {
  const { user } = useAuth();
  const { stickyNotes, updateContent, updatePosition, updateFrame, updateColor, deleteNote } = useStickyNotes();

  if (!user || !notesOpen) return null;

  return (
    <>
      {stickyNotes.map((note) => {
        const col = getColor(note.color);
        return (
          <Rnd
            key={note.id}
            default={{ x: note.x, y: note.y, width: note.width, height: note.height }}
            position={{ x: note.x, y: note.y }}
            size={{ width: note.width, height: note.height }}
            minWidth={160}
            minHeight={120}
            bounds="window"
            dragHandleClassName="sticky-drag-handle"
            onDragStop={(_e, d) => updatePosition(note.id, d.x, d.y)}
            onResizeStop={(_e, _dir, ref, _delta, pos) =>
              updateFrame(note.id, { width: ref.offsetWidth, height: ref.offsetHeight, x: pos.x, y: pos.y })
            }
            style={{ zIndex: 9999 }}
          >
            <div
              className="flex h-full w-full flex-col rounded-2xl shadow-[0_8px_28px_rgba(22,27,45,0.14)] overflow-hidden"
              style={{ background: col.bg, border: `1.5px solid ${col.border}` }}
            >
              <div
                className="sticky-drag-handle flex items-center justify-between px-3 py-2 cursor-grab active:cursor-grabbing select-none"
                style={{ background: col.border + "80" }}
              >
                <div className="flex items-center gap-1">
                  {COLORS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => updateColor(note.id, c.id)}
                      className="h-3 w-3 rounded-full transition hover:scale-125"
                      style={{
                        background: c.dot,
                        outline: note.color === c.id ? `2px solid ${c.dot}` : "none",
                        outlineOffset: "1px",
                      }}
                      title={c.id}
                    />
                  ))}
                </div>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="flex h-5 w-5 items-center justify-center rounded-full text-xs opacity-50 transition hover:opacity-100"
                  style={{ color: col.text }}
                  title="Apagar nota"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <textarea
                value={note.content}
                onChange={(e) => updateContent(note.id, e.target.value)}
                placeholder="Escreve aqui..."
                className="flex-1 resize-none bg-transparent px-3 py-2 text-sm leading-6 outline-none placeholder:opacity-40"
                style={{ color: col.text }}
              />
            </div>
          </Rnd>
        );
      })}
    </>
  );
}

// ---------------------------------------------------------------------------
// StickyNotesPanel — embedded tab content inside WorkspaceDrawer
// ---------------------------------------------------------------------------

export function StickyNotesPanel() {
  const { stickyNotes, addNote, deleteNote, updateContent } = useStickyNotes();
  const [activeColor, setActiveColor] = useState<StickyColor>("yellow");

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] px-3 py-2.5">
        <div className="flex items-center gap-1.5">
          {COLORS.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveColor(c.id)}
              className="h-4 w-4 rounded-full transition hover:scale-125"
              style={{
                background: c.dot,
                outline: activeColor === c.id ? `2px solid ${c.dot}` : "none",
                outlineOffset: "2px",
              }}
              title={c.id}
            />
          ))}
        </div>
        <div className="h-4 w-px bg-[var(--border)]" />
        <button
          onClick={() => addNote(activeColor)}
          className="flex items-center gap-1.5 text-xs font-semibold text-[var(--foreground)] transition hover:text-[var(--accent)]"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nova nota
        </button>
        <div className="h-4 w-px bg-[var(--border)]" />
        <span className="ml-auto text-[10px] text-[var(--muted-foreground)]">
          {stickyNotes.length} nota{stickyNotes.length !== 1 ? "s" : ""}
        </span>
      </div>

      {stickyNotes.length === 0 ? (
        <p className="mt-4 text-center text-xs text-[var(--muted-foreground)]">
          Sem notas ainda. Cria a primeira acima.
        </p>
      ) : (
        <div className="max-h-80 space-y-2 overflow-y-auto">
          {[...stickyNotes]
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((note) => {
              const col = getColor(note.color);
              return (
                <div
                  key={note.id}
                  className="relative rounded-xl p-3"
                  style={{ background: col.bg, border: `1.5px solid ${col.border}` }}
                >
                  <textarea
                    value={note.content}
                    onChange={(e) => updateContent(note.id, e.target.value)}
                    placeholder="Escreve aqui..."
                    rows={2}
                    className="w-full resize-none bg-transparent text-xs leading-5 outline-none placeholder:opacity-40"
                    style={{ color: col.text }}
                  />
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="absolute right-2 top-2 opacity-30 transition hover:opacity-80"
                    style={{ color: col.text }}
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
        </div>
      )}

      <p className="text-center text-[10px] text-[var(--muted-foreground)]">
        As notas flutuantes aparecem no ecra quando o drawer esta aberto.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Legacy export — kept so old import in layout.tsx doesn't break immediately
// (Will be removed once WorkspaceDrawer replaces it in layout.tsx)
// ---------------------------------------------------------------------------

export function StickyNotesWidget() {
  return null;
}
