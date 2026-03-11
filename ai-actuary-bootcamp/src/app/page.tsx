"use client";

import { AppLink } from "@/components/app-link";
import { ProgressHub } from "@/components/progress-hub";
import { RoadmapBoard } from "@/components/roadmap-board";
import { useAuth } from "@/lib/auth-context";
import { isAdminEmail } from "@/lib/admin";
import { course, days, missionItems } from "@/lib/course";
import { useStudentState } from "@/lib/use-student-state";
import { isItemDone, type ProgressMap } from "@/lib/student-state";

const PUBLIC_PHASES = [
  {
    title: "Fundacoes",
    description: "Setup, criterio de produto, specs e contratos de dados antes de construir depressa demais.",
    start: 0,
    end: 3,
  },
  {
    title: "Arquitetura e posicionamento",
    description: "Scope, documentos, UX, pricing e a narrativa do produto ficam decididos antes do build final.",
    start: 4,
    end: 7,
  },
  {
    title: "Build e lancamento",
    description: "Motor local, app integrada, deploy, prova publica e portfolio real para mostrar trabalho.",
    start: 8,
    end: 10,
  },
];

const PUBLIC_SIGNAL_CARDS = [
  {
    value: `${days.length}`,
    label: "aulas reais",
    detail: "Cada dia fecha com um artefacto, nao apenas leitura.",
  },
  {
    value: `${course.totalPoints}`,
    label: "pontos com prova",
    detail: "A progressao total bate certo com as entregas efetivas do percurso.",
  },
  {
    value: "1 MVP",
    label: "produto demonstravel",
    detail: "O bootcamp termina em deploy, narrativa e portfolio.",
  },
];

function getCompletedDays(progress: ProgressMap) {
  return days.filter((day) => {
    const missionIds = [...day.exercicios.map((item) => item.id), day.desafio.id];
    return missionIds.every((id) => isItemDone(progress, id));
  }).length;
}

