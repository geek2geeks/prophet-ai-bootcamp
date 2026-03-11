import { GlossaryText } from "@/components/glossary-text";
import { SubmissionPanel } from "@/components/submission-panel";
import { TerminalBlock } from "@/components/terminal-block";
import { DAY3_GLOSSARY } from "@/lib/day3-glossary";

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
  ["/course-assets/day3/carteira_apolices_vida.csv", "Carteira de apolices"],
  ["/course-assets/day3/tabua_mortalidade_CSO2017.csv", "Tabua de mortalidade"],
  ["/course-assets/day3/taxas_resgate.csv", "Taxas de resgate"],
  ["/course-assets/day3/yield_curve_ECB.csv", "Yield curve"],
  ["/course-assets/day3/day3_api_call_example.md", "Exemplo de API call"],
  ["/course-assets/day3/day3_contract_starter.md", "Starter do contract pack"],
  ["/course-assets/day3/day3_premade_constitution.md", "Constitution pronta"],
] as const;

const DAY3_PROMPTS = [
  "Abre os ficheiros carteira_apolices_vida.csv, tabua_mortalidade_CSO2017.csv, taxas_resgate.csv e yield_curve_ECB.csv. Para cada um, diz-me: que colunas tem, para que serve no produto e 3 erros basicos que devo validar cedo.",
  "Cria um primeiro draft de model_points.json, assumptions_schema.json e run_result.json. Mantem linguagem simples, mostra campos obrigatorios, tipos e um exemplo minimo para cada ficheiro.",
  "Agora reduz a resposta ao minimo operacional: que dados entram, que dados saem e que erro deve falhar cedo em cada contrato.",
];

const DAY3_SPEC_KIT_SETUP = [
  "powershell -ExecutionPolicy ByPass -c \"irm https://astral.sh/uv/install.ps1 | iex\"",
  "uv tool install specify-cli --from git+https://github.com/github/spec-kit.git",
  "specify check",
  "mkdir dia3-feedback-atuarial",
  "cd dia3-feedback-atuarial",
  "specify init . --ai opencode --script ps --force",
  "opencode",
];

const DAY3_SPEC_KIT_CONSTITUTION_PROMPT = [
  "/speckit.constitution Criar uma constitution para uma webapp educativa, portuguesa-first, single-page, pensada para uma aluna sem background de software. Objetivo: ajudar a ler ficheiros atuariais do bootcamp, usar DeepSeek 3.2 para feedback atuarial inicial e introduzir engenharia de contexto em linguagem simples. Regras permanentes: 1) explicar tudo em portugues claro, como se a aluna nunca tivesse construido software; 2) usar apenas ficheiros sinteticos do bootcamp, nunca dados reais de clientes; 3) a AI so analisa ficheiros depois de receber papel, objetivo, limites e formato da resposta; 4) o modelo nao pode inventar metricas, premissas, reservas, projecoes ou conclusoes ausentes; 5) cada resposta AI deve dar alertas, checks humanos e perguntas em aberto; 6) a UI deve ser calma, leve, single-page e sem clutter; 7) cada bloco da app deve mostrar claramente o que o aluno aprende e o proximo passo.",
];

const DAY3_PREMADE_CONSTITUTION = [
  `# Constitution - Day 3 AI Feedback Webapp

## Purpose
Build a beginner-first webapp for Day 3 of the bootcamp. The app helps a student with no software background understand actuarial files, prepare better AI context, and use DeepSeek 3.2 to get initial actuarial feedback on synthetic files.

## Permanent Principles

### 1. Beginner-first explanation
- Explain every step in plain Portuguese.
- Assume the student has never built software before.
- Define technical words immediately in one short sentence.

### 2. Synthetic data only
- Use only bootcamp files or synthetic examples.
- Never ask for or send real customer data to an LLM.
- Show a visible warning whenever AI is used on files.

### 3. Context before AI
- DeepSeek 3.2 must never analyse a file with zero context.
- Before every AI run, the app must collect or show four blocks: role, objective, limits, response format.
- The UI must make this sequence obvious to the student.

### 4. No invented actuarial claims
- The model cannot invent metrics, assumptions, reserves, projections, or business facts that are not present.
- Every AI answer must separate observations, possible concerns, and human checks.

### 5. Useful actuarial feedback
- AI output must aim for alerts, validation checks, open questions, and possible business implications.
- Prefer short actionable bullets over long essays.

### 6. Calm single-page UX
- Keep the experience single-page, smooth, and low-clutter.
- One primary action per block.
- Avoid dense dashboards, nested tabs, or too many decisions at once.

### 7. Local-first and lightweight
- Prefer browser parsing or simple local logic before backend complexity.
- The app should still teach the concept even if the AI call is unavailable.

### 8. Verifiable learning outcome
- The student must leave with a reusable context pack, a clearer understanding of the files, and a draft contract pack.
- Each important section should end with what was learned or what to do next.
`,
];

