"use client";

import { AppLink } from "@/components/app-link";
import { ProgressHub } from "@/components/progress-hub";
import { RoadmapBoard } from "@/components/roadmap-board";
import { useAuth } from "@/lib/auth-context";
import { isAdminEmail } from "@/lib/admin";
import { course, days, missionItems } from "@/lib/course";
import { useStudentState } from "@/lib/use-student-state";

const publicSignals = [
  { value: `${days.length}`, label: "dias com missões reais" },
  { value: `${course.totalPoints}`, label: "pontos ligados a entregas" },
  { value: "1 MVP", label: "produto para mostrar" },
];

export default function Home() {
  const { user, loading } = useAuth();
  const { stickyNotes, progress } = useStudentState();
  const completedItems = missionItems.filter((item) => progress[item.id]);
  const completedCount = completedItems.length;
  const completedPoints = completedItems.reduce((sum, item) => sum + item.points, 0);
  const completedDays = days.filter((day) => {
    const missionIds = [...day.exercicios.map((item) => item.id), day.desafio.id];
    return missionIds.every((id) => progress[id]);
  }).length;
  const nextMission =
    missionItems.find((item) => !progress[item.id])?.slug ?? days.at(-1)?.slug ?? "00";
  const currentDay = days.find((day) => day.slug === nextMission) ?? days[0];
  const isAdmin = isAdminEmail(user?.email);

  if (!loading && user) {
    return (
      <main className="page-shell px-4 pb-28 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <section className="panel-tech shell-frame soft-grid rounded-[2.6rem] px-6 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="glass-pill inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--foreground)]">
                    <span className="accent-dot" aria-hidden="true" />
                    Workspace ativo
                  </span>
                  {isAdmin ? (
                    <span className="glass-pill inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                      Admin
                    </span>
                  ) : null}
                </div>

                <h1 className="mt-6 max-w-5xl font-serif text-[3.1rem] leading-[0.92] tracking-[-0.04em] text-[var(--foreground)] sm:text-[4.4rem] xl:text-[5rem]">
                  Retoma o Dia {nextMission}.
                  <br />
                  <span className="text-[var(--accent)]">Sem clutter.</span>
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted-foreground)] sm:text-lg">
                  O dashboard deve fazer uma coisa primeiro: levar-te de volta ao trabalho certo.
                  O resto fica como apoio, nao como distração.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <AppLink href={`/missions/${nextMission}`} className="button-primary px-6 py-3.5 text-sm">
                    Retomar Dia {nextMission}
                  </AppLink>
                  <AppLink href="/portfolio" className="button-secondary px-6 py-3.5 text-sm font-semibold">
                    Abrir portfolio
                  </AppLink>
                  {isAdmin ? (
                    <AppLink href="/admin" className="button-secondary px-6 py-3.5 text-sm font-semibold">
                      Ir para admin
                    </AppLink>
                  ) : null}
                </div>
              </div>

              <div className="panel-soft rounded-[1.8rem] p-5 sm:p-6">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  Agora
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                  Dia {currentDay.slug}: {currentDay.titulo}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                  {currentDay.objetivo}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="glass-pill rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                    {currentDay.exercicios.length} exercicios
                  </span>
                  <span className="glass-pill rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                    {currentDay.totalMissionPoints} pts
                  </span>
                  <span className="glass-pill rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                    {stickyNotes.length} notas
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="panel-tech shell-frame soft-grid rounded-[2rem] p-6 sm:p-8">
              <p className="kicker">Progresso</p>
              <h2 className="mt-3 font-serif text-3xl tracking-[-0.03em] text-[var(--foreground)] sm:text-4xl">
                O que ja ficou feito.
              </h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                <div className="metric-card rounded-[1.45rem] p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                    Dias concluidos
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
                    {completedDays}
                    <span className="ml-2 text-base font-normal text-[var(--muted-foreground)]">
                      / {days.length}
                    </span>
                  </p>
                </div>
                <div className="metric-card rounded-[1.45rem] p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                    Itens fechados
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
                    {completedCount}
                    <span className="ml-2 text-base font-normal text-[var(--muted-foreground)]">
                      / {missionItems.length}
                    </span>
                  </p>
                </div>
                <div className="metric-card rounded-[1.45rem] p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                    Pontos capturados
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
                    {completedPoints}
                    <span className="ml-2 text-base font-normal text-[var(--muted-foreground)]">
                      / {course.totalPoints}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="panel shell-frame rounded-[2rem] p-6 sm:p-8">
              <p className="kicker">Ferramentas</p>
              <h2 className="mt-3 font-serif text-3xl tracking-[-0.03em] text-[var(--foreground)] sm:text-4xl">
                Atalhos uteis, sem repeticao.
              </h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <AppLink href="/portfolio" className="panel-soft rounded-[1.45rem] p-5 transition duration-300 hover:border-[var(--cool-accent)] hover:bg-white">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">Portfolio</p>
                  <p className="mt-3 text-base font-semibold text-[var(--foreground)]">Ver entregas e progresso</p>
                </AppLink>
                <AppLink href="/resources" className="panel-soft rounded-[1.45rem] p-5 transition duration-300 hover:border-[var(--cool-accent)] hover:bg-white">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">Recursos</p>
                  <p className="mt-3 text-base font-semibold text-[var(--foreground)]">Abrir ficheiros e referencias</p>
                </AppLink>
                <div className="panel-soft rounded-[1.45rem] p-5">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">Notas</p>
                  <p className="mt-3 text-base font-semibold text-[var(--foreground)]">{stickyNotes.length} guardadas no workspace</p>
                </div>
                {isAdmin ? (
                  <AppLink href="/admin" className="panel-soft rounded-[1.45rem] p-5 transition duration-300 hover:border-[var(--cool-accent)] hover:bg-white">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">Admin</p>
                    <p className="mt-3 text-base font-semibold text-[var(--foreground)]">Gerir chaves, alunos e reviews</p>
                  </AppLink>
                ) : null}
              </div>
            </div>
          </section>

          <details className="panel shell-frame rounded-[2rem] p-6 sm:p-8">
            <summary className="cursor-pointer list-none">
              <p className="kicker">Roteiro do curso</p>
              <h2 className="mt-3 font-serif text-3xl tracking-[-0.03em] text-[var(--foreground)] sm:text-4xl">
                Abre o mapa completo so quando precisares de replanear.
              </h2>
            </summary>
            <div className="mt-6">
              <RoadmapBoard days={days} />
            </div>
          </details>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell px-4 pb-28 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <section className="panel relative overflow-hidden rounded-[2.6rem] px-6 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
          <div className="hero-mesh" aria-hidden="true" />
          <div className="hero-glow hero-glow-left float-slow" aria-hidden="true" />
          <div className="hero-glow hero-glow-right float-slow float-delay-2" aria-hidden="true" />

          <div className="relative grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
            <div className="max-w-3xl">
              <div className="fade-up flex flex-wrap items-center gap-3">
                <span className="glass-pill inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--foreground)]">
                  <span className="accent-dot" aria-hidden="true" />
                  Builder track para atuários
                </span>
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  Local-first learning platform
                </span>
              </div>

              <h1 className="fade-up fade-delay-1 mt-6 max-w-5xl font-serif text-[3.25rem] leading-[0.92] tracking-[-0.04em] text-[var(--foreground)] sm:text-[4.6rem] xl:text-[5.4rem]">
                Constrói o teu <span className="text-[var(--accent)]">Prophet Lite</span>
                <br />
                com sensação de produto real.
              </h1>

              <p className="fade-up fade-delay-2 mt-5 max-w-2xl text-base leading-8 text-[var(--muted-foreground)] sm:text-lg">
                Sai do papel de operador e entra em builder com criterio de produto. Menos
                clutter, mais foco, stack moderna e um MVP que já nasce pronto para demo.
              </p>

              <div className="fade-up fade-delay-3 mt-7 flex flex-wrap gap-3">
                <AppLink href="/missions/00" className="button-primary px-6 py-3.5 text-sm">
                  Começar Dia 00
                </AppLink>
                <a href="#roadmap" className="button-secondary px-6 py-3.5 text-sm font-semibold">
                  Ver roteiro completo
                </a>
              </div>

              <div className="fade-up fade-delay-4 mt-8 grid gap-3 sm:grid-cols-3">
                {publicSignals.map((signal) => (
                  <div key={signal.label} className="metric-card rounded-[1.5rem] px-4 py-4">
                    <p className="text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                      {signal.value}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">{signal.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="fade-up fade-delay-2 relative mx-auto w-full max-w-[32rem] lg:ml-auto">
              <div className="scan-surface overflow-hidden rounded-[2.2rem] border border-[rgba(20,32,45,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(244,237,227,0.84))] p-3 shadow-[0_28px_80px_rgba(29,39,48,0.16)]">
                <div className="tech-surface rounded-[1.8rem] px-5 py-5 sm:px-6 sm:py-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-white/58">
                        Sistema de build
                      </p>
                      <h2 className="mt-3 text-[2rem] font-semibold leading-[1.02] tracking-[-0.05em] text-white sm:text-[2.3rem]">
                        Menos curso. Mais cockpit.
                      </h2>
                    </div>
                    <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-white/72">
                      Ativo
                    </span>
                  </div>

                  <div className="mt-6 space-y-3">
                    {[
                      "Motor atuarial determinístico",
                      "Copiloto AI com contexto do produto",
                      "Deploy com portfolio, tracking e narrativa",
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

        <ProgressHub items={missionItems} days={days} />
        <RoadmapBoard days={days} />
      </div>
    </main>
  );
}
