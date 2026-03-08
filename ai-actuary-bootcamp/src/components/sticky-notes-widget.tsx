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

// ---------------------------------------------------------------------------
// ID helper
// ---------------------------------------------------------------------------

function newId() {
  return `sn_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}

// ---------------------------------------------------------------------------
// Default spawn position — staggered so notes don't pile exactly on each other
// ---------------------------------------------------------------------------

function spawnPosition(count: number): { x: number; y: number } {
  const base = { x: 80, y: 120 };
  const offset = (count % 6) * 32;
  return { x: base.x + offset, y: base.y + offset };
}

// ---------------------------------------------------------------------------
// Debounce helper
// ---------------------------------------------------------------------------

// (Debounce is now handled inside useStudentState.updateStickyNotes — no
//  widget-level debounce needed.)

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function StickyNotesWidget() {
  const { user } = useAuth();
  // stickyNotes is the single source of truth for rendering.
  // updateStickyNotes updates React state + localStorage immediately and
  // debounces the Firestore write to 1.5 s inside the hook.
  const { stickyNotes, updateStickyNotes } = useStudentState();

  const [open, setOpen] = useState(false);
  const [activeColor, setActiveColor] = useState<StickyColor>("yellow");

  function applyUpdate(next: StickyNote[]) {
    updateStickyNotes(next);
  }

  // ---- CRUD ----

  function addNote() {
    const pos = spawnPosition(stickyNotes.length);
    const note: StickyNote = {
      id: newId(),
      content: "",
      color: activeColor,
      x: pos.x,
      y: pos.y,
      width: 220,
      height: 180,
      createdAt: Date.now(),
    };
    applyUpdate([...stickyNotes, note]);
  }

  function updateContent(id: string, content: string) {
    applyUpdate(stickyNotes.map((n) => (n.id === id ? { ...n, content } : n)));
  }

  function updatePosition(id: string, x: number, y: number) {
    applyUpdate(stickyNotes.map((n) => (n.id === id ? { ...n, x, y } : n)));
  }

  function updateSize(id: string, width: number, height: number) {
    applyUpdate(stickyNotes.map((n) => (n.id === id ? { ...n, width, height } : n)));
  }

  function updateColor(id: string, color: StickyColor) {
    applyUpdate(stickyNotes.map((n) => (n.id === id ? { ...n, color } : n)));
  }

  function deleteNote(id: string) {
    applyUpdate(stickyNotes.filter((n) => n.id !== id));
  }

  if (!user) return null;

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Floating sticky notes — always rendered when open                  */}
      {/* ------------------------------------------------------------------ */}
      {open &&
        stickyNotes.map((note) => {
          const col = getColor(note.color);
          return (
            <Rnd
              key={note.id}
              default={{
                x: note.x,
                y: note.y,
                width: note.width,
                height: note.height,
              }}
              position={{ x: note.x, y: note.y }}
              size={{ width: note.width, height: note.height }}
              minWidth={160}
              minHeight={120}
              bounds="window"
              dragHandleClassName="sticky-drag-handle"
              onDragStop={(_e, d) => updatePosition(note.id, d.x, d.y)}
              onResizeStop={(_e, _dir, ref, _delta, pos) => {
                updateSize(note.id, ref.offsetWidth, ref.offsetHeight);
                updatePosition(note.id, pos.x, pos.y);
              }}
              style={{ zIndex: 9999 }}
            >
              <div
                className="flex h-full w-full flex-col rounded-2xl shadow-[0_8px_28px_rgba(22,27,45,0.14)] overflow-hidden"
                style={{ background: col.bg, border: `1.5px solid ${col.border}` }}
              >
                {/* Drag handle bar */}
                <div
                  className="sticky-drag-handle flex items-center justify-between px-3 py-2 cursor-grab active:cursor-grabbing select-none"
                  style={{ background: col.border + "80" }}
                >
                  {/* Color swatches */}
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
                  {/* Delete */}
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

                {/* Text area */}
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

      {/* ------------------------------------------------------------------ */}
      {/* FAB pill — bottom-left                                             */}
      {/* ------------------------------------------------------------------ */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2">
        {/* "New note" quick-add — only when panel is open */}
        {open && (
          <div className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 shadow-[0_8px_28px_rgba(22,27,45,0.10)]">
            {/* Color picker */}
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
              onClick={addNote}
              className="flex items-center gap-1.5 text-xs font-semibold text-[var(--foreground)] transition hover:text-[var(--accent)]"
              title="Nova nota"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Nova nota
            </button>
            {stickyNotes.length > 0 && (
              <>
                <div className="h-4 w-px bg-[var(--border)]" />
                <span className="text-[10px] text-[var(--muted-foreground)]">
                  {stickyNotes.length} nota{stickyNotes.length !== 1 ? "s" : ""}
                </span>
              </>
            )}
          </div>
        )}

        {/* FAB pill */}
        <button
          onClick={() => setOpen((p) => !p)}
          className="flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-white px-4 py-2.5 text-[var(--foreground)] shadow-[0_8px_28px_rgba(22,27,45,0.12)] transition hover:border-[var(--accent-soft)] hover:bg-[var(--surface-subtle)]"
          title="Notas"
        >
          {/* Dot — pulsing when notes exist */}
          <span className="relative flex h-2 w-2 items-center justify-center">
            {stickyNotes.length > 0 && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
            )}
            <span
              className="relative inline-flex h-2 w-2 rounded-full"
              style={{ background: stickyNotes.length > 0 ? "#f59e0b" : "var(--muted-foreground)" }}
            />
          </span>
          <span className="text-xs font-semibold tracking-wide">Notas</span>
          {open ? (
            <svg className="h-3.5 w-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          ) : (
            <svg className="h-3.5 w-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </svg>
          )}
        </button>
      </div>
    </>
  );
}
