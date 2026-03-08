"use client";

import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { RouteGuard } from "@/components/route-guard";

// ─── Admin access list ────────────────────────────────────────────────────────
// For now: email-based allow-list. Expand to Firestore roles or custom claims later.
const ADMIN_EMAILS = ["pedro@stratfordgeek.com"];

type Keys = {
  deepseek: string;
  zai: string;
};

type StudentRecord = {
  id: string;
  email?: string;
  displayName?: string;
  completedCount: number;
  lastSeen?: string;
};

type SubmissionRecord = {
  id: string;
  userId: string;
  missionId: string;
  missionTitle?: string;
  submittedAt?: string;
  status?: string;
};

export default function AdminPage() {
  const { user } = useAuth();
  const isAdmin = Boolean(user?.email && ADMIN_EMAILS.includes(user.email));

  const [keys, setKeys] = useState<Keys>({ deepseek: "", zai: "" });
  const [keysLoading, setKeysLoading] = useState(true);
  const [keysSaving, setKeysSaving] = useState(false);
  const [keysSaved, setKeysSaved] = useState(false);
  const [keysError, setKeysError] = useState("");

  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(true);

  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [subsLoading, setSubsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<"keys" | "students" | "submissions">("keys");

  // Load shared keys
  useEffect(() => {
    if (!isAdmin) return;
    getDoc(doc(db, "config", "keys"))
      .then((snap) => {
        if (snap.exists()) {
          const data = snap.data() as Keys;
          setKeys({ deepseek: data.deepseek ?? "", zai: data.zai ?? "" });
        }
      })
      .catch(() => setKeysError("Erro ao carregar chaves."))
      .finally(() => setKeysLoading(false));
  }, [isAdmin]);

  // Load students
  useEffect(() => {
    if (!isAdmin) return;
    getDocs(collection(db, "students"))
      .then((snap) => {
        const records: StudentRecord[] = snap.docs.map((d) => {
          const data = d.data() as Record<string, unknown>;
          const progress = (data.progress as Record<string, boolean>) ?? {};
          return {
            id: d.id,
            email: data.email as string | undefined,
            displayName: data.displayName as string | undefined,
            completedCount: Object.values(progress).filter(Boolean).length,
            lastSeen: data.lastSeen as string | undefined,
          };
        });
        setStudents(records);
      })
      .catch(console.error)
      .finally(() => setStudentsLoading(false));
  }, [isAdmin]);

  // Load submissions
  useEffect(() => {
    if (!isAdmin) return;
    getDocs(query(collection(db, "submissions"), orderBy("submittedAt", "desc")))
      .then((snap) => {
        const records: SubmissionRecord[] = snap.docs.map((d) => {
          const data = d.data() as Record<string, unknown>;
          return {
            id: d.id,
            userId: data.userId as string,
            missionId: data.missionId as string,
            missionTitle: data.missionTitle as string | undefined,
            submittedAt: data.submittedAt as string | undefined,
            status: data.status as string | undefined,
          };
        });
        setSubmissions(records);
      })
      .catch(console.error)
      .finally(() => setSubsLoading(false));
  }, [isAdmin]);

  async function saveKeys() {
    if (!isAdmin) return;
    setKeysSaving(true);
    setKeysError("");
    try {
      await setDoc(doc(db, "config", "keys"), keys, { merge: true });
      setKeysSaved(true);
      setTimeout(() => setKeysSaved(false), 2500);
    } catch {
      setKeysError("Erro ao guardar chaves.");
    } finally {
      setKeysSaving(false);
    }
  }

  return (
    <RouteGuard>
      <main className="page-shell px-4 pb-28 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Header */}
          <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_18px_50px_rgba(22,27,45,0.06)] sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
              Administracao
            </p>
            <span className="ink-rule mt-3" aria-hidden="true" />
            <h1 className="mt-4 font-serif text-4xl leading-tight text-[var(--foreground)]">
              Painel de Administracao
            </h1>
            <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
              Gerir chaves de API partilhadas, consultar alunos e submissoes.
            </p>

            {!isAdmin ? (
              <div className="mt-6 rounded-[1.25rem] border border-red-200 bg-red-50 p-5 text-sm text-red-800">
                <p className="font-semibold">Acesso restrito.</p>
                <p className="mt-1">
                  Esta pagina e apenas para administradores. Se precisas de
                  acesso, contacta pedro@stratfordgeek.com.
                </p>
              </div>
            ) : (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-xs font-semibold text-green-700">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Sessao de administrador activa — {user?.email}
              </div>
            )}
          </section>

          {isAdmin ? (
            <>
              {/* Tabs */}
              <div className="flex gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2">
                {(
                  [
                    { key: "keys", label: "Chaves de API" },
                    { key: "students", label: `Alunos (${students.length})` },
                    {
                      key: "submissions",
                      label: `Submissoes (${submissions.length})`,
                    },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      activeTab === tab.key
                        ? "bg-[var(--accent)] text-white shadow-sm"
                        : "text-[var(--muted-foreground)] hover:bg-[var(--surface-subtle)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Keys tab */}
              {activeTab === "keys" ? (
                <section className="rounded-[1.8rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_18px_50px_rgba(22,27,45,0.06)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                    Chaves partilhadas
                  </p>
                  <h2 className="mt-3 text-xl font-semibold text-[var(--foreground)]">
                    Actualizar chaves de API
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                    Estas chaves sao armazenadas em Firestore em{" "}
                    <code className="rounded bg-[var(--surface-subtle)] px-1.5 py-0.5 text-xs">
                      config/keys
                    </code>{" "}
                    e mostradas a todos os alunos autenticados no Dia 0.
                  </p>

                  {keysLoading ? (
                    <p className="mt-5 text-sm text-[var(--muted-foreground)]">
                      A carregar...
                    </p>
                  ) : (
                    <div className="mt-6 space-y-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground)]">
                          DeepSeek API Key
                        </label>
                        <input
                          type="text"
                          value={keys.deepseek}
                          onChange={(e) =>
                            setKeys((k) => ({
                              ...k,
                              deepseek: e.target.value,
                            }))
                          }
                          className="mt-2 w-full rounded-[1rem] border border-[var(--border)] bg-[var(--surface-subtle)] px-4 py-3 font-mono text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
                          placeholder="sk-..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-[var(--foreground)]">
                          Z.ai API Key
                        </label>
                        <input
                          type="text"
                          value={keys.zai}
                          onChange={(e) =>
                            setKeys((k) => ({ ...k, zai: e.target.value }))
                          }
                          className="mt-2 w-full rounded-[1rem] border border-[var(--border)] bg-[var(--surface-subtle)] px-4 py-3 font-mono text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent-soft)]"
                          placeholder="6f95..."
                        />
                      </div>

                      {keysError ? (
                        <p className="text-sm text-red-600">{keysError}</p>
                      ) : null}

                      <button
                        onClick={() => void saveKeys()}
                        disabled={keysSaving}
                        className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:opacity-60"
                      >
                        {keysSaving
                          ? "A guardar..."
                          : keysSaved
                            ? "Guardado!"
                            : "Guardar chaves"}
                      </button>
                    </div>
                  )}
                </section>
              ) : null}

              {/* Students tab */}
              {activeTab === "students" ? (
                <section className="rounded-[1.8rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_18px_50px_rgba(22,27,45,0.06)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                    Alunos registados
                  </p>
                  <h2 className="mt-3 text-xl font-semibold text-[var(--foreground)]">
                    {students.length} aluno
                    {students.length !== 1 ? "s" : ""} no sistema
                  </h2>
                  {studentsLoading ? (
                    <p className="mt-5 text-sm text-[var(--muted-foreground)]">
                      A carregar...
                    </p>
                  ) : students.length === 0 ? (
                    <p className="mt-5 text-sm text-[var(--muted-foreground)]">
                      Nenhum aluno registado ainda.
                    </p>
                  ) : (
                    <div className="mt-5 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-[var(--border)] text-left">
                            <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                              UID
                            </th>
                            <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                              Email
                            </th>
                            <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                              Progresso
                            </th>
                            <th className="pb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                              Ultima visita
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                          {students.map((s) => (
                            <tr key={s.id}>
                              <td className="py-3 pr-4 font-mono text-xs text-[var(--muted-foreground)]">
                                {s.id.substring(0, 10)}…
                              </td>
                              <td className="py-3 pr-4 text-[var(--foreground)]">
                                {s.email ?? s.displayName ?? "—"}
                              </td>
                              <td className="py-3 pr-4">
                                <span className="rounded-full bg-[var(--surface-subtle)] px-2.5 py-1 text-xs font-semibold text-[var(--accent)]">
                                  {s.completedCount} item
                                  {s.completedCount !== 1 ? "s" : ""}
                                </span>
                              </td>
                              <td className="py-3 text-xs text-[var(--muted-foreground)]">
                                {s.lastSeen
                                  ? new Date(s.lastSeen).toLocaleDateString(
                                      "pt-PT",
                                    )
                                  : "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              ) : null}

              {/* Submissions tab */}
              {activeTab === "submissions" ? (
                <section className="rounded-[1.8rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_18px_50px_rgba(22,27,45,0.06)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                    Submissoes
                  </p>
                  <h2 className="mt-3 text-xl font-semibold text-[var(--foreground)]">
                    {submissions.length} submissa
                    {submissions.length !== 1 ? "o" : "o"}es no sistema
                  </h2>

                  {subsLoading ? (
                    <p className="mt-5 text-sm text-[var(--muted-foreground)]">
                      A carregar...
                    </p>
                  ) : submissions.length === 0 ? (
                    <p className="mt-5 text-sm text-[var(--muted-foreground)]">
                      Nenhuma submissao ainda.
                    </p>
                  ) : (
                    <div className="mt-5 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-[var(--border)] text-left">
                            <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                              ID
                            </th>
                            <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                              Missao
                            </th>
                            <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                              Aluno (UID)
                            </th>
                            <th className="pb-3 pr-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                              Estado
                            </th>
                            <th className="pb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                              Data
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                          {submissions.map((s) => (
                            <tr key={s.id}>
                              <td className="py-3 pr-4 font-mono text-xs text-[var(--muted-foreground)]">
                                {s.id.substring(0, 8)}…
                              </td>
                              <td className="py-3 pr-4 font-semibold text-[var(--foreground)]">
                                {s.missionTitle ?? s.missionId}
                              </td>
                              <td className="py-3 pr-4 font-mono text-xs text-[var(--muted-foreground)]">
                                {s.userId.substring(0, 10)}…
                              </td>
                              <td className="py-3 pr-4">
                                <span
                                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                    s.status === "submitted"
                                      ? "bg-green-50 text-green-700"
                                      : "bg-[var(--surface-subtle)] text-[var(--muted-foreground)]"
                                  }`}
                                >
                                  {s.status ?? "—"}
                                </span>
                              </td>
                              <td className="py-3 text-xs text-[var(--muted-foreground)]">
                                {s.submittedAt
                                  ? new Date(
                                      s.submittedAt,
                                    ).toLocaleDateString("pt-PT")
                                  : "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              ) : null}
            </>
          ) : null}
        </div>
      </main>
    </RouteGuard>
  );
}