export function Day3SinglePageLesson({ missionId, missionTitle, challenge, artifactHints }: Props) {
  return (
    <article className="space-y-8">
      <section className="panel shell-frame rounded-[1.8rem] p-6">
        <p className="kicker">Dia 3</p>
        <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">Ler dados e pedidos sem te perder</h2>
        <div className="mt-4 space-y-4 text-sm leading-8 text-[var(--muted-foreground)]">
          <p>
            O Dia 3 nao serve para te transformar num programador backend. Serve para te dar conforto
            com a linguagem minima do produto moderno: ficheiros, formatos, pedidos e respostas. Quando
            olhas para um <GlossaryText text="CSV" glossary={DAY3_GLOSSARY} />, um <GlossaryText text="JSON" glossary={DAY3_GLOSSARY} /> ou uma <GlossaryText text="API" glossary={DAY3_GLOSSARY} />, o importante e
            saberes o que esta a entrar no sistema, o que esta a sair e o que deve falhar cedo.
          </p>
          <p>
            Hoje vais trabalhar com quatro ficheiros reais do bootcamp. Um mostra apolices, outro mostra
            mortalidade, outro resgates e outro taxas da curva. Nao precisas de analisar tudo em
            profundidade. Precisas apenas de reconhecer o papel de cada ficheiro no produto e aprender a
            descreve-lo bem a um agente no terminal.
          </p>
          <p>
            E aqui entra a ideia de <GlossaryText text="contract" glossary={DAY3_GLOSSARY} />. Um contract e so uma forma clara de dizer: estes sao os campos,
            estes sao obrigatorios, este e um exemplo minimo e isto deve falhar se vier mal preenchido.
            Quando consegues dizer isto com clareza, o agente deixa de adivinhar tanto.
          </p>
        </div>
      </section>

      <section className="panel shell-frame rounded-[1.8rem] p-6">
        <h3 className="text-xl font-semibold text-[var(--foreground)]">O que tens de perceber antes do exercicio</h3>
        <div className="mt-4 space-y-4 text-sm leading-8 text-[var(--muted-foreground)]">
          <p>
            Um <GlossaryText text="request" glossary={DAY3_GLOSSARY} /> e um pedido estruturado. Uma <GlossaryText text="response" glossary={DAY3_GLOSSARY} /> e a resposta a esse pedido. No meio tens um
            <GlossaryText text="endpoint" glossary={DAY3_GLOSSARY} />, um <GlossaryText text="payload" glossary={DAY3_GLOSSARY} /> e por vezes alguns <GlossaryText text="headers" glossary={DAY3_GLOSSARY} />. Isto parece tecnico, mas na pratica e
            apenas uma conversa organizada entre dois sistemas.
          </p>
          <p>
            O que te interessa hoje nao e decorar sintaxe. E aprender a ler exemplos pequenos e depois a
            pedir ao agente que transforme esses exemplos num contract pack reutilizavel. Em vez de abrir
            uma aula cheia de teoria, vais trabalhar sobre exemplos curtos e descricoes operacionais.
          </p>
        </div>
      </section>

      <section className="panel shell-frame rounded-[1.8rem] p-6">
        <h3 className="text-xl font-semibold text-[var(--foreground)]">Ficheiros de apoio</h3>
        <p className="mt-3 text-sm leading-8 text-[var(--muted-foreground)]">
          Descarrega estes ficheiros. Sao tudo o que precisas para fechar o Dia 3.
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
        <h3 className="text-xl font-semibold text-[var(--foreground)]">Se quiseres construir esta webapp com GitHub Spec Kit</h3>
        <div className="mt-4 space-y-6 text-sm leading-8 text-[var(--muted-foreground)]">
          <p>
            Esta e a forma mais segura de construir a webapp do Dia 3 sem te perderes. O Spec Kit
            obriga-te a clarificar o que a app faz antes de pedires codigo. Para este caso, isso e
            especialmente util porque queres juntar ficheiros, feedback atuarial com DeepSeek 3.2 e
            uma experiencia pensada para uma aluna que nao sabe software.
          </p>
          <p>
            Faz so isto por ordem: instala o Spec Kit, inicializa o projeto para OpenCode e depois
            cola a constitution pronta. Nao precisas de decorar nada. Basta copiar e colar os blocos.
          </p>
          <TerminalBlock
            commands={DAY3_SPEC_KIT_SETUP}
            label="Terminal / PowerShell"
            copyLabel="Copiar comandos"
          />
          <TerminalBlock
            commands={DAY3_SPEC_KIT_CONSTITUTION_PROMPT}
            label="Chat do OpenCode"
            prompt=">"
            copyLabel="Copiar prompt"
          />
          <details className="rounded-[1.2rem] border border-[var(--border)] bg-white/80 p-4">
            <summary className="cursor-pointer list-none text-sm font-semibold text-[var(--foreground)]">
              Ou copia diretamente uma constitution.md pronta
            </summary>
            <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
              Se quiseres reduzir ainda mais a variacao do modelo, usa este texto diretamente como base
              da tua <GlossaryText text="constitution" glossary={DAY3_GLOSSARY} />.
            </p>
            <div className="mt-4">
              <TerminalBlock
                commands={DAY3_PREMADE_CONSTITUTION}
                label="constitution.md pronta"
                prompt=">"
                copyLabel="Copiar constitution"
              />
            </div>
          </details>
        </div>
      </section>

      <section className="panel shell-frame rounded-[1.8rem] p-6">
        <h3 className="text-xl font-semibold text-[var(--foreground)]">Exercicio do dia</h3>
        <div className="mt-4 space-y-6 text-sm leading-8 text-[var(--muted-foreground)]">
          <p>
            O exercicio e simples. Primeiro lês os ficheiros. Depois pedes ao agente um resumo claro do
            papel de cada um. Depois pedes ao agente tres contratos: um para os dados de entrada, um
            para as assumptions e outro para o resultado. Nao precisas de escrever backend. Precisas de
            sair do dia a perceber a estrutura minima dos dados do produto.
          </p>
          <TerminalBlock commands={DAY3_PROMPTS} label="Chat do OpenCode" prompt=">" copyLabel="Copiar prompts" />
          <p>
            Quando o agente responder, reduz tudo ao essencial. O melhor resultado do Dia 3 nao e uma
            resposta longa. E um contract pack curto, claro e reutilizavel, que um nao-tecnico ainda
            consegue ler.
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
          missionLabel="Dia 03"
          artifactHints={artifactHints}
        />
      </section>
    </article>
  );
}
