# GitHub Spec Kit Primer

## O que e

GitHub Spec Kit e um toolkit open source para Specification-Driven Development.
Nao e uma framework de frontend nem uma linguagem nova.
E uma forma organizada de trabalhar com AI para que a equipa descreva primeiro o problema e so depois peca implementacao.

Em vez de dizer ao modelo "constroi isto" e esperar sorte, a metodologia cria uma cadeia de artefactos:

1. `constitution` - principios permanentes do projeto
2. `specify` - o que queremos construir e porque
3. `clarify` - perguntas para retirar ambiguidades
4. `plan` - como vamos implementar
5. `tasks` - lista concreta de trabalho
6. `implement` - execucao

## Traducao para alunos sem background tecnico

- `constitution.md` = regras da casa
- `spec.md` = nota funcional / requisito operativo
- `clarify` = perguntas que evitam mal-entendidos
- `plan.md` = plano tecnico
- `tasks.md` = plano de trabalho em passos pequenos
- `implement` = construcao

Se fores atuario, pensa assim:

- o `constitution` parece uma politica de modelacao
- a `spec` parece uma nota de requisitos para uma ferramenta interna
- a `clarify` parece a ronda de perguntas antes de fechar assumptions
- o `plan` parece a nota de implementacao
- as `tasks` parecem um plano de execucao dividido por passos

## Porque isto ajuda iniciantes

Quem nao tem background tecnico tende a cometer dois erros:

1. pedir codigo cedo demais
2. misturar regras de negocio com detalhes tecnicos

O GitHub Spec Kit reduz esses dois erros porque obriga a responder primeiro a perguntas como:

- quem usa isto?
- que problema resolve?
- o que fica fora desta versao?
- que erros precisam de mensagem clara?
- como sei que esta pronto?

## Ordem recomendada no bootcamp

### Dia 1
- escolher cliente, dor e wedge
- escrever memo do fundador

### Dia 2
- transformar o memo numa spec funcional
- definir principios em `constitution.md`
- clarificar zonas vagas
- so depois falar de stack e implementacao

## Como isto compara com outras metodologias

### 1. Prompting solto / vibe coding

Prompting solto e o mais rapido para explorar ideias.
Mas depende demasiado da memoria do chat e do talento do modelo para adivinhar lacunas.

- vantagem: velocidade inicial
- fraqueza: baixa previsibilidade
- melhor uso: exploracao e prototipos curtos

GitHub Spec Kit e mais lento no arranque, mas muito melhor quando ha regras, excecoes e validacoes importantes.

### 2. PRD tradicional

Um PRD classico descreve o produto para humanos.
O GitHub Spec Kit tenta ir mais longe: criar artefactos que tambem alimentam agentes de AI.

- PRD: bom para alinhamento humano
- Spec Kit: melhor para alinhamento humano + AI

### 3. Agile / user stories / Jira

Agile organiza o trabalho em ciclos curtos e prioridades.
Mas Agile nao diz, por si so, como escrever uma boa spec para AI.

- Agile responde melhor ao "quando" e "em que ordem"
- Spec Kit responde melhor ao "o que", "porque" e "com que guardrails"

Funcionam bem juntos.

### 4. Waterfall

Waterfall gosta de documentacao e fases sequenciais.
GitHub Spec Kit tambem valoriza artefactos, mas aceita iteracao curta e refinamento continuo.

- Waterfall: mais rigido
- Spec Kit: estruturado, mas iterativo

### 5. TDD

TDD foca-se em testes antes do codigo.
GitHub Spec Kit foca-se em clarificar requisitos antes do plano e antes do codigo.

- TDD melhora a qualidade da implementacao
- Spec Kit melhora a qualidade da definicao do problema

Nao competem diretamente; atuam em momentos diferentes.

## Regra simples para os alunos

Se ainda estas a discutir o que a feature faz, ainda nao estas pronto para pedir codigo.
Primeiro fecha principios, scope, erros e criterios de aceite.
Depois sim pede implementacao.
