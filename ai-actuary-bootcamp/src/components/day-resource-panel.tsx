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
  collapsible?: boolean;
  startExpanded?: boolean;
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
  collapsible = false,
  startExpanded = false,
}: Props) {
  const markdownResource = resources.find((resource) => resource.kind === "markdown");
  const markdownPreview = markdownResource ? await readMarkdownPreview(markdownResource) : null;

  const content = (
    <div className="mt-5 space-y-3">
      {resources.map((resource) => {
        const showPreview = resource.id === markdownResource?.id && markdownPreview;

        return (
          <article
            key={resource.id}
            className="panel-soft rounded-[1.3rem] p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="max-w-2xl">
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

            {showPreview ? (
              <details className="mt-4 rounded-[1.1rem] border border-[var(--border)] bg-white/70 p-3">
                <summary className="cursor-pointer list-none text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  Preview rapido
                </summary>
                <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-[0.95rem] bg-[var(--surface-subtle)] p-3 text-xs leading-6 text-[var(--muted-foreground)]">
                  {markdownPreview}
                </pre>
              </details>
            ) : null}
          </article>
        );
      })}
    </div>
  );

  if (collapsible) {
    return (
      <details open={startExpanded} className="panel shell-frame rounded-[1.8rem] p-6">
        <summary className="cursor-pointer list-none">
          <p className="kicker">
            Recursos
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">{title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted-foreground)]">{subtitle}</p>
        </summary>
        {content}
      </details>
    );
  }

  return (
    <section className="panel shell-frame rounded-[1.8rem] p-6">
      <p className="kicker">
        Recursos
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{subtitle}</p>
      {content}
    </section>
  );
}
