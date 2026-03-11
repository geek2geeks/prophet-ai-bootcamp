"use client";

import { useState } from "react";

import { AiTutorWidget } from "@/components/ai-tutor-widget";
import { useAuth } from "@/lib/auth-context";
import { useStudentState } from "@/lib/use-student-state";
import { useIsMobile } from "@/lib/use-is-mobile";

export function MobileWorkspaceDock() {
  const { user } = useAuth();
  const { stickyNotes } = useStudentState();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<"notes" | "tutor">("notes");

  if (!user || !isMobile) {
    return null;
  }

  return (
    <>
      {open ? (
        <div className="mobile-dock-sheet fixed inset-x-3 bottom-20 z-50 rounded-[1.8rem] border border-[var(--border)] bg-[rgba(255,252,247,0.96)] p-4 shadow-[0_24px_60px_rgba(22,27,45,0.16)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                Acesso rapido
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                {activePanel === "notes" ? "Notas rapidas" : "Peter · AI Tutor"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--muted-foreground)]"
            >
              Fechar
            </button>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => setActivePanel("notes")}
              className={`flex-1 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] ${activePanel === "notes" ? "bg-[var(--accent)] text-white" : "border border-[var(--border)] bg-white text-[var(--muted-foreground)]"}`}
            >
              Notas
            </button>
            <button
              type="button"
              onClick={() => setActivePanel("tutor")}
              className={`flex-1 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] ${activePanel === "tutor" ? "bg-[var(--accent)] text-white" : "border border-[var(--border)] bg-white text-[var(--muted-foreground)]"}`}
            >
              Peter
            </button>
          </div>

          <div className="mt-4">
            {activePanel === "notes" ? (
              <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4 text-sm leading-7 text-[var(--muted-foreground)]">
                <p className="font-semibold text-[var(--foreground)]">{stickyNotes.length} nota{stickyNotes.length !== 1 ? "s" : ""} guardada{stickyNotes.length !== 1 ? "s" : ""}</p>
                <p className="mt-2">Usa esta area para consultar notas recentes no telemovel. Se precisares de editar com mais liberdade, continua no desktop.</p>
              </div>
            ) : (
              <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-2">
                <AiTutorWidget mobileEmbedded />
              </div>
            )}
          </div>
        </div>
      ) : null}

      <div className="fixed inset-x-3 bottom-4 z-50 md:hidden">
        <div className="flex items-center justify-between rounded-full border border-[var(--border)] bg-[rgba(255,252,247,0.96)] px-4 py-3 shadow-[0_18px_44px_rgba(22,27,45,0.12)] backdrop-blur-xl">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
              Dock do aluno
            </p>
            <p className="text-sm font-semibold text-[var(--foreground)]">Notas + Peter num unico sitio</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="button-primary px-4 py-2 text-sm"
          >
            {open ? "Fechar" : "Abrir"}
          </button>
        </div>
      </div>
    </>
  );
}
