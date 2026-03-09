import { notFound } from "next/navigation";

import { AppLink } from "@/components/app-link";
import { Day1ReportingLab } from "@/components/day1-reporting-lab";
import { Day1ReviewPanel } from "@/components/day1-review-panel";
import { Day10LaunchConsole } from "@/components/day10-launch-console";
import { Day2SpecStudio } from "@/components/day2-spec-studio";
import { Day3SchemaApiSandbox } from "@/components/day3-schema-api-sandbox";
import { Day4ModelComparisonBoard } from "@/components/day4-model-comparison-board";
import { Day5ArchitectureScopeCanvas } from "@/components/day5-architecture-scope-canvas";
import { Day6DocumentPipelineWorkbench } from "@/components/day6-document-pipeline-workbench";
import { Day7PricingWireflowStudio } from "@/components/day7-pricing-wireflow-studio";
import { Day8ValidationRunTracker } from "@/components/day8-validation-run-tracker";
import { Day9IntegrationWorkspace } from "@/components/day9-integration-workspace";
import { DayResourcePanel } from "@/components/day-resource-panel";
import { MissionWorkspaceTools } from "@/components/mission-workspace-tools";
import { RouteGuard } from "@/components/route-guard";
import { SharedKeyVault } from "@/components/shared-key-vault";
import { SubmissionPanel } from "@/components/submission-panel";
import { MermaidDiagram } from "@/components/mermaid-diagram";
import { days, getDayBySlug } from "@/lib/course";
import { getDay1ReportingLabData } from "@/lib/day1-lab-data";
import { getExperienceGuide } from "@/lib/day-experience";
import { EXTENDED_REVIEW_DAYS, getReviewPreset } from "@/lib/review-presets";
import { getResourceGroup } from "@/lib/resource-files";

