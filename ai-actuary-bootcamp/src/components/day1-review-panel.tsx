"use client";

import { useMemo, useState } from "react";

import { useAuth } from "@/lib/auth-context";
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
  maxScore: number;
  extraContext?: string;
  compact?: boolean;
};

function sectionTitle(itemType: Day1ReviewItemType) {
  return itemType === "challenge"
    ? "AI review da tese de produto"
    : "Review com AI para a tua resposta";
}

function sectionBody(itemType: Day1ReviewItemType) {
  return itemType === "challenge"
    ? "Cola aqui a tua tese ou um draft substancial. O tutor valida foco, prova de conceito, distribuicao e riscos antes da entrega final."
    : "Escreve ou cola a tua resposta. O tutor faz uma first-pass review com rubrica, destaca lacunas e recomenda ajustes antes de marcares como concluido.";
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

export function Day1ReviewPanel({
  itemId,
  itemType,
  title,
  description,
  maxScore,
  extraContext,
  compact = false,
}: Day1ReviewPanelProps) {
  const { user } = useAuth();
  const { day1Answers, updateDay1Answer, day1Reviews, updateDay1Review } = useStudentState();
  const [runningReview, setRunningReview] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const answer = day1Answers[itemId] ?? "";
  const review = day1Reviews[itemId];
  const reviewGateMessage = getDay1ReviewGateMessage(review, answer, itemType);
  const isFresh = hasFreshDay1Review(review, answer);
  const spec = getDay1ReviewSpec(itemId);

  const titleClass = compact ? "text-lg" : "text-xl";
  const textAreaHeight = compact ? "min-h-56" : "min-h-48";

  const reviewStatus = useMemo(() => {
    if (!review || review.error) {
      return "Sem review valida";
    }

    return isFresh ? "Review atualizada" : "Review desatualizada";
  }, [isFresh, review]);

  async function handleReview() {
    if (!user) {
      setApiError("Inicia sessao para pedir review do tutor.");
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
              disabled={runningReview}
              className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--accent),#d88657)] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(181,95,50,0.2)] transition hover:translate-y-[-1px] hover:bg-[linear-gradient(135deg,var(--accent-strong),var(--accent))] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {runningReview ? "A avaliar..." : `Review with AI · ${itemId}`}
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
                <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Score recomendado</p>
                <p className="mt-2 text-xl font-semibold text-[var(--foreground)]">
                  {review ? `${review.scoreRecommended}/${review.maxScore || maxScore}` : `0/${maxScore}`}
                </p>
              </div>
              <div className="rounded-[1rem] border border-[var(--border)] bg-white p-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Pronto para fechar?</p>
                <p className="mt-2 text-xl font-semibold text-[var(--foreground)]">
                  {review?.passRecommended ? "Sim" : "Ainda nao"}
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

            {review?.shortFeedback ? (
              <div className="mt-4 rounded-[1rem] border border-[var(--accent-soft)] bg-white px-4 py-3 text-sm leading-7 text-[var(--foreground)]">
                <span className="font-semibold">Leitura do tutor:</span> {review.shortFeedback}
              </div>
            ) : null}
          </div>

          {renderList("Pontos fortes", review?.strengths ?? [])}
          {renderList("Lacunas", review?.gaps ?? [])}
          {renderList("Ajustes obrigatorios", review?.requiredFixes ?? [])}
          {renderList("Evidencia reconhecida", review?.evidenceUsed ?? [])}
        </div>
      </div>
    </section>
  );
}
