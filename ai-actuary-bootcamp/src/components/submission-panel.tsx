"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { useAuth } from "@/lib/auth-context";
import {
  DEEPSEEK_READABLE_FILE_EXTENSIONS,
  DEEPSEEK_READABLE_FILE_SUMMARY,
  getDeepSeekReadableFileError,
  isDeepSeekReadableTextFile,
} from "@/lib/deepseek-readable-files";
import { db } from "@/lib/firebase";
import { storage } from "@/lib/submission-storage";
import { getDay1ChallengeSubmissionGateMessage } from "@/lib/day1-review";
import { EXTENDED_REVIEW_DAYS } from "@/lib/review-presets";
import { useStudentState } from "@/lib/use-student-state";
import {
  buildSubmissionRecord,
  mergeSubmissionRecords,
  readLocalSubmissions,
  saveLocalSubmission,
  type SubmissionDraft,
  type SubmissionRecord,
} from "@/lib/submissions";

type SubmissionPanelProps = {
  missionId: string;
  missionTitle: string;
  missionLabel?: string;
  artifactHints?: string[];
  className?: string;
  submitDisabled?: boolean;
  submitDisabledReason?: string | null;
};

const MAX_FILE_SIZE = 20 * 1024 * 1024;

function joinClassNames(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ");
}

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-");
}

function buildUserName(userName: string | null, userEmail: string | null) {
  if (userName?.trim()) {
    return userName;
  }

  if (userEmail?.trim()) {
    return userEmail;
  }

  return "Estudante";
}

function mapRemoteSubmission(id: string, value: Record<string, unknown>) {
  const createdAtMs =
    typeof value.createdAtMs === "number" && Number.isFinite(value.createdAtMs)
      ? value.createdAtMs
      : Date.now();

  return buildSubmissionRecord(
    id,
    {
      missionId: typeof value.missionId === "string" ? value.missionId : "",
      missionTitle: typeof value.missionTitle === "string" ? value.missionTitle : "Missao",
      summary: typeof value.summary === "string" ? value.summary : "",
      artifactTitle:
        typeof value.artifactTitle === "string" ? value.artifactTitle : "",
      fileName: typeof value.fileName === "string" ? value.fileName : null,
      filePath: typeof value.filePath === "string" ? value.filePath : null,
      fileSize: typeof value.fileSize === "number" ? value.fileSize : null,
      fileType: typeof value.fileType === "string" ? value.fileType : null,
      fileUrl: typeof value.fileUrl === "string" ? value.fileUrl : null,
      userId: typeof value.userId === "string" ? value.userId : "",
      userName: typeof value.userName === "string" ? value.userName : "Estudante",
      userEmail: typeof value.userEmail === "string" ? value.userEmail : "",
      createdAtMs,
    },
    "cloud",
    "enviado",
  );
}

