import { GlossaryText } from "@/components/glossary-text";
import { SubmissionPanel } from "@/components/submission-panel";
import { TerminalBlock } from "@/components/terminal-block";
import { DAY2_GLOSSARY } from "@/lib/day2-glossary";

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

const RESOURCES = [
  ["/course-assets/day2/carteira_vida_sample_day2.csv", "Dataset base"],
  ["/course-assets/day2/day2_report_brief.md", "Brief do relatorio"],
  ["/course-assets/day2/day2_deepseek_prompt_template.md", "Prompt base DeepSeek"],
  ["/course-assets/day2/day2_metrics_reference.md", "Validacao de metricas"],
  ["/course-assets/day2/day2_dataset_scenarios.md", "Datasets alternativos"],
] as const;

const SETUP_COMMANDS = [
  "mkdir relatorio-executivo-pdf",
  "cd relatorio-executivo-pdf",
  "npm install -g firebase-tools",
  "firebase login",
  "gcloud init",
  "Set-Content -Path .env.local -Value \"DEEPSEEK_API_KEY=cola_aqui_a_tua_chave\"",
];

const SPEC_KIT_PROMPTS = [
  "/speckit.constitution Criar principios para uma webapp portuguesa-first que transforma um CSV atuarial num dashboard curto e num PDF executivo. Exigir clareza visual, linguagem nao tecnica, validacao do ficheiro antes de processamento, citacao explicita das metricas usadas no texto AI e proibicao de conclusoes nao suportadas pelos dados.",
  "/speckit.specify Quero uma webapp simples em portugues que leia o ficheiro carteira_vida_sample_day2.csv, calcule total de apolices, idade media, premio anual total, capital segurado total e mistura por tipo de produto e estado. A app deve mostrar estes numeros num dashboard legivel e permitir gerar um PDF executivo de seguros Vida para decisores nao tecnicos.",
  "/speckit.clarify",
  "/speckit.plan",
  "/speckit.tasks",
  "/speckit.implement",
];

const DEPLOY_COMMANDS = [
  "npm run build",
  "firebase init hosting",
  "firebase deploy --only hosting",
];

export function Day2SinglePageLesson({ missionId, missionTitle, challenge, artifactHints }: Props) {
  return (
    <article className="space-y-8">
      <section className="panel shell-frame rounded-[1.8rem] p-6">
        <p className="kicker">Dia 2</p>
        <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">Da ideia a uma app publicada</h2>
        <div className="mt-4 space-y-4 text-sm leading-8 text-[var(--muted-foreground)]">
          <p>
            O objetivo deste dia nao e ensinar-te a programar. O objetivo e ensinar-te a dar
            instrucoes claras a um agente no terminal para que ele consiga construir uma primeira
            versao de um produto por ti. Hoje isso acontece com um mini projeto muito simples: ler um
            ficheiro CSV de seguros Vida, mostrar algumas metricas num dashboard, gerar um PDF
            executivo e publicar o resultado.
          </p>
          <p>
            A parte importante e a ordem. Primeiro decides o que a app deve fazer. Depois pedes ao
            agente para transformar essa ideia em trabalho concreto. So no fim publicas e envias o
            URL ao tutor. Se saltares logo para o build, vais perder-te. Se seguires a ordem, o dia
            fica bastante mais leve do que parece.
          </p>
          <p>
            Ao longo da aula vais ver alguns termos destacados, como <GlossaryText text="GitHub Spec Kit" glossary={DAY2_GLOSSARY} />,
            <GlossaryText text="constitution.md" glossary={DAY2_GLOSSARY} /> ou <GlossaryText text="LLM" glossary={DAY2_GLOSSARY} />.
            Nao precisas de os dominar de forma academica. Basta perceberes o papel de cada um: um
            ajuda-te a organizar o pedido, outro fixa regras permanentes, e o modelo AI executa melhor
            quando recebe contexto claro.
          </p>
        </div>
      </section>

      <section className="panel shell-frame rounded-[1.8rem] p-6">
        <h3 className="text-xl font-semibold text-[var(--foreground)]">O que tens de perceber antes do exercicio</h3>
        <div className="mt-4 space-y-4 text-sm leading-8 text-[var(--muted-foreground)]">
          <p>
            Uma boa aula deste tipo nao comeca com comandos. Comeca com uma pergunta simples: que
            resultado quero ver no fim? Neste caso, o resultado e muito concreto. Queres um site que
            abra, leia um dataset de Vida, mostre quatro ou cinco numeros importantes e gere um PDF
            curto que uma pessoa de negocio consiga ler sem precisar de interpretar tabelas cruas.
          </p>
          <p>
            E por isso que a <GlossaryText text="spec" glossary={DAY2_GLOSSARY} /> vem antes do build. A spec e so um documento curto que explica o que entra,
            o que sai e o que conta como pronto. Nao e um exercicio de escrita. E uma forma de evitar
            que o agente invente comportamento, nomes ou passos que tu nao pediste. Quando isso fica
            claro, o trabalho do agente melhora muito.
          </p>
          <p>
            O papel do DeepSeek tambem deve ser simples neste dia. Nao vai pensar o produto por ti.
            Vai escrever a parte narrativa do PDF depois de a tua app ja ter resumido os numeros da
            carteira. Ou seja: primeiro dados, depois metricas, depois texto. Isto impede que o modelo
            invente conclusoes sem base.
          </p>
        </div>
      </section>

      <section className="panel shell-frame rounded-[1.8rem] p-6">
        <h3 className="text-xl font-semibold text-[var(--foreground)]">Ficheiros de apoio</h3>
        <p className="mt-3 text-sm leading-8 text-[var(--muted-foreground)]">
          Para fechares a tarefa nao precisas de procurar dados nem inventar prompts. Usa estes
          ficheiros e segue a ordem abaixo.
        </p>
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
            Agora sim: vais executar o trabalho. Primeiro preparas a pasta local e as ferramentas. Depois
            pedes ao agente para criar a <GlossaryText text="constitution.md" glossary={DAY2_GLOSSARY} /> e a spec. Depois deixas o agente implementar. No fim,
            publicas o site e envias o URL ao tutor. Se copiares e colares estes blocos por ordem, nao te
            falta nada para completar o dia.
          </p>
          <TerminalBlock commands={SETUP_COMMANDS} label="Terminal / PowerShell" copyLabel="Copiar comandos" />
          <TerminalBlock commands={SPEC_KIT_PROMPTS} label="Chat do OpenCode" prompt=">" copyLabel="Copiar prompts" />
          <TerminalBlock commands={DEPLOY_COMMANDS} label="Terminal / PowerShell" copyLabel="Copiar comandos" />
          <p>
            No fim, confirma quatro coisas: o site abre, o dataset e lido, o PDF e gerado com linguagem
            de seguros Vida e o URL final foi enviado ao tutor. Isso basta para o Dia 2 ficar fechado.
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
          missionLabel="Dia 02"
          artifactHints={artifactHints}
        />
      </section>
    </article>
  );
}
