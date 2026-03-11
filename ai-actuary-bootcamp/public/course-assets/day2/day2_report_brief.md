# Brief do Relatorio Executivo - Dia 2

Usa este brief para orientar o dashboard e o PDF.

## Objetivo

Transformar um CSV de seguros Vida num relatorio curto para decisores nao tecnicos.

## O que o dashboard deve mostrar

- total de apolices
- idade media
- premio anual total
- capital segurado total
- distribuicao por tipo de produto
- distribuicao por estado da apolice
- distribuicao de fumador vs nao fumador, se existir no dataset

## O que o PDF deve mostrar

1. titulo do relatorio
2. data de geracao
3. 3 a 5 metricas chave
4. 3 insights escritos em linguagem simples, mas com foco atuarial Vida
5. nota metodologica curta

## O tom do PDF

Escreve como um relatorio executivo de seguros Vida.
O texto deve parecer util para um diretor tecnico, CFO, CEO ou responsavel de produto.
Evita linguagem de marketing e evita jargao tecnico desnecessario.

## Tipos de insight que fazem sentido

- concentracao da carteira por tipo de produto
- peso economico do capital segurado e do premio anual
- perfil etario observado
- diferenca entre carteira ativa e estados nao ativos
- sinais de concentracao em fumadores, se o campo existir

## Regra para a AI

A narrativa AI deve usar apenas metricas agregadas e tabelas resumidas.
Nao deve inventar causas nem recomendacoes sem base nos dados.
Nao deve fingir que calculou reservas, sinistralidade esperada, lapse futuro ou lucro tecnico se esses valores nao existem no dataset.
Nao deve assumir motivacoes comerciais, sucessorias ou de comportamento do cliente se isso nao vier nos dados.

## Lembrete pratico para o aluno

Tens uma chave DeepSeek disponivel para este exercicio.
Usa-a para gerar a narrativa do PDF, mas lembra-te: a chave nao substitui contexto bem preparado.
Primeiro resume os numeros da carteira; so depois pede o texto executivo.

## Configuracao minima para o mini projeto

Se a tua app local chamar a API DeepSeek, guarda a chave em `.env.local`.

```text
DEEPSEEK_API_KEY=cola_aqui_a_tua_chave
```

Depois reinicia o servidor local.

Se estiveres a usar Next.js, o ideal e chamar a DeepSeek API no servidor da app, nao diretamente no browser.

## Exemplo de conclusao valida

"A carteira observada concentra-se em produtos Temporarios e Vida Inteira, com predominio de apolices ativas. O capital segurado mostra concentracao relevante em apolices de valor mais alto, o que justifica leitura prudente do risco exposto."

## Exemplo de conclusao invalida

"A carteira vai ter mais sinistros no proximo trimestre."

Essa frase e invalida porque o ficheiro nao mostra comportamento futuro.
