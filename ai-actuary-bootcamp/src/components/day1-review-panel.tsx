"use client";

import { ChangeEvent, useMemo, useState } from "react";

import { useAuth } from "@/lib/auth-context";
import {
  DEEPSEEK_READABLE_FILE_EXTENSIONS,
  DEEPSEEK_READABLE_FILE_SUMMARY,
  getDeepSeekReadableFileError,
  isDeepSeekReadableTextFile,
} from "@/lib/deepseek-readable-files";
import { requestDeepSeekChat } from "@/lib/deepseek-client";
import { useStudentState } from "@/lib/use-student-state";
import {
  buildDay1ReviewMessages,
  getDay1ReviewGateMessage,
  getDay1ReviewSpec,
  hasFreshDay1Review,
  normalizeReviewResult,
  type Day1ReviewItemType,
} from "@/lib/day1-review";

type Day1ReviewPanelProps = {
  itemId: string;
  itemType: Day1ReviewItemType;
  title: string;
  description: string;
  extraContext?: string;
  compact?: boolean;
};

const MAX_IMPORTED_FILE_SIZE = 512 * 1024;
const MAX_IMPORTED_TEXT_LENGTH = 20000;

function sectionTitle(itemType: Day1ReviewItemType) {
  return itemType === "challenge"
    ? "Revisao do tutor AI para a tese"
    : "Revisao do tutor AI para a tua resposta";
}

function sectionBody(itemType: Day1ReviewItemType) {
  return itemType === "challenge"
    ? "Cola aqui a tua tese ou um draft substancial. O tutor comenta com cuidado o foco, a prova de conceito, a distribuicao e o que falta fortalecer antes da entrega final."
    : "Escreve ou cola a tua resposta. O tutor le o que tentaste explicar, reconhece o que ja esta a funcionar e sugere as proximas melhorias antes de fechares o exercicio.";
}

function renderList(title: string, values: string[]) {
  if (!values.length) {
    return null;
  }

  return (
    <div key={title} className="rounded-[1.25rem] border border-[var(--border)] bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
        {title}
      </p>
      <div className="mt-3 space-y-2 text-sm leading-7 text-[var(--muted-foreground)]">
        {values.map((value) => (
          <p key={value}>- {value}</p>
        ))}
      </div>
    </div>
  );
}

function buildImportedAnswer(currentAnswer: string, fileName: string, importedText: string) {
  const importedBlock = `Conteudo importado de ${fileName}:\n${importedText}`;

  if (!currentAnswer.trim()) {
    return importedBlock;
  }

  return `${currentAnswer.trim()}\n\n---\n${importedBlock}`;
}

