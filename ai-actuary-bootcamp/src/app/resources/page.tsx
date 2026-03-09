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
          <p className="kicker">
            Recursos
          </p>
          <span className="ink-rule mt-3" aria-hidden="true" />
          <h1 className="mt-4 max-w-4xl font-serif text-[3.2rem] leading-[0.92] tracking-[-0.04em] text-[var(--foreground)] sm:text-[4.6rem]">
            Ficheiros, referencias e datasets prontos para continuar localmente.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--muted-foreground)] sm:text-lg">
            Esta pagina substitui a dependencia da app antiga. O aluno encontra aqui os CSVs do Dia 0,
            o lab do Dia 1 e a referencia do Prophet sem sair do novo site.
          </p>
        </section>

        {groups.map((group) => (
          <DayResourcePanel
            key={group.id}
            title={`Recursos ${group.title}`}
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
