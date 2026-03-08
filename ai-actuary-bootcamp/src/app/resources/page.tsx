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
        <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_18px_50px_rgba(22,27,45,0.06)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
            Recursos
          </p>
          <span className="ink-rule mt-3" aria-hidden="true" />
          <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-tight text-[var(--foreground)] sm:text-6xl">
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
          />
        ))}
      </div>
    </main>
  );
}