export function SubmissionPanel({
  missionId,
  missionTitle,
  missionLabel,
  artifactHints,
  className,
  submitDisabled = false,
  submitDisabledReason = null,
}: SubmissionPanelProps) {
  const { user, loading: authLoading } = useAuth();
  const { day1Answers, day1Reviews } = useStudentState();

  const [summary, setSummary] = useState("");
  const [artifactTitle, setArtifactTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLocalOnly, setIsLocalOnly] = useState(false);

  const userName = useMemo(
    () => buildUserName(user?.displayName ?? null, user?.email ?? null),
    [user?.displayName, user?.email],
  );
  const missionDayNumber = useMemo(() => Number.parseInt(missionId, 10), [missionId]);
  const day1ChallengeGate = useMemo(() => {
    if (!EXTENDED_REVIEW_DAYS.has(missionDayNumber)) {
      return null;
    }

    const challengeId = `des${missionDayNumber}`;
    return getDay1ChallengeSubmissionGateMessage(
      day1Reviews[challengeId],
      day1Answers[challengeId] ?? "",
    );
  }, [day1Answers, day1Reviews, missionDayNumber]);
  const effectiveSubmitDisabledReason = submitDisabledReason ?? day1ChallengeGate;
  const effectiveSubmitDisabled = submitDisabled || Boolean(day1ChallengeGate);

  useEffect(() => {
    let isActive = true;

    async function loadSubmissions() {
      if (authLoading) {
        return;
      }

      if (!user) {
        setSubmissions([]);
        setLoadingList(false);
        setIsLocalOnly(false);
        return;
      }

      setLoadingList(true);
      setErrorMessage(null);

      const localEntries = readLocalSubmissions(missionId, user.uid);

      try {
        const submissionsQuery = query(
          collection(db, "submissions"),
          where("missionId", "==", missionId),
          where("userId", "==", user.uid),
        );
        const snapshot = await getDocs(submissionsQuery);
        const remoteEntries = snapshot.docs.map((document) =>
          mapRemoteSubmission(document.id, document.data() as Record<string, unknown>),
        );

        if (!isActive) {
          return;
        }

        setSubmissions(mergeSubmissionRecords(remoteEntries, localEntries));
        setIsLocalOnly(false);
      } catch {
        if (!isActive) {
          return;
        }

        setSubmissions(localEntries);
        setIsLocalOnly(true);
      } finally {
        if (isActive) {
          setLoadingList(false);
        }
      }
    }

    void loadSubmissions();

    return () => {
      isActive = false;
    };
  }, [authLoading, missionId, user]);

  function handleFileSelection(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!isDeepSeekReadableTextFile(file)) {
      setSelectedFile(null);
      setSuccessMessage(null);
      setErrorMessage(getDeepSeekReadableFileError("Esta entrega"));
      event.target.value = "";
      return;
    }

    setErrorMessage(null);
    setSelectedFile(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      setErrorMessage("A tua sessao parece ter expirado. Faz login outra vez para enviar evidencia desta missao.");
      return;
    }

    const trimmedSummary = summary.trim();
    const trimmedTitle = artifactTitle.trim();

    if (!trimmedSummary) {
      setErrorMessage("Escreve um resumo curto do que foi entregue.");
      return;
    }

    if (effectiveSubmitDisabled) {
      setErrorMessage(effectiveSubmitDisabledReason || "Esta entrega exige uma review valida antes do envio.");
      return;
    }

    if (selectedFile && selectedFile.size > MAX_FILE_SIZE) {
      setErrorMessage("O ficheiro excede o limite de 20 MB.");
      return;
    }

    if (selectedFile && !isDeepSeekReadableTextFile(selectedFile)) {
      setErrorMessage(getDeepSeekReadableFileError("Esta entrega"));
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const createdAtMs = Date.now();
    const draft: SubmissionDraft = {
      missionId,
      missionTitle,
      summary: trimmedSummary,
      artifactTitle: trimmedTitle,
      fileName: selectedFile?.name ?? null,
      filePath: null,
      fileSize: selectedFile?.size ?? null,
      fileType: selectedFile?.type ?? null,
      fileUrl: null,
      userId: user.uid,
      userName,
      userEmail: user.email ?? "",
      createdAtMs,
    };

    try {
      let fileUrl: string | null = null;
      let filePath: string | null = null;

      if (selectedFile) {
        const safeFileName = sanitizeFileName(selectedFile.name);
        filePath = `missions/${missionId}/${user.uid}/${createdAtMs}-${safeFileName}`;
        const storageRef = ref(storage, filePath);
        await uploadBytes(storageRef, selectedFile, {
          contentType: selectedFile.type || "application/octet-stream",
        });
        fileUrl = await getDownloadURL(storageRef);
      }

      const payload = {
        ...draft,
        filePath,
        fileUrl,
        createdAt: serverTimestamp(),
        status: "enviado",
      };

      const documentReference = await addDoc(collection(db, "submissions"), payload);
      const savedRecord = buildSubmissionRecord(
        documentReference.id,
        {
          ...draft,
          filePath,
          fileUrl,
        },
        "cloud",
        "enviado",
      );

      setSubmissions((current) => mergeSubmissionRecords([savedRecord], current));
      setIsLocalOnly(false);
      setSummary("");
      setArtifactTitle("");
      setSelectedFile(null);
      setSuccessMessage("Evidencia enviada com sucesso.");
    } catch {
      const localEntry = saveLocalSubmission(draft);
      setSubmissions((current) => mergeSubmissionRecords(current, [localEntry]));
      setIsLocalOnly(true);
      setSummary("");
      setArtifactTitle("");
      setSelectedFile(null);
      setSuccessMessage(
        selectedFile
          ? "Ligacao indisponivel. O resumo ficou guardado localmente; volta a anexar o ficheiro quando a ligacao estabilizar."
          : "Ligacao indisponivel. O resumo ficou guardado localmente.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      className={joinClassNames(
        "panel shell-frame rounded-[1.8rem] p-6",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="kicker">
            Entrega de artefactos
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
            Guarda a evidencia desta missao sem sair da plataforma.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted-foreground)]">
            Resume o que foi construido, adiciona um titulo se fizer sentido e anexa um ficheiro quando tiveres prova pronta para guardar.
          </p>
        </div>

        <span className="glass-pill rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
          {missionLabel ?? missionTitle}
        </span>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="panel-accent rounded-[1.4rem] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Passo final
          </p>
          <div className="mt-3 space-y-2 text-sm leading-7 text-[var(--muted-foreground)]">
            <p>- Resultado final em linguagem simples.</p>
            <p>- Nome do artefacto, se existir um ficheiro ou entrega formal.</p>
            <p>- Ficheiro de apoio opcional: texto, markdown, csv, json, xml, yaml, html, sql ou codigo.</p>
          </div>
        </div>

        <div className="panel-soft rounded-[1.4rem] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            Estado da ligacao
          </p>
          <div className="mt-3 space-y-2 text-sm leading-7 text-[var(--muted-foreground)]">
            <p>{isLocalOnly ? "Modo local ativo. A lista pode incluir rascunhos guardados apenas neste browser." : "Cloud ativa. Novas entregas seguem para Firebase Storage e Firestore."}</p>
            <p>{user ? `Sessao ativa como ${userName}.` : "Sem sessao ativa. O painel mostra a estrutura, mas a entrega exige autenticacao."}</p>
          </div>
        </div>
      </div>

      {artifactHints?.length ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {artifactHints.map((hint) => (
            <span
              key={hint}
              className="glass-pill rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]"
            >
              {hint}
            </span>
          ))}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <label className="panel-soft block rounded-[1.4rem] p-4">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
              Titulo do artefacto
            </span>
            <input
              type="text"
              value={artifactTitle}
              onChange={(event) => setArtifactTitle(event.target.value)}
              placeholder="Ex.: Dashboard final, notebook validado, relatorio pdf"
              disabled={submitting || authLoading || !user}
              className="mt-3 w-full border-none bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
            />
          </label>

          <label className="panel-soft block rounded-[1.4rem] p-4">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
              Ficheiro opcional
            </span>
            <input
              type="file"
              accept={DEEPSEEK_READABLE_FILE_EXTENSIONS}
              onChange={handleFileSelection}
              disabled={submitting || authLoading || !user}
              className="mt-3 block w-full text-sm text-[var(--muted-foreground)] file:mr-4 file:rounded-full file:border-0 file:bg-[var(--surface-subtle)] file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-[0.14em] file:text-[var(--accent)]"
            />
            <p className="mt-2 text-xs leading-6 text-[var(--muted-foreground)]">
              Limite recomendado: 20 MB. So aceitamos formatos que o DeepSeek 3.2 leia diretamente: {DEEPSEEK_READABLE_FILE_SUMMARY}. Se a cloud falhar, o resumo fica guardado localmente, mas o ficheiro tem de ser reenviado.
            </p>
          </label>
        </div>

        <label className="block rounded-[1.4rem] border border-[var(--border)] bg-[var(--notebook-paper)]/92 p-4 shadow-[0_12px_30px_rgba(47,41,34,0.04)]">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
            Resumo da evidencia
          </span>
          <textarea
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            placeholder={
              authLoading
                ? "A verificar a sessao..."
                : !user
                  ? "Sessao em falta ou expirada. Faz login para descrever o que queres entregar."
                  : "Explica em 2 a 5 linhas o que fizeste, o que ficou funcional e o que o artefacto prova."
            }
            disabled={submitting || authLoading || !user}
            className="mt-3 min-h-36 w-full resize-y border-none bg-transparent text-sm leading-7 text-[var(--note-ink)] outline-none placeholder:text-[var(--muted-foreground)]"
          />
        </label>

        {errorMessage ? (
          <div className="rounded-[1.2rem] border border-[#d8a1a1] bg-[#fff5f5] px-4 py-3 text-sm text-[#8b3f3f]">
            {errorMessage}
          </div>
        ) : null}

        {successMessage ? (
          <div className="rounded-[1.2rem] border border-[#b9d0b9] bg-[#f4fbf4] px-4 py-3 text-sm text-[#446044]">
            {successMessage}
          </div>
        ) : null}

        {effectiveSubmitDisabledReason ? (
          <div className="rounded-[1.2rem] border border-[#ead7b3] bg-[#fff8ea] px-4 py-3 text-sm text-[#8a6630]">
            {effectiveSubmitDisabledReason}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm leading-7 text-[var(--muted-foreground)]">
            {authLoading
              ? "A confirmar autenticacao..."
              : user
                ? "A entrega fica associada a esta conta e aparece na lista recente desta missao."
                : "Sessao em falta ou expirada. Faz login para submeter evidencia."}
          </div>

          <button
            type="submit"
            disabled={submitting || authLoading || !user || effectiveSubmitDisabled}
            className="button-primary px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "A enviar..." : "Enviar evidencia"}
          </button>
        </div>
      </form>

      <div className="panel-soft mt-8 rounded-[1.5rem] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Entregas recentes
            </p>
            <h3 className="mt-2 text-lg font-semibold text-[var(--foreground)]">
              Historico desta missao para a conta atual.
            </h3>
          </div>

          <span className="glass-pill rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
            {submissions.length} registos
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {loadingList ? (
            <div className="rounded-[1.2rem] border border-[var(--border)] bg-white px-4 py-4 text-sm text-[var(--muted-foreground)]">
              A carregar entregas desta missao...
            </div>
          ) : null}

          {!loadingList && !user ? (
            <div className="rounded-[1.2rem] border border-[var(--border)] bg-white px-4 py-4 text-sm text-[var(--muted-foreground)]">
              A tua sessao expirou ou ainda nao entrou. Faz login para veres as tuas entregas recentes.
            </div>
          ) : null}

          {!loadingList && user && submissions.length === 0 ? (
            <div className="rounded-[1.2rem] border border-dashed border-[var(--border-strong)] bg-white px-4 py-4 text-sm text-[var(--muted-foreground)]">
              Ainda nao ha entregas registadas para esta missao.
            </div>
          ) : null}

          {!loadingList && user
            ? submissions.map((submission) => (
                <article
                  key={submission.id}
                  className="rounded-[1.2rem] border border-[var(--border)] bg-white p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                        {submission.createdAtLabel}
                      </p>
                      <h4 className="mt-2 text-base font-semibold text-[var(--foreground)]">
                        {submission.artifactTitle || "Entrega sem titulo"}
                      </h4>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
                        submission.status === "local"
                          ? "bg-[#fff6ea] text-[#9a6b27]"
                          : "bg-[var(--surface-subtle)] text-[var(--accent)]"
                      }`}
                    >
                      {submission.status === "local" ? "Guardado localmente" : "Enviado"}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                    {submission.summary}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                    {submission.fileName ? (
                      <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-2">
                        Ficheiro: {submission.fileName}
                      </span>
                    ) : null}
                    {submission.fileSize ? (
                      <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-2">
                        {Math.max(1, Math.round(submission.fileSize / 1024))} KB
                      </span>
                    ) : null}
                    <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-2">
                      {submission.source === "local" ? "Browser atual" : "Firebase"}
                    </span>
                  </div>

                  {submission.fileUrl ? (
                    <a
                      href={submission.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex text-sm font-semibold text-[var(--accent)] transition hover:text-[var(--accent-strong)]"
                    >
                      Abrir ficheiro
                    </a>
                  ) : null}
                </article>
              ))
            : null}
        </div>
      </div>
    </section>
  );
}
