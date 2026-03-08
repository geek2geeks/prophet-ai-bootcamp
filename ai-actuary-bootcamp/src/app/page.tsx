import Link from "next/link";

import { ProgressHub } from "@/components/progress-hub";
import { RoadmapBoard } from "@/components/roadmap-board";
import { course, days, missionItems } from "@/lib/course";

const methodology = [
  {
    title: "Abrir a aula com objetivo claro",
    body: "Cada dia começa com uma missao concreta, criterios de sucesso e artefactos esperados para reduzir hesitacao logo nos primeiros minutos.",
  },
  {
    title: "Sair para o terminal no momento certo",
    body: "A plataforma diz quando deves mudar para OpenCode, Python, DeepSeek ou o teu ambiente local em vez de te prender a leitura passiva.",
  },
  {
    title: "Voltar com prova reutilizavel",
    body: "Notas, entregas e checkpoints ficam guardados para o teu raciocinio nao desaparecer entre sessoes de build.",
  },
];

const buildOutcomes = [
  "Motor deterministico para projecoes de vida",
  "Copiloto AI com contexto atuarial do produto",
  "Document drop com OCR e memoria pesquisavel",
  "Landing, pricing e narrativa de lancamento",
];

const founderSignals = [
  {
    value: "11",
    label: "dias orientados a produto",
  },
  {
    value: "675",
    label: "pontos alinhados a entregas reais",
  },
  {
    value: "1",
    label: "MVP Prophet Lite para mostrar ao mercado",
  },
];