export function Day1ReviewPanel({
  itemId,
  itemType,
  title,
  description,
  extraContext,
  compact = false,
}: Day1ReviewPanelProps) {
  const { user } = useAuth();
  const { day1Answers, updateDay1Answer, day1Reviews, updateDay1Review } = useStudentState();
  const [runningReview, setRunningReview] = useState(false);
  const [importingFile, setImportingFile] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [fileImportMessage, setFileImportMessage] = useState<string | null>(null);

  const answer = day1Answers[itemId] ?? "";
  const review = day1Reviews[itemId];
  const reviewGateMessage = getDay1ReviewGateMessage(review, answer, itemType);
  const isFresh = hasFreshDay1Review(review, answer);
  const spec = getDay1ReviewSpec(itemId);

  const titleClass = compact ? "text-lg" : "text-xl";
  const textAreaHeight = compact ? "min-h-56" : "min-h-48";

  const reviewStatus = useMemo(() => {
    if (!review || review.error) {
      return "Sem revisao valida";
    }

    return isFresh ? "Revisao atualizada" : "Revisao desatualizada";
  }, [isFresh, review]);

  const readinessLabel = useMemo(() => {
    if (!review) {
      return "Por rever";
    }

    switch (review.readinessStatus) {
      case "ready":
        return "Pronto para fechar";
      case "blocked":
        return "Precisa de mudancas chave";
      default:
        return "Pede mais um draft";
    }
  }, [review]);

  async function handleReview() {
    if (!user) {
      setApiError("A tua sessao parece ter expirado. Faz login outra vez para pedir review do tutor.");
      return;
    }

    const trimmedAnswer = answer.trim();
    if (!trimmedAnswer) {
      setApiError("Escreve a tua resposta antes de pedir review.");
      return;
    }

    setRunningReview(true);
    setApiError(null);

    try {
      const content = await requestDeepSeekChat({
        messages: buildDay1ReviewMessages({
          itemId,
          itemTitle: title,
          itemDescription: description,
          studentAnswer: trimmedAnswer,
          extraContext,
        }),
        model: itemType === "challenge" ? "deepseek-reasoner" : "deepseek-chat",
        maxTokens: 900,
        temperature: 0.1,
        responseFormat: { type: "json_object" },
        thinking: itemType === "challenge" ? { type: "enabled" } : undefined,
      });
      const reviewModel = itemType === "challenge" ? "deepseek-reasoner" : "deepseek-chat";
      const normalized = normalizeReviewResult(
        itemId,
        itemType,
        trimmedAnswer,
        content ? JSON.parse(content) as Record<string, unknown> : null,
        content ? undefined : "Nao foi possivel interpretar a resposta do modelo em formato estruturado.",
        reviewModel,
      );

      await updateDay1Review(itemId, normalized);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao contactar o tutor.";
      setApiError(message);
      await updateDay1Review(
        itemId,
        normalizeReviewResult(
          itemId,
          itemType,
          answer,
          null,
          message,
          itemType === "challenge" ? "deepseek-reasoner" : "deepseek-chat",
        ),
      );
    } finally {
      setRunningReview(false);
    }
  }

  async function handleFileImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";

    if (!file) {
      return;
    }

    setApiError(null);
    setFileImportMessage(null);

    if (!isDeepSeekReadableTextFile(file)) {
      setApiError(getDeepSeekReadableFileError("Este painel"));
      return;
    }

    if (file.size > MAX_IMPORTED_FILE_SIZE) {
      setApiError(
        "O ficheiro excede 512 KB. Reduz o conteudo ou cola apenas o excerto relevante.",
      );
      return;
    }

    setImportingFile(true);

    try {
      const normalizedText = (await file.text()).replace(/\r\n?/g, "\n").replace(/\u0000/g, "").trim();

      if (!normalizedText) {
        setApiError("O ficheiro esta vazio. Escolhe um ficheiro com texto util para a review.");
        return;
      }

      const wasTruncated = normalizedText.length > MAX_IMPORTED_TEXT_LENGTH;
      const importedText = wasTruncated
        ? `${normalizedText.slice(0, MAX_IMPORTED_TEXT_LENGTH).trimEnd()}\n\n[Conteudo truncado para manter a resposta leve.]`
        : normalizedText;

      const nextAnswer = buildImportedAnswer(answer, file.name, importedText);
      await updateDay1Answer(itemId, nextAnswer);
      setFileImportMessage(
        wasTruncated
          ? `${file.name} importado. Usei apenas os primeiros ${MAX_IMPORTED_TEXT_LENGTH} caracteres.`
          : `${file.name} importado para a resposta.`,
      );
    } catch {
      setApiError(
        "Nao foi possivel ler esse ficheiro. Usa texto simples, markdown, CSV, JSON ou outro formato textual.",
      );
    } finally {
      setImportingFile(false);
    }
  }

  return (
    <section className="rounded-[1.5rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(252,247,242,0.92))] p-5 shadow-[0_18px_40px_rgba(22,27,45,0.05)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
            {sectionTitle(itemType)}
          </p>
          <h3 className={`mt-2 font-semibold text-[var(--foreground)] ${titleClass}`}>
            {title}
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted-foreground)]">
            {sectionBody(itemType)}
          </p>
        </div>

        <div className="rounded-full border border-[var(--border-strong)] bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
          {reviewStatus}
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--notebook-paper)]/92 p-4 shadow-[0_10px_24px_rgba(47,41,34,0.04)]">
          <label className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
            {itemType === "challenge" ? "Draft da tese" : `Resposta para ${itemId}`}
          </label>
          <textarea
            value={answer}
            onChange={(event) => void updateDay1Answer(itemId, event.target.value)}
            placeholder={
              itemType === "challenge"
                ? "Cola aqui a tua tese de produto ou um draft substancial..."
                : "Escreve ou cola aqui a tua resposta para este exercicio..."
            }
            className={`mt-3 w-full resize-y border-none bg-transparent text-sm leading-7 text-[var(--note-ink)] outline-none placeholder:text-[var(--muted-foreground)] ${textAreaHeight}`}
          />

          <div className="mt-4 rounded-[1rem] border border-[var(--border)] bg-white/80 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  Importar ficheiro de texto
                </p>
                <p className="mt-2 text-xs leading-6 text-[var(--muted-foreground)]">
                  O DeepSeek 3.2 aqui le texto direto. Podes carregar {DEEPSEEK_READABLE_FILE_SUMMARY}.
                </p>
              </div>
            </div>

            <input
              type="file"
              accept={DEEPSEEK_READABLE_FILE_EXTENSIONS}
              onChange={(event) => void handleFileImport(event)}
              disabled={importingFile || runningReview}
              className="mt-3 block w-full text-sm text-[var(--muted-foreground)] file:mr-4 file:rounded-full file:border-0 file:bg-[var(--surface-subtle)] file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-[0.14em] file:text-[var(--accent)] disabled:cursor-not-allowed"
            />

            <p className="mt-2 text-xs leading-6 text-[var(--muted-foreground)]">
              Se o ficheiro for muito grande, importo apenas o excerto inicial para manter a resposta leve e editavel.
            </p>

            {fileImportMessage ? (
              <div className="mt-3 rounded-[0.9rem] border border-[#b9d0b9] bg-[#f4fbf4] px-3 py-2 text-xs leading-6 text-[#446044]">
                {fileImportMessage}
              </div>
            ) : null}
          </div>

          {spec?.mustInclude?.length ? (
            <div className="mt-4 rounded-[1rem] border border-[var(--border)] bg-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                O que o tutor vai procurar
              </p>
              <div className="mt-3 space-y-2 text-sm leading-7 text-[var(--muted-foreground)]">
                {spec.mustInclude.map((rule) => (
                  <p key={rule}>- {rule}</p>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm leading-7 text-[var(--muted-foreground)]">
              {reviewGateMessage ?? "A review mais recente corresponde ao texto atual."}
            </div>
            <button
              type="button"
              onClick={() => void handleReview()}
              disabled={runningReview || importingFile}
              className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--accent),#d88657)] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(181,95,50,0.2)] transition hover:translate-y-[-1px] hover:bg-[linear-gradient(135deg,var(--accent-strong),var(--accent))] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {runningReview
                ? "A rever..."
                : importingFile
                  ? "A importar ficheiro..."
                  : `Pedir revisao do tutor · ${itemId}`}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
              Leitura do tutor
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1rem] border border-[var(--border)] bg-white p-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Estado do draft</p>
                <p className="mt-2 text-xl font-semibold text-[var(--foreground)]">
                  {readinessLabel}
                </p>
              </div>
              <div className="rounded-[1rem] border border-[var(--border)] bg-white p-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Pronto para fechar?</p>
                <p className="mt-2 text-xl font-semibold text-[var(--foreground)]">
                  {review?.readyToSubmit ? "Sim" : "Ainda nao"}
                </p>
              </div>
              <div className="rounded-[1rem] border border-[var(--border)] bg-white p-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Confianca</p>
                <p className="mt-2 text-xl font-semibold capitalize text-[var(--foreground)]">
                  {review?.confidence ?? "medium"}
                </p>
              </div>
            </div>

            {apiError ? (
              <div className="mt-4 rounded-[1rem] border border-[#d8a1a1] bg-[#fff5f5] px-4 py-3 text-sm text-[#8b3f3f]">
                {apiError}
              </div>
            ) : null}

            {review?.encouragement ? (
              <div className="mt-4 rounded-[1rem] border border-[#c9dfbf] bg-[#f6fbf1] px-4 py-3 text-sm leading-7 text-[var(--foreground)]">
                <span className="font-semibold">O que ja esta a funcionar:</span> {review.encouragement}
              </div>
            ) : null}

            {review?.coachSummary ? (
              <div className="mt-4 rounded-[1rem] border border-[var(--accent-soft)] bg-white px-4 py-3 text-sm leading-7 text-[var(--foreground)]">
                <span className="font-semibold">Leitura do tutor:</span> {review.coachSummary}
              </div>
            ) : null}

            {review?.nextStep ? (
              <div className="mt-4 rounded-[1rem] border border-[var(--border)] bg-white px-4 py-3 text-sm leading-7 text-[var(--foreground)]">
                <span className="font-semibold">Proximo passo:</span> {review.nextStep}
              </div>
            ) : null}
          </div>

          {renderList("Manter", review?.strengths ?? [])}
          {renderList("Cobertura em falta", review?.coverageGaps ?? [])}
          {renderList("Prioridades desta revisao", review?.priorityActions ?? [])}
          {renderList("Bloqueios antes de submeter", review?.blockingIssues ?? [])}
          {renderList("Evidencia reconhecida", review?.evidenceUsed ?? [])}
        </div>
      </div>
    </section>
  );
}
