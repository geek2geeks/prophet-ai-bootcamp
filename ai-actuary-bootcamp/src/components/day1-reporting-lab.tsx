"use client";

import { useMemo, useState } from "react";

import type { Day1ManualTask, Day1ReportingRow } from "@/lib/day1-lab-data";

type Props = {
  rows: Day1ReportingRow[];
  tasks: Day1ManualTask[];
  summary: {
    totalDeltaLucro: number;
    totalDeltaReserva: number;
    totalDeltaSinistros: number;
    totalManualHours: number;
  };
};

type MetricKey = "deltaLucro" | "deltaReserva" | "deltaSinistros" | "deltaLapses";

const METRICS: Record<MetricKey, { label: string; positiveIsGood: boolean }> = {
  deltaLucro: { label: "Lucro tecnico", positiveIsGood: true },
  deltaReserva: { label: "Reserva best estimate", positiveIsGood: false },
  deltaSinistros: { label: "Sinistros incorridos", positiveIsGood: false },
  deltaLapses: { label: "Lapses", positiveIsGood: false },
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatSignedNumber(value: number) {
  return `${value > 0 ? "+" : ""}${value}`;
}

export function Day1ReportingLab({ rows, tasks, summary }: Props) {
  const [metric, setMetric] = useState<MetricKey>("deltaLucro");
  const [showTable, setShowTable] = useState(false);

  const rankedRows = useMemo(() => {
    return [...rows].sort((a, b) => Math.abs(b[metric]) - Math.abs(a[metric]));
  }, [metric, rows]);

  const maxAbs = useMemo(
    () => Math.max(...rankedRows.map((row) => Math.abs(row[metric])), 1),
    [metric, rankedRows],
  );

  const biggestProfitDrop = [...rows]
    .sort((a, b) => a.deltaLucro - b.deltaLucro)
    .slice(0, 3);
  const biggestReserveRise = [...rows]
    .sort((a, b) => b.deltaReserva - a.deltaReserva)
    .slice(0, 3);

  const driverSnapshot = useMemo(() => {
    const sinistros = rows.reduce((sum, row) => sum + row.deltaSinistros, 0);
    const lapses = rows.reduce((sum, row) => sum + row.deltaLapses, 0);
    const volume = rows.reduce((sum, row) => sum + Math.abs(row.deltaApolices), 0);

    const candidates = [
      { label: "Sinistralidade", score: Math.abs(sinistros) },
      { label: "Lapses", score: Math.abs(lapses) * 10000 },
      { label: "Mix de carteira", score: volume * 1200 },
    ].sort((a, b) => b.score - a.score);

    return candidates[0]?.label ?? "Sinistralidade";
  }, [rows]);

  return (
    <section className="rounded-[1.8rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_18px_50px_rgba(22,27,45,0.06)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
            Lab Dia 1
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
            Explicar variacoes de reporting com dados reais do curso.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted-foreground)]">
            Aqui o aluno faz a parte exploratoria no browser e depois leva a evidencia para o OpenCode.
            O objetivo nao e so ver deltas: e sair com uma narrativa, uma hipotese de driver e uma ideia clara
            de automacao para o Prophet Lite.
          </p>
        </div>

        <div className="rounded-[1.2rem] border border-[var(--accent-soft)] bg-[linear-gradient(180deg,rgba(124,63,88,0.08),rgba(124,63,88,0.03))] px-4 py-3 text-sm text-[var(--foreground)]">
          Prompt sugerido: comparar Q4 vs Q1, explicar drivers e escrever a nota ao CFO.
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <MetricCard label="Delta lucro tecnico" value={formatCurrency(summary.totalDeltaLucro)} />
        <MetricCard label="Delta reserva" value={formatCurrency(summary.totalDeltaReserva)} />
        <MetricCard label="Delta sinistros" value={formatCurrency(summary.totalDeltaSinistros)} />
        <MetricCard label="Horas manuais / ciclo" value={String(summary.totalManualHours)} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                Exploracao guiada
              </p>
              <h3 className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                Onde a variacao pesa mais
              </h3>
            </div>

            <label className="text-sm text-[var(--muted-foreground)]">
              <span className="mr-2">Metrica</span>
              <select
                value={metric}
                onChange={(event) => setMetric(event.target.value as MetricKey)}
                className="rounded-full border border-[var(--border-strong)] bg-white px-4 py-2 text-sm text-[var(--foreground)] outline-none"
              >
                {Object.entries(METRICS).map(([key, definition]) => (
                  <option key={key} value={key}>
                    {definition.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 space-y-3">
            {rankedRows.map((row) => {
              const value = row[metric];
              const good = METRICS[metric].positiveIsGood ? value >= 0 : value <= 0;
              const width = `${Math.max((Math.abs(value) / maxAbs) * 100, 6)}%`;

              return (
                <div key={row.segmentLabel} className="rounded-[1rem] border border-[var(--border)] bg-white p-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-[var(--foreground)]">{row.segmentLabel}</p>
                      <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">
                        Q4 {formatCurrency(row.lucroQ4)} para Q1 {formatCurrency(row.lucroQ1)}
                      </p>
                    </div>
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]"
                      style={{
                        backgroundColor: good ? "#e8f6ef" : "#fdf1df",
                        color: good ? "#28704d" : "#9a6411",
                      }}
                    >
                      {metric === "deltaLapses"
                        ? formatSignedNumber(value)
                        : formatCurrency(value)}
                    </span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-[var(--surface-subtle)]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width,
                        background: good
                          ? "linear-gradient(90deg,#5aa07a,#9ed0b2)"
                          : "linear-gradient(90deg,#c97d3b,#efbf8d)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <InsightCard
            title="Segmentos que mais deterioram o lucro"
            items={biggestProfitDrop.map(
              (row) => `${row.segmentLabel} (${formatCurrency(row.deltaLucro)})`,
            )}
          />
          <InsightCard
            title="Segmentos com maior subida de reserva"
            items={biggestReserveRise.map(
              (row) => `${row.segmentLabel} (${formatCurrency(row.deltaReserva)})`,
            )}
          />
          <InsightCard
            title="Hipotese inicial para o driver"
            items={[
              `${driverSnapshot} parece ser o primeiro suspeito para explicar a subida da reserva.`,
              "Usa esta leitura como ponto de partida e confirma os numeros no OpenCode.",
            ]}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
            Trabalho manual repetitivo
          </p>
          <div className="mt-4 space-y-3">
            {tasks.map((task) => (
              <article key={task.tarefa} className="rounded-[1rem] border border-[var(--border)] bg-white p-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-[var(--foreground)]">{task.tarefa}</p>
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                      {task.equipa} · {task.frequencia}
                    </p>
                  </div>
                  <span className="rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                    {task.tempoManualHoras} h
                  </span>
                </div>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  Risco de erro: {task.riscoDeErro}. Impacto: {task.impactoNoNegocio}.
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-[1.4rem] border border-[var(--border)] bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                Antes de abrir o OpenCode
              </p>
              <h3 className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                Sai daqui com uma leitura inicial propria.
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowTable((value) => !value)}
              className="inline-flex items-center rounded-full border border-[var(--border-strong)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent-soft)] hover:bg-[var(--surface-subtle)]"
            >
              {showTable ? "Esconder tabela completa" : "Ver tabela completa"}
            </button>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <PromptBox text="Que 3 segmentos explicam a maior parte da deterioracao do lucro tecnico?" />
            <PromptBox text="O aumento da reserva vem mais de sinistralidade, lapse ou mix de carteira?" />
            <PromptBox text="Que nota de 5 linhas enviarias ao CFO antes de delegar a redacao a uma AI?" />
            <PromptBox text="Que feature do Prophet Lite reduziria estas horas manuais trimestre apos trimestre?" />
          </div>

          {showTable ? (
            <div className="mt-4 overflow-x-auto rounded-[1rem] border border-[var(--border)]">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead className="bg-[var(--surface-subtle)] text-[var(--muted-foreground)]">
                  <tr>
                    <th className="px-4 py-3 font-medium">Segmento</th>
                    <th className="px-4 py-3 font-medium">Delta lucro</th>
                    <th className="px-4 py-3 font-medium">Delta reserva</th>
                    <th className="px-4 py-3 font-medium">Delta sinistros</th>
                    <th className="px-4 py-3 font-medium">Delta lapses</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.segmentLabel} className="border-t border-[var(--border)]">
                      <td className="px-4 py-3 text-[var(--foreground)]">{row.segmentLabel}</td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)]">
                        {formatCurrency(row.deltaLucro)}
                      </td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)]">
                        {formatCurrency(row.deltaReserva)}
                      </td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)]">
                        {formatCurrency(row.deltaSinistros)}
                      </td>
                      <td className="px-4 py-3 text-[var(--muted-foreground)]">
                        {formatSignedNumber(row.deltaLapses)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.3rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-[var(--foreground)]">{value}</p>
    </div>
  );
}

function InsightCard({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
        Insight rapido
      </p>
      <h3 className="mt-2 text-lg font-semibold text-[var(--foreground)]">{title}</h3>
      <div className="mt-3 space-y-2 text-sm leading-7 text-[var(--muted-foreground)]">
        {items.map((item) => (
          <p key={item}>- {item}</p>
        ))}
      </div>
    </section>
  );
}

function PromptBox({ text }: { text: string }) {
  return (
    <div className="rounded-[1rem] border border-[var(--border)] bg-[var(--surface-subtle)] p-4 text-sm leading-7 text-[var(--muted-foreground)]">
      {text}
    </div>
  );
}
