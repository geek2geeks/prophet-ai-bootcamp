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

const DAY4_PROMPTS = [
  "Usa o mesmo prompt em DeepSeek e GLM-5 para rever uma spec curta. Depois compara os dois resultados em quatro pontos: clareza, acao, fiabilidade e custo.",
  "Le uma pagina de docs de um modelo e resume apenas isto: context window, structured output, tool use, custo e um exemplo de request.",
  "Cria um playbook simples: que modelo usar para planear, que modelo usar para segunda opiniao e que modelo usar para explicar resultados a um nao tecnico.",
];

export function Day4SinglePageLesson({ missionId, missionTitle, challenge, artifactHints }: Props) {
  return (
    <article className="space-y-8">
      <section className="panel shell-frame rounded-[1.8rem] p-6">
        <p className="kicker">Dia 4</p>
        <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">Escolher o modelo certo para a tarefa certa</h2>
        <div className="mt-4 space-y-4 text-sm leading-8 text-[var(--muted-foreground)]">
          <p>
            O Dia 4 existe para te tirar da ideia de que ha um modelo magico para tudo. Em trabalho real,
            alguns modelos ajudam mais a planear, outros ajudam mais a rever e outros sao melhores para
            respostas rapidas. A competencia do founder nao e adorar um modelo. E saber escolher bem.
          </p>
          <p>
            Hoje nao precisas de fazer benchmarking academico. Precisas apenas de comparar respostas em
            tarefas reais do bootcamp. Quando dois modelos recebem o mesmo pedido, consegues perceber
            rapidamente qual te deixa mais proximo de agir, qual explica melhor e qual inventa menos.
          </p>
        </div>
      </section>

      <section className="panel shell-frame rounded-[1.8rem] p-6">
        <h3 className="text-xl font-semibold text-[var(--foreground)]">O que importa nas comparacoes</h3>
        <div className="mt-4 space-y-4 text-sm leading-8 text-[var(--muted-foreground)]">
          <p>
            A regra do dia e simples: compara por workflow, nao por hype. Se queres rever uma spec,
            compara os modelos nesse trabalho. Se queres resumir um memo, compara-os nesse trabalho.
            Se queres sugerir uma API call, faz o mesmo. Isto da-te uma forma util de escolher sem te
            perder em benchmarks abstratos.
          </p>
          <p>
            Ao leres docs, tambem deves simplificar. Na pratica, para arrancar, basta perceber cinco
            coisas: contexto, custo, structured output, tool use e um exemplo minimo de request.
            Quase tudo o resto pode esperar.
          </p>
        </div>
      </section>

      <section className="panel shell-frame rounded-[1.8rem] p-6">
        <h3 className="text-xl font-semibold text-[var(--foreground)]">Exercicio do dia</h3>
        <div className="mt-4 space-y-6 text-sm leading-8 text-[var(--muted-foreground)]">
          <p>
            O exercicio do dia pode ser feito inteiro com o agente. Vais dar os mesmos pedidos a modelos
            diferentes e depois resumir o que aprendeste num playbook curto. O resultado nao precisa de
            ser sofisticado. Precisa de te deixar com uma regra reutilizavel.
          </p>
          <TerminalBlock commands={DAY4_PROMPTS} label="Chat do OpenCode" prompt=">" copyLabel="Copiar prompts" />
          <p>
            No fim, tenta responder a tres perguntas: qual modelo escolhes para planear, qual escolhes
            para segunda opiniao e qual escolhes para explicar trabalho a uma pessoa nao tecnica.
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
          missionLabel="Dia 04"
          artifactHints={artifactHints}
        />
      </section>
    </article>
  );
}