export default function Home() {
  const { user, loading } = useAuth();
  const { stickyNotes, progress } = useStudentState();
  const completedItems = missionItems.filter((item) => isItemDone(progress, item.id));
  const completedCount = completedItems.length;
  const completedPoints = completedItems.reduce((sum, item) => sum + item.points, 0);
  const completedDays = getCompletedDays(progress);
  const nextMission =
    missionItems.find((item) => !isItemDone(progress, item.id))?.slug ?? days.at(-1)?.slug ?? "00";
  const currentDay = days.find((day) => day.slug === nextMission) ?? days[0];
  const isAdmin = isAdminEmail(user?.email);

  if (!loading && user) {
    return (
      <main className="page-shell px-4 pb-28 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="panel-tech shell-frame soft-grid overflow-hidden rounded-[2.4rem] px-6 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
            <div className="hero-mesh" aria-hidden="true" />
            <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div className="max-w-4xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="route-chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                    <span className="accent-dot" aria-hidden="true" />
                    Hoje
                  </span>
                  <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                    Aula atual, progresso e proximos passos
                  </span>
                </div>

                <h1 className="mt-6 max-w-5xl font-serif text-[2.45rem] leading-[0.95] tracking-[-0.04em] text-[var(--foreground)] sm:text-[4.35rem] xl:text-[5rem]">
                  Continua no <span className="text-[var(--accent)]">Dia {currentDay.slug}</span>.
                  <br />
                  Fecha a proxima entrega.
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted-foreground)] sm:text-lg">
                  Aqui tens a aula atual, o estado do percurso, as provas guardadas e os atalhos
                  para retomar o trabalho sem perder contexto.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <AppLink href={`/missions/${nextMission}`} className="button-primary w-full px-6 py-3.5 text-center text-sm sm:w-auto">
                    Abrir Dia {nextMission}
                  </AppLink>
                  <AppLink href="/portfolio" className="button-secondary w-full px-6 py-3.5 text-center text-sm font-semibold sm:w-auto">
                    Ver provas
                  </AppLink>
                  <AppLink href="/resources" className="button-secondary w-full px-6 py-3.5 text-center text-sm font-semibold sm:w-auto">
                    Abrir biblioteca
                  </AppLink>
                  {isAdmin ? (
                    <AppLink href="/admin" className="button-secondary w-full px-6 py-3.5 text-center text-sm font-semibold sm:w-auto">
                      Operacoes
                    </AppLink>
                  ) : null}
                </div>
              </div>

              <div className="panel rounded-[2rem] bg-[rgba(255,255,255,0.82)] p-5 sm:p-6">
                <p className="kicker">Estado do percurso</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                  Dia {currentDay.slug}: {currentDay.titulo}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                  {currentDay.objetivo}
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="metric-card rounded-[1.3rem] p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                      Dias fechados
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-[var(--foreground)]">{completedDays}</p>
                  </div>
                  <div className="metric-card rounded-[1.3rem] p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                      Provas ligadas ao percurso
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-[var(--foreground)]">{stickyNotes.length}</p>
                  </div>
                  <div className="metric-card rounded-[1.3rem] p-4 sm:col-span-2">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-medium text-[var(--foreground)]">Conclusao total</span>
                      <span className="text-[var(--muted-foreground)]">{completedCount}/{missionItems.length}</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                      <div
                        className="h-full rounded-full bg-[var(--accent)] transition-all"
                        style={{ width: `${Math.round((completedCount / missionItems.length) * 100) || 0}%` }}
                      />
                    </div>
                    <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                      {completedPoints} de {course.totalPoints} pontos capturados com o percurso atual.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <ProgressHub items={missionItems} days={days} />
          <RoadmapBoard days={days} />
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell px-4 pb-28 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="panel-tech shell-frame soft-grid relative overflow-hidden rounded-[2.6rem] px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="hero-mesh" aria-hidden="true" />
          <div className="hero-glow hero-glow-left float-slow" aria-hidden="true" />
          <div className="hero-glow hero-glow-right float-slow float-delay-2" aria-hidden="true" />

          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="max-w-4xl">
              <div className="fade-up flex flex-wrap items-center gap-3">
                  <span className="route-chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                    <span className="accent-dot" aria-hidden="true" />
                    Bootcamp AI para atuarios
                  </span>
                  <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                    11 dias, entregas reais, portfolio final
                  </span>
                </div>

              <h1 className="fade-up fade-delay-1 mt-6 max-w-5xl font-serif text-[2.55rem] leading-[0.94] tracking-[-0.05em] text-[var(--foreground)] sm:text-[4.7rem] xl:text-[5.4rem]">
                Aprende com <span className="text-[var(--accent)]">classes reais</span>,
                <br />
                build local e prova publica.
              </h1>

              <p className="fade-up fade-delay-2 mt-5 max-w-2xl text-base leading-8 text-[var(--muted-foreground)] sm:text-lg">
                Aprende fundamentos de AI aplicada, trabalha com dados e fecha cada dia com uma
                entrega concreta que alimenta o teu portfolio final.
              </p>

              <div className="fade-up fade-delay-3 mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <AppLink href="/login?returnTo=%2Fmissions%2F00" className="button-primary w-full px-6 py-3.5 text-center text-sm sm:w-auto">
                  Entrar e comecar no Dia 00
                </AppLink>
                <AppLink href="/#roadmap" className="button-secondary w-full px-6 py-3.5 text-center text-sm font-semibold sm:w-auto">
                  Ver a arquitetura do curso
                </AppLink>
              </div>

              <div className="fade-up fade-delay-4 mt-8 grid gap-3 sm:grid-cols-3">
                {PUBLIC_SIGNAL_CARDS.map((signal) => (
                  <div key={signal.label} className="metric-card rounded-[1.5rem] p-4">
                    <p className="text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                      {signal.value}
                    </p>
                    <p className="mt-1 text-sm font-medium text-[var(--foreground)]">{signal.label}</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">{signal.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="fade-up fade-delay-2 relative mx-auto w-full max-w-[34rem] lg:ml-auto">
              <div className="scan-surface overflow-hidden rounded-[2.2rem] border border-[rgba(17,36,49,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(231,240,237,0.9))] p-3 shadow-[0_28px_80px_rgba(12,38,46,0.12)]">
                <div className="tech-surface rounded-[1.8rem] px-5 py-5 sm:px-6 sm:py-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-white/64">
                          Como funciona
                        </p>
                        <h2 className="mt-3 text-[2rem] font-semibold leading-[1.02] tracking-[-0.05em] text-white sm:text-[2.3rem]">
                          Do primeiro dia ao lancamento.
                        </h2>
                      </div>
                    <span className="rounded-full border border-white/16 bg-white/10 px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-white/78">
                      11 dias
                    </span>
                  </div>

                  <div className="mt-6 space-y-3">
                    {[
                      "Aprende o essencial e percebe o resultado esperado da aula.",
                      "Trabalha com dados, prompts e ferramentas usados ao longo do bootcamp.",
                      "Guarda a entrega final e acumula prova para o portfolio.",
                    ].map((item, index) => (
                      <div key={item} className="flex items-center gap-3 rounded-[1.2rem] border border-white/10 bg-white/6 px-4 py-3 backdrop-blur-sm">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[0.72rem] font-semibold text-white/88">
                          0{index + 1}
                        </span>
                        <p className="text-sm leading-6 text-white/84">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-3">
          {PUBLIC_PHASES.map((phase) => {
            const phaseDays = days.filter((day) => day.dia >= phase.start && day.dia <= phase.end);
            return (
              <article key={phase.title} className="panel shell-frame rounded-[2rem] p-6 sm:p-7">
                <p className="kicker">{phase.title}</p>
                <h2 className="mt-3 font-serif text-3xl tracking-[-0.03em] text-[var(--foreground)]">
                  Dias {phaseDays[0]?.slug} a {phaseDays.at(-1)?.slug}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{phase.description}</p>
                <div className="mt-5 space-y-2">
                  {phaseDays.map((day) => (
                    <div key={day.slug} className="panel-soft rounded-[1.2rem] px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Dia {day.slug}</p>
                      <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">{day.titulo}</p>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </section>

        <RoadmapBoard days={days} />
      </div>
    </main>
  );
}
