"use client";

import { AppLink } from "@/components/app-link";
import { ProgressHub } from "@/components/progress-hub";
import { RoadmapBoard } from "@/components/roadmap-board";
import { useAuth } from "@/lib/auth-context";
import { isAdminEmail } from "@/lib/admin";
import { course, days, missionItems } from "@/lib/course";
import { useStudentState } from "@/lib/use-student-state";

const buildLoop = [
  {
    step: "01",
    title: "Escolhe o foco do dia",
    body: "Entra, vê o próximo passo e evita cair numa homepage de marketing sempre que voltas ao workspace.",
  },
  {
    step: "02",
    title: "Constrói localmente",
    body: "O site orienta, mas o progresso real acontece no terminal, no código e nas entregas que guardas.",
  },
  {
    step: "03",
    title: "Fecha com prova",
    body: "Checklist, notas e artefactos ficam ligados ao teu perfil para continuares sem perder contexto.",
  },
];

const publicSignals = [
  { value: `${days.length}`, label: "dias com missões reais" },
  { value: `${course.totalPoints}`, label: "pontos ligados a entregas" },
  { value: "1 MVP", label: "produto para mostrar" },
];

export default function Home() {
  const { user, loading } = useAuth();
  const { stickyNotes, progress } = useStudentState();

  const startedItems = missionItems.filter((item) => progress[item.id]).length;
  const nextMission =
    missionItems.find((item) => !progress[item.id])?.slug ?? days.at(-1)?.slug ?? "00";
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
                  Bem-vindo de volta.
                  <br />
                  <span className="text-[var(--accent)]">Continua a construir</span> sem ruído.
                </h1>

                <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted-foreground)] sm:text-lg">
                  Esta home passa a ser o teu cockpit: próximo dia, progresso, notas e acessos úteis.
                  Menos landing. Mais sistema de trabalho.
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

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <div className="metric-card rounded-[1.5rem] p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                    Itens tocados
                  </p>
                  <p className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                    {startedItems}
                  </p>
                </div>
                <div className="metric-card rounded-[1.5rem] p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                    Notas ativas
                  </p>
                  <p className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                    {stickyNotes.length}
                  </p>
                </div>
                <div className="metric-card rounded-[1.5rem] p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                    Próximo foco
                  </p>
                  <p className="mt-3 text-xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                    Dia {nextMission}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <ProgressHub items={missionItems} days={days} />

          <section className="grid gap-5 lg:grid-cols-[0.88fr_1.12fr]">
            <div className="panel shell-frame rounded-[2rem] p-6 sm:p-8">
              <p className="kicker">Ritmo de trabalho</p>
              <h2 className="mt-3 font-serif text-3xl tracking-[-0.03em] text-[var(--foreground)] sm:text-4xl">
                Três momentos. Zero clutter.
              </h2>

              <div className="mt-6 space-y-4">
                {buildLoop.map((item) => (
                  <div key={item.step} className="panel-soft relative rounded-[1.5rem] p-4 pl-16 sm:p-5 sm:pl-18">
                    <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--cool-accent-soft)] text-sm font-semibold text-[var(--cool-accent)]">
                      {item.step}
                    </div>
                    <p className="text-base font-semibold text-[var(--foreground)]">{item.title}</p>
                    <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel shell-frame rounded-[2rem] p-6 sm:p-8">
              <p className="kicker">Acessos rápidos</p>
              <h2 className="mt-3 font-serif text-3xl tracking-[-0.03em] text-[var(--foreground)] sm:text-4xl">
                O que precisas agora.
              </h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <AppLink href={`/missions/${nextMission}`} className="panel-soft rounded-[1.45rem] p-5 transition duration-300 hover:border-[var(--cool-accent)] hover:bg-white">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">Missão</p>
                  <p className="mt-3 text-base font-semibold text-[var(--foreground)]">Retomar Dia {nextMission}</p>
                </AppLink>
                <AppLink href="/portfolio" className="panel-soft rounded-[1.45rem] p-5 transition duration-300 hover:border-[var(--cool-accent)] hover:bg-white">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">Portfolio</p>
                  <p className="mt-3 text-base font-semibold text-[var(--foreground)]">Ver progresso e entregas</p>
                </AppLink>
                <AppLink href="/resources" className="panel-soft rounded-[1.45rem] p-5 transition duration-300 hover:border-[var(--cool-accent)] hover:bg-white">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">Recursos</p>
                  <p className="mt-3 text-base font-semibold text-[var(--foreground)]">Abrir ficheiros e referências</p>
                </AppLink>
                {isAdmin ? (
                  <AppLink href="/admin" className="panel-soft rounded-[1.45rem] p-5 transition duration-300 hover:border-[var(--cool-accent)] hover:bg-white">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">Admin</p>
                    <p className="mt-3 text-base font-semibold text-[var(--foreground)]">Gerir chaves, alunos e reviews</p>
                  </AppLink>
                ) : null}
              </div>
            </div>
          </section>

          <RoadmapBoard days={days} />
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
