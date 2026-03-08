import { notFound } from "next/navigation";

import { AppLink } from "@/components/app-link";
import { Day1ReportingLab } from "@/components/day1-reporting-lab";
import { Day10LaunchConsole } from "@/components/day10-launch-console";
import { Day2SpecStudio } from "@/components/day2-spec-studio";
import { Day1ReviewPanel } from "@/components/day1-review-panel";
import { Day3SchemaApiSandbox } from "@/components/day3-schema-api-sandbox";
import { Day4ModelComparisonBoard } from "@/components/day4-model-comparison-board";
import { Day5ArchitectureScopeCanvas } from "@/components/day5-architecture-scope-canvas";
import { Day6DocumentPipelineWorkbench } from "@/components/day6-document-pipeline-workbench";
import { Day7PricingWireflowStudio } from "@/components/day7-pricing-wireflow-studio";
import { Day8ValidationRunTracker } from "@/components/day8-validation-run-tracker";
import { Day9IntegrationWorkspace } from "@/components/day9-integration-workspace";
import { DayResourcePanel } from "@/components/day-resource-panel";
import { MissionWorkspaceTools } from "@/components/mission-workspace-tools";
import { SharedKeyVault } from "@/components/shared-key-vault";
import { SubmissionPanel } from "@/components/submission-panel";
import { days, getDayBySlug } from "@/lib/course";
import { getDay1ReportingLabData } from "@/lib/day1-lab-data";
import { getExperienceGuide } from "@/lib/day-experience";
import { EXTENDED_REVIEW_DAYS, getReviewPreset } from "@/lib/review-presets";
import { getResourceGroup } from "@/lib/resource-files";
import { RouteGuard } from "@/components/route-guard";

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

  return (
    <RouteGuard>
      <main className="page-shell px-4 pb-28 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="panel-tech shell-frame soft-grid rounded-[2.2rem] p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted-foreground)]">
              <AppLink href="/" className="font-medium text-[var(--foreground)]">
                Inicio do curso
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
                <AppLink
                  href={`/missions/${nextDay.slug}`}
                  className="button-primary px-4 py-2 text-sm"
                >
                  Dia seguinte
                </AppLink>
              ) : null}
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="kicker">
                Aula do dia {day.slug}
              </p>
              <span className="ink-rule mt-3" aria-hidden="true" />
              <h1 className="mt-4 max-w-4xl font-serif text-[3.2rem] leading-[0.92] tracking-[-0.04em] text-[var(--foreground)] sm:text-[4.75rem]">
                {day.titulo}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--muted-foreground)] sm:text-lg">
                {day.objetivo}
              </p>
            </div>

            <div className="panel-soft rounded-[1.5rem] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">
                O que significa ter sucesso hoje
              </p>
              <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted-foreground)]">
                <p>- Perceber os conceitos da aula bem o suficiente para agir sobre eles.</p>
                <p>- Mudar para ferramentas locais no momento certo em vez de ficar preso ao navegador.</p>
                <p>- Voltar com evidencia, notas e o desafio marcado como concluido.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <section className="panel shell-frame rounded-[1.8rem] p-6">
              <p className="kicker">
                Visao geral
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
                Porque e que esta aula importa
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                {guide.headline}
              </p>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <div className="panel-soft rounded-[1.3rem] p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                      Tamanho da aula
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                      {day.exercicios.length} exercicios · {day.topicCount} topicos
                  </p>
                </div>
                <div className="panel-soft rounded-[1.3rem] p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                      Pontos da missao
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                      {day.totalMissionPoints} pontos
                  </p>
                </div>
                <div className="panel-soft rounded-[1.3rem] p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                      Passo local principal
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                    {guide.cliMoments[0]?.label}
                  </p>
                </div>
              </div>
            </section>

            <section className="panel shell-frame rounded-[1.8rem] p-6">
              <p className="kicker">
                Como trabalhar hoje
              </p>
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div className="panel-soft rounded-[1.3rem] p-4">
                  <p className="font-semibold text-[var(--foreground)]">No navegador</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                    {guide.localFirst}
                  </p>
                </div>

                <div className="panel-soft rounded-[1.3rem] p-4">
                  <p className="font-semibold text-[var(--foreground)]">Nas ferramentas locais</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                    {guide.cliMoments[0]?.detail}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {guide.toolRoles.map((toolRole) => (
                  <span
                    key={toolRole.tool}
                    className="glass-pill rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]"
                  >
                    {toolRole.tool}
                  </span>
                ))}
              </div>
            </section>

            {dayResourceGroup ? (
              <DayResourcePanel
                title={`Recursos do Dia ${day.slug}`}
                subtitle="Downloads diretos e referencias que substituem as dependencias da app antiga."
                resources={dayResourceGroup.files}
              />
            ) : null}

            {day.dia === 0 ? <SharedKeyVault /> : null}

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

            <section className="panel shell-frame rounded-[1.8rem] p-6">
              <p className="kicker">
                Aprender
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
                Trabalhar um modulo de cada vez.
              </h2>
              <div className="mt-5 space-y-4">
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
                          <h3 className="font-medium text-[var(--foreground)]">
                            {topic.titulo}
                          </h3>
                          <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                            {topic.conteudo}
                          </p>
                        </article>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </section>

            <section className="panel shell-frame rounded-[1.8rem] p-6">
              <p className="kicker">
                Praticar
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
                Exercicios que levam a aula para a execucao local.
              </h2>
              <div className="mt-5 space-y-4">
                {day.exercicios.map((exercise, index) => (
                  <article
                    key={exercise.id}
                    className="rounded-[1.5rem] border border-[var(--border)] bg-white/84 p-5 shadow-[0_12px_30px_rgba(47,41,34,0.05)]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                          Exercicio {index + 1} · {exercise.id}
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
                          maxScore={exercise.pontos}
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
            </section>

            <section className="panel rounded-[1.8rem] p-6">
              <p className="kicker">
                Construir localmente
              </p>
              <div className="mt-5 space-y-4">
                {guide.cliMoments.map((moment, index) => (
                  <div
                    key={moment.label}
                    className="panel-soft grid gap-4 rounded-[1.3rem] p-4 md:grid-cols-[auto_1fr]"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-semibold text-[var(--accent)]">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--foreground)]">{moment.label}</p>
                      <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                        {moment.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="panel-accent rounded-[1.8rem] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                Desafio
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
                {day.desafio.titulo}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">
                {day.desafio.descricao}
              </p>

              {EXTENDED_REVIEW_DAYS.has(day.dia) ? (
                <div className="mt-5">
                  <Day1ReviewPanel
                    itemId={day.desafio.id}
                    itemType="challenge"
                    title={day.desafio.titulo}
                    description={day.desafio.descricao}
                    maxScore={day.desafio.pontos}
                    extraContext={getReviewPreset(day.desafio.id).extraContext}
                  />
                </div>
              ) : null}
            </section>

            <SubmissionPanel
              missionId={day.slug}
              missionTitle={day.titulo}
              missionLabel={`Dia ${day.slug}`}
              artifactHints={guide.artifactList}
            />
          </div>

          <aside className="xl:sticky xl:top-24 xl:self-start">
            <MissionWorkspaceTools
              dayNumber={day.dia}
              daySlug={day.slug}
              dayTitle={day.titulo}
              exercises={day.exercicios}
              challenge={day.desafio}
              cliLabel={guide.cliMoments[0]?.label ?? "Usa ferramentas locais quando a aula o pedir."}
              artifactList={guide.artifactList}
            />
          </aside>
        </div>
      </div>
    </main>
    </RouteGuard>
  );
}