function SectionFrame({
  id,
  kicker,
  title,
  description,
  children,
}: {
  id?: string;
  kicker: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="panel shell-frame rounded-[1.8rem] p-6">
      <p className="kicker">{kicker}</p>
      <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">{title}</h2>
      {description ? (
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted-foreground)]">
          {description}
        </p>
      ) : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

type Props = {
  params: Promise<{
    day: string;
  }>;
};

export function generateStaticParams() {
  return days.map((day) => ({ day: day.slug }));
}

export const dynamicParams = false;

export default async function MissionPage({ params }: Props) {
  const { day: daySlug } = await params;
  const day = getDayBySlug(daySlug);

  if (!day) {
    notFound();
  }

  const guide = getExperienceGuide(day.dia);
  const currentIndex = days.findIndex((item) => item.slug === day.slug);
  const previousDay = currentIndex > 0 ? days[currentIndex - 1] : null;
  const nextDay = currentIndex < days.length - 1 ? days[currentIndex + 1] : null;
  const modules = Object.entries(day.conteudo);
  const dayResourceGroup = getResourceGroup(`day-${day.dia}`);
  const day1LabData = day.dia === 1 ? await getDay1ReportingLabData() : null;
  const primaryLocalMoment = guide.cliMoments[0];

  return (
    <RouteGuard>
      <main className="page-shell px-4 pb-28 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <section className="panel-tech shell-frame soft-grid rounded-[2.2rem] p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted-foreground)]">
                <AppLink href="/" className="font-medium text-[var(--foreground)]">
                  Workspace
                </AppLink>
                <span>/</span>
                <span>Dia {day.slug}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {previousDay ? (
                  <AppLink
                    href={`/missions/${previousDay.slug}`}
                    className="button-secondary px-4 py-2 text-sm font-medium"
                  >
                    Dia anterior
                  </AppLink>
                ) : null}

                {nextDay ? (
                  <AppLink href={`/missions/${nextDay.slug}`} className="button-primary px-4 py-2 text-sm">
                    Dia seguinte
                  </AppLink>
                ) : null}
              </div>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <p className="kicker">Aula do dia {day.slug}</p>
                <span className="ink-rule mt-3" aria-hidden="true" />
                <h1 className="mt-4 max-w-4xl font-serif text-[3.1rem] leading-[0.92] tracking-[-0.04em] text-[var(--foreground)] sm:text-[4.55rem]">
                  {day.titulo}
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--muted-foreground)] sm:text-lg">
                  {day.objetivo}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="#aprender" className="button-secondary px-5 py-3 text-sm font-semibold">
                    Ler o essencial
                  </a>
                  <a href="#fazer" className="button-primary px-5 py-3 text-sm">
                    Ir para exercicios
                  </a>
                  <a href="#entregar" className="button-secondary px-5 py-3 text-sm font-semibold">
                    Fechar a entrega
                  </a>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="metric-card rounded-[1.5rem] p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                    Estrutura
                  </p>
                  <p className="mt-3 text-base font-semibold text-[var(--foreground)]">
                    {day.exercicios.length} exercicios + 1 desafio
                  </p>
                </div>
                <div className="metric-card rounded-[1.5rem] p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                    Valor da aula
                  </p>
                  <p className="mt-3 text-base font-semibold text-[var(--foreground)]">
                    {day.totalMissionPoints} pontos
                  </p>
                </div>
                <div className="metric-card rounded-[1.5rem] p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                    Momento local
                  </p>
                  <p className="mt-3 text-base font-semibold text-[var(--foreground)]">
                    {primaryLocalMoment?.label ?? "Construir no teu workspace"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="space-y-6">
            <MissionWorkspaceTools
              dayNumber={day.dia}
              dayTitle={day.titulo}
              exercises={day.exercicios}
              challenge={day.desafio}
              artifactList={guide.artifactList}
            />

            <SectionFrame
              kicker="Fluxo do dia"
              title="Segue isto de cima para baixo."
              description="Cada aula deve mostrar primeiro o que perceber, depois o que construir, depois o que responder e no fim o que entregar."
            >
              <div className="space-y-4">
                <article className="panel-soft rounded-[1.35rem] p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                    1. Entender
                  </p>
                  <p className="mt-2 text-base font-semibold text-[var(--foreground)]">
                    Porque este dia importa
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                    {guide.headline}
                  </p>
                </article>

                <article className="panel-soft rounded-[1.35rem] p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                    2. Construir
                  </p>
                  <p className="mt-2 text-base font-semibold text-[var(--foreground)]">
                    Quando sair da plataforma
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                    {guide.localFirst}
                  </p>
                </article>

                <article className="panel-soft rounded-[1.35rem] p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                    3. Fechar
                  </p>
                  <p className="mt-2 text-base font-semibold text-[var(--foreground)]">
                    O sinal de que acabaste
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                    Guarda a prova util do trabalho local e fecha com o desafio <span className="font-medium text-[var(--foreground)]">{day.desafio.titulo}</span>.
                  </p>
                </article>
              </div>

              {guide.cliMoments.length > 1 ? (
                <details className="mt-4 rounded-[1.35rem] border border-[var(--border)] bg-white/75 p-4">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--foreground)]">
                    Ver momentos locais deste dia
                  </summary>
                  <div className="mt-4 space-y-3">
                    {guide.cliMoments.map((moment, index) => (
                      <div key={moment.label} className="panel-soft rounded-[1.15rem] p-4">
                        <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                          Momento {index + 1}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">{moment.label}</p>
                        <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                          {moment.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </details>
              ) : null}
            </SectionFrame>

            {dayResourceGroup ? (
              <DayResourcePanel
                title={`Recursos do Dia ${day.slug}`}
                subtitle="Um sitio so para os ficheiros desta aula, sem previews gigantes nem repeticao de contexto."
                resources={dayResourceGroup.files}
                collapsible
                startExpanded={false}
              />
            ) : null}

            {day.dia === 0 ? <SharedKeyVault /> : null}

            <SectionFrame
              id="aprender"
              kicker="Aprender"
              title="Le o minimo necessario e avanca."
              description="Os modulos ficam por blocos para nao transformar a aula numa parede de texto."
            >
              <div className="space-y-4">
                {modules.map(([moduleKey, moduleContent], index) => (
                  <details
                    key={moduleKey}
                    open={index === 0}
                    className="panel-soft rounded-[1.4rem] p-4"
                  >
                    <summary className="cursor-pointer list-none">
                      <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                        Modulo {index + 1}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                        {moduleContent.titulo}
                      </p>
                    </summary>
                    <div className="mt-4 grid gap-3">
                      {moduleContent.topicos.map((topic) => (
                        <article
                          key={`${moduleKey}-${topic.titulo}`}
                          className="rounded-[1.1rem] border border-[var(--border)] bg-white/82 p-4 shadow-[0_10px_24px_rgba(47,41,34,0.04)]"
                        >
                          <h3 className="font-medium text-[var(--foreground)]">{topic.titulo}</h3>
                          {topic.imagemUrl && (
                            <img
                              src={topic.imagemUrl}
                              alt={topic.titulo}
                              className="mt-3 w-full max-w-2xl rounded-lg border border-[var(--border)] object-cover shadow-sm"
                            />
                          )}
                          {topic.mermaid && (
                            <MermaidDiagram chart={topic.mermaid} />
                          )}
                          <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)] whitespace-pre-line">
                            {topic.conteudo}
                          </p>
                        </article>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </SectionFrame>

            {day1LabData ? (
              <Day1ReportingLab
                rows={day1LabData.rows}
                tasks={day1LabData.tasks}
                summary={day1LabData.summary}
              />
            ) : null}

            {day.dia === 2 ? <Day2SpecStudio /> : null}
            {day.dia === 3 ? <Day3SchemaApiSandbox /> : null}
            {day.dia === 4 ? <Day4ModelComparisonBoard /> : null}
            {day.dia === 5 ? <Day5ArchitectureScopeCanvas /> : null}
            {day.dia === 6 ? <Day6DocumentPipelineWorkbench /> : null}
            {day.dia === 7 ? <Day7PricingWireflowStudio /> : null}
            {day.dia === 8 ? <Day8ValidationRunTracker /> : null}
            {day.dia === 9 ? <Day9IntegrationWorkspace /> : null}
            {day.dia === 10 ? <Day10LaunchConsole /> : null}

            <SectionFrame
              id="fazer"
              kicker="Praticar"
              title="Exercicios com peso real no build."
              description="Cada exercicio deve levar a uma decisao, um output local ou uma prova concreta."
            >
              <div className="space-y-4">
                {day.exercicios.map((exercise, index) => (
                  <article
                    key={exercise.id}
                    className="rounded-[1.5rem] border border-[var(--border)] bg-white/84 p-5 shadow-[0_12px_30px_rgba(47,41,34,0.05)]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                          Exercicio {index + 1} - {exercise.id}
                        </p>
                        <h3 className="mt-2 text-xl font-semibold text-[var(--foreground)]">
                          {exercise.titulo}
                        </h3>
                      </div>
                      <span className="glass-pill rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                        {exercise.pontos} pts
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">
                      {exercise.descricao}
                    </p>

                    {EXTENDED_REVIEW_DAYS.has(day.dia) ? (
                      <div className="mt-5">
                        <Day1ReviewPanel
                          itemId={exercise.id}
                          itemType="exercise"
                          title={exercise.titulo}
                          description={exercise.descricao}
                          extraContext={
                            exercise.id === "ex1.7" && day1LabData
                              ? [
                                  `Delta lucro tecnico total: EUR ${day1LabData.summary.totalDeltaLucro}`,
                                  `Delta reserva total: EUR ${day1LabData.summary.totalDeltaReserva}`,
                                  `Delta sinistros total: EUR ${day1LabData.summary.totalDeltaSinistros}`,
                                  `Horas manuais por ciclo: ${day1LabData.summary.totalManualHours}`,
                                  `Top segmentos por deterioracao do lucro: ${day1LabData.rows
                                    .slice()
                                    .sort((a, b) => a.deltaLucro - b.deltaLucro)
                                    .slice(0, 3)
                                    .map((row) => `${row.segmentLabel} (${row.deltaLucro})`)
                                    .join("; ")}`,
                                  `Top segmentos por subida de reserva: ${day1LabData.rows
                                    .slice()
                                    .sort((a, b) => b.deltaReserva - a.deltaReserva)
                                    .slice(0, 3)
                                    .map((row) => `${row.segmentLabel} (${row.deltaReserva})`)
                                    .join("; ")}`,
                                  `Top tarefas manuais: ${day1LabData.tasks
                                    .slice()
                                    .sort((a, b) => b.tempoManualHoras - a.tempoManualHoras)
                                    .slice(0, 3)
                                    .map((task) => `${task.tarefa} (${task.tempoManualHoras}h)`)
                                    .join("; ")}`,
                                ].join("\n")
                              : getReviewPreset(exercise.id).extraContext
                          }
                          compact
                        />
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            </SectionFrame>

            <section id="entregar" className="panel-accent rounded-[1.8rem] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                Entregar
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
                Fecha o dia com uma prova clara.
              </h2>
              <div className="mt-5 space-y-5">
                <div className="rounded-[1.4rem] border border-[rgba(17,32,46,0.08)] bg-white/78 p-5 shadow-[0_12px_26px_rgba(47,41,34,0.06)]">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                    Desafio final
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-[var(--foreground)]">
                    {day.desafio.titulo}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                    {day.desafio.descricao}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="glass-pill rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                      {day.desafio.pontos} pts
                    </span>
                    <span className="glass-pill rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                      1 entrega clara
                    </span>
                  </div>

                  {EXTENDED_REVIEW_DAYS.has(day.dia) ? (
                    <div className="mt-5">
                      <Day1ReviewPanel
                        itemId={day.desafio.id}
                        itemType="challenge"
                        title={day.desafio.titulo}
                        description={day.desafio.descricao}
                        extraContext={getReviewPreset(day.desafio.id).extraContext}
                      />
                    </div>
                  ) : null}
                </div>

                <SubmissionPanel
                  missionId={day.slug}
                  missionTitle={day.titulo}
                  missionLabel={`Dia ${day.slug}`}
                  artifactHints={guide.artifactList}
                />
              </div>
            </section>
          </div>
        </div>
      </main>
    </RouteGuard>
  );
}
