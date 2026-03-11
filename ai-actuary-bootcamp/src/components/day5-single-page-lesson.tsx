import { SubmissionPanel } from "@/components/submission-panel";
import { TerminalBlock } from "@/components/terminal-block";

type Challenge = {
  id: string;
  titulo: string;
  descricao: string;
  pontos: number;
};

type Props = {
  missionId: string;
  missionTitle: string;
  challenge: Challenge;
  artifactHints?: string[];
};

const RESOURCES = [["/course-assets/docs/prophet_reference_vida.md", "Referencia Prophet Vida"]] as const;

const DAY5_PROMPTS = [
  "Le o ficheiro prophet_reference_vida.md e resume apenas isto: que modulos sao realmente essenciais para um MVP de Vida e que modulos podem ficar fora sem destruir a credibilidade da demo.",
  "Cria um blueprint pequeno para Prophet Lite com: inputs, assumptions, projection deterministic, results e governance minima.",
  "Agora escreve uma lista explicita de out of scope para evitar scope creep no MVP.",
];

export function Day5SinglePageLesson({ missionId, missionTitle, challenge, artifactHints }: Props) {
  return (
    <article className="space-y-8">
      <section className="panel shell-frame rounded-[1.8rem] p-6">
        <p className="kicker">Dia 5</p>
        <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">Desenhar um Prophet Lite credível</h2>
        <div className="mt-4 space-y-4 text-sm leading-8 text-[var(--muted-foreground)]">
          <p>
            O Dia 5 existe para te ensinar uma disciplina importante: dizer nao. Quando alguem tenta
            copiar um produto como o Prophet, o erro mais comum e querer replicar tudo. Um MVP nao ganha
            por ter tudo. Ganha por resolver um workflow central com clareza, controlo e uma demo que faz sentido.
          </p>
          <p>
            Por isso esta aula e menos sobre arquitetura pesada e mais sobre foco. Vais olhar para o que
            faz sentido replicar numa primeira versao e para o que fica claramente fora. Esta distincao e
            o que transforma uma ideia vaga num blueprint vendavel.
          </p>
        </div>
      </section>

      <section className="panel shell-frame rounded-[1.8rem] p-6">
        <h3 className="text-xl font-semibold text-[var(--foreground)]">O que tens de perceber antes do exercicio</h3>
        <div className="mt-4 space-y-4 text-sm leading-8 text-[var(--muted-foreground)]">
          <p>
            O mercado confia no Prophet nao apenas pelo calculo, mas pela repetibilidade, pelo audit trail
            e pela capacidade de correr processos sem ambiguidade. Um produto novo nao precisa de copiar
            tudo isso no dia um. Precisa de copiar a espinha certa.
          </p>
          <p>
            Essa espinha, para o bootcamp, e simples: inputs claros, assumptions claras, run deterministic,
            resultados legiveis e governanca minima. Quando isto esta definido, o agente consegue propor
            uma arquitetura pequena e tu consegues explicar porque e que o MVP faz sentido.
          </p>
        </div>
      </section>

      <section className="panel shell-frame rounded-[1.8rem] p-6">
        <h3 className="text-xl font-semibold text-[var(--foreground)]">Ficheiro de apoio</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {RESOURCES.map(([href, label]) => (
            <a key={href} href={href} download className="rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent-soft)]">
              {label}
            </a>
          ))}
        </div>
      </section>

      <section className="panel shell-frame rounded-[1.8rem] p-6">
        <h3 className="text-xl font-semibold text-[var(--foreground)]">Exercicio do dia</h3>
        <div className="mt-4 space-y-6 text-sm leading-8 text-[var(--muted-foreground)]">
          <p>
            O exercicio do dia e transformar a referencia do Prophet num blueprint pequeno e credível.
            Para isso, vais usar o agente para resumir o que importa, propor os modulos essenciais e
            escrever uma lista firme do que fica fora. Se o scope nao estiver claro, o produto cresce sem controlo.
          </p>
          <TerminalBlock commands={DAY5_PROMPTS} label="Chat do OpenCode" prompt=">" copyLabel="Copiar prompts" />
          <p>
            O teu melhor resultado aqui nao e um documento bonito. E um blueprint que tu consigas defender
            em voz alta sem te perder em explicacoes longas.
          </p>
        </div>
      </section>

      <section className="panel-accent rounded-[1.8rem] p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">Entrega</p>
        <h3 className="mt-3 text-xl font-semibold text-[var(--foreground)]">{challenge.titulo}</h3>
        <p className="mt-3 text-sm leading-8 text-[var(--muted-foreground)]">{challenge.descricao}</p>
        <SubmissionPanel
          missionId={missionId}
          missionTitle={missionTitle}
          missionLabel="Dia 05"
          artifactHints={artifactHints}
        />
      </section>
    </article>
  );
}