export default function Home() {
  return (
    <main className="page-shell px-4 pb-28 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="grid gap-5 xl:grid-cols-[1.18fr_0.82fr]">
          <div className="panel relative overflow-hidden rounded-[2.25rem] px-6 py-7 sm:px-8 sm:py-9">
            <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_left,rgba(181,95,50,0.18),transparent_56%)]" />
            <div className="absolute right-[-3.5rem] top-10 h-40 w-40 rounded-full border border-[rgba(181,95,50,0.16)] bg-[rgba(255,255,255,0.28)] blur-sm" />
            <div className="relative">
              <div className="flex flex-wrap items-center gap-3">
                <span className="glass-pill inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--foreground)]">
                  <span className="accent-dot" aria-hidden="true" />
                  Inicio do curso
                </span>
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  Builder track para atuarios
                </span>
              </div>
              <h1 className="mt-6 max-w-5xl font-serif text-[3.25rem] leading-[0.95] text-[var(--foreground)] sm:text-[4.5rem] xl:text-[5.15rem]">
                Constrói o teu
                <span className="text-[var(--accent)]"> Prophet Lite</span>
                <br />
                e aprende a pensar como fundador AI-native.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--muted-foreground)] sm:text-lg">
                Este bootcamp nao foi desenhado para te transformar em mais um operador de ferramentas.
                Foi desenhado para te levar de atuario funcional a builder com criterio de produto,
                stack moderna e um MVP pronto para demonstrar a uma equipa real.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/missions/00"
                  className="inline-flex items-center rounded-full bg-[linear-gradient(135deg,var(--accent),#d88657)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_36px_rgba(181,95,50,0.26)] transition hover:translate-y-[-1px] hover:bg-[linear-gradient(135deg,var(--accent-strong),var(--accent))]"
                >
                  Comecar Dia 00
                </Link>
                <a
                  href="#roadmap"
                  className="inline-flex items-center rounded-full border border-[var(--border-strong)] bg-white/70 px-6 py-3.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent-soft)] hover:bg-white"
                >
                  Ver roteiro completo
                </a>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {founderSignals.map((signal) => (
                  <div key={signal.label} className="metric-card rounded-[1.4rem] px-4 py-4">
                    <p className="text-3xl font-semibold text-[var(--foreground)]">{signal.value}</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">{signal.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="panel-accent rounded-[2rem] p-6">
              <p className="kicker">O que sais daqui a construir</p>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
                Um produto pequeno, vendavel e tecnicamente credivel.
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                Em vez de consumir aulas dispersas, vais fechar um fluxo de produto completo:
                calculo, interface, memoria documental, copiloto e deploy.
              </p>
              <div className="mt-5 space-y-2.5">
                {buildOutcomes.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-[1.2rem] bg-white/72 px-4 py-3">
                    <span className="accent-dot mt-1.5 shrink-0" aria-hidden="true" />
                    <p className="text-sm leading-6 text-[var(--foreground)]">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel rounded-[2rem] p-6">
              <p className="kicker">Curriculum em resumo</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-3xl font-semibold text-[var(--foreground)]">{days.length}</p>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">Dias no programa</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold text-[var(--foreground)]">{course.totalPoints}</p>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">Pontos do percurso</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">{course.subtitle}</p>
            </div>
          </div>
        </section>

        <ProgressHub items={missionItems} days={days} />

        <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="panel rounded-[2rem] p-6 sm:p-8">
            <p className="kicker">Como a plataforma funciona</p>
            <h2 className="mt-3 font-serif text-3xl text-[var(--foreground)] sm:text-4xl">
              Menos leitura passiva. Mais ciclos curtos de build.
            </h2>
            <div className="mt-6 grid gap-4">
              {methodology.map((item, index) => (
                <div
                  key={item.title}
                  className="panel-soft grid gap-4 rounded-[1.5rem] p-4 md:grid-cols-[auto_1fr]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-semibold text-[var(--accent)] shadow-[0_8px_24px_rgba(47,41,34,0.08)]">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--foreground)]">{item.title}</p>
                    <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="panel rounded-[2rem] p-6 sm:p-8">
            <p className="kicker">Aplicacoes, nao scripts</p>
            <h2 className="mt-3 font-serif text-3xl text-[var(--foreground)] sm:text-4xl">
              A stack moderna entra ao servico de um workflow real.
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">
              O curso liga Next.js, Python, DeepSeek e ferramentas de CLI a um caso de uso que
              faz sentido para uma equipa atuarial pequena: projetar, explicar, documentar e lançar.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {([
                "Next.js para a experiencia do produto",
                "Python para o motor deterministico",
                "DeepSeek para copiloto e workflows",
                "CLI para build, iteracao e deploy",
              ] as const).map((feat) => (
                <div key={feat} className="panel-soft rounded-[1.3rem] px-4 py-4 text-sm font-medium text-[var(--foreground)]">
                  {feat}
                </div>
              ))}
            </div>
          </div>
        </section>

        <RoadmapBoard days={days} />

        <section
          id="how-it-works"
          className="panel rounded-[2rem] p-6 sm:p-8"
        >
          <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
            <div>
              <p className="kicker">O resultado final</p>
              <h2 className="mt-3 font-serif text-3xl text-[var(--foreground)] sm:text-4xl">
                O que levas contigo no Dia 10.
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">
                Nao sais apenas com notas. Sais com um ativo de produto, um processo de build e
                uma narrativa clara para continuar a iterar depois do bootcamp.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="panel-soft rounded-[1.5rem] p-4">
                <p className="font-semibold text-[var(--foreground)]">MVP funcional</p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  Um motor atuarial pequeno mas robusto, ligado a uma interface que mostra valor logo numa demo.
                </p>
              </div>
              <div className="panel-soft rounded-[1.5rem] p-4">
                <p className="font-semibold text-[var(--foreground)]">Playbooks de IA</p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  Specs, prompts, criterios e processos repetiveis para continuares a construir com controlo.
                </p>
              </div>
              <div className="panel-soft rounded-[1.5rem] p-4">
                <p className="font-semibold text-[var(--foreground)]">Portefolio de lancamento</p>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  README, copy, demo e material suficiente para mostrar o produto a equipa, clientes ou parceiros.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
