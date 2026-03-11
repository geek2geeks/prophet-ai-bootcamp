import { DayResourcePanel } from "@/components/day-resource-panel";
import { listResourceGroups } from "@/lib/resource-files";

export const metadata = {
  title: "Recursos | AI Actuary Bootcamp",
};

export default function ResourcesPage() {
  const groups = listResourceGroups();

  return (
    <main className="page-shell px-4 pb-28 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="panel-tech shell-frame soft-grid rounded-[2rem] p-6 sm:p-8">
          <p className="kicker">Biblioteca de recursos</p>
          <span className="ink-rule mt-3" aria-hidden="true" />
          <h1 className="mt-4 max-w-4xl font-serif text-[3.1rem] leading-[0.92] tracking-[-0.04em] text-[var(--foreground)] sm:text-[4.4rem]">
            Ficheiros reais para cada aula, sem links perdidos.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--muted-foreground)] sm:text-lg">
            Encontra aqui os ficheiros de apoio de cada dia: datasets, documentos, templates e outros
            materiais usados nas aulas e nos labs.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="metric-card rounded-[1.3rem] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Grupos ativos</p>
              <p className="mt-2 text-3xl font-semibold text-[var(--foreground)]">{groups.length}</p>
            </div>
            <div className="metric-card rounded-[1.3rem] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Ficheiros listados</p>
              <p className="mt-2 text-3xl font-semibold text-[var(--foreground)]">
                {groups.reduce((sum, group) => sum + group.files.length, 0)}
              </p>
            </div>
            <div className="metric-card rounded-[1.3rem] p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Uso recomendado</p>
              <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                Abrir o dia, descarregar o ficheiro, construir localmente e regressar para guardar prova.
              </p>
            </div>
          </div>
        </section>

        {groups.map((group) => (
          <DayResourcePanel
            key={group.id}
            title={`Dia ${group.title.replace("Dia ", "")}`}
            subtitle={group.description}
            resources={group.files}
            collapsible
            startExpanded={group.id === "day-0"}
          />
        ))}
      </div>
    </main>
  );
}
