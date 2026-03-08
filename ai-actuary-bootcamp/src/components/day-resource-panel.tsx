import { readFile } from "node:fs/promises";

import {
  buildResourceDownloadHref,
  getResourceAbsolutePath,
  type ResourceFile,
} from "@/lib/resource-files";

type Props = {
  title?: string;
  subtitle?: string;
  resources: ResourceFile[];
};

async function readMarkdownPreview(resource: ResourceFile) {
  if (resource.kind !== "markdown") {
    return null;
  }

  const content = await readFile(getResourceAbsolutePath(resource), "utf8");
  return content
    .split(/\r?\n/)
    .slice(0, 18)
    .join("\n");
}

export async function DayResourcePanel({
  title = "Recursos desta aula",
  subtitle = "Tudo o que o estudante precisa sem sair da experiencia nova.",
  resources,
}: Props) {
  const markdownResource = resources.find((resource) => resource.kind === "markdown");
  const markdownPreview = markdownResource ? await readMarkdownPreview(markdownResource) : null;

  return (
    <section className="panel shell-frame rounded-[1.8rem] p-6">
      <p className="kicker">
        Recursos
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{subtitle}</p>

      <div className="mt-5 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-3">
          {resources.map((resource) => (
            <article
              key={resource.id}
              className="panel-soft rounded-[1.3rem] p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                    {resource.kind === "markdown" ? "Documento" : "CSV"}
                  </p>
                  <h3 className="mt-2 text-base font-semibold text-[var(--foreground)]">
                    {resource.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                    {resource.description}
                  </p>
                </div>

                <a
                  href={buildResourceDownloadHref(resource.id)}
                  className="button-secondary px-4 py-2 text-sm font-semibold"
                >
                  Download
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="tech-surface rounded-[1.4rem] p-5 text-white shadow-[0_22px_50px_rgba(29,39,48,0.22)]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
            Preview util
          </p>
          <h3 className="mt-3 text-lg font-semibold">
            {markdownResource ? markdownResource.title : "CSV prontos para analise"}
          </h3>
          <p className="mt-2 text-sm leading-7 text-white/72">
            {markdownResource
              ? "O documento do Prophet fica visivel logo aqui para o aluno perceber o contexto antes de abrir o OpenCode."
              : "Os ficheiros desta aula ficam num unico sitio, com download direto para continuar o trabalho local."}
          </p>
          <pre className="mt-4 overflow-x-auto rounded-[1.1rem] border border-white/10 bg-white/5 p-4 text-xs leading-6 text-white/88 whitespace-pre-wrap">
            {markdownPreview ?? "Usa estes downloads para trabalhar localmente e guardar os teus artefactos no mesmo workspace."}
          </pre>
        </div>
      </div>
    </section>
  );
}
