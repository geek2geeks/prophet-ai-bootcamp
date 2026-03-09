# Spec: [Nome da Feature]

> Usa este documento como uma ponte entre a ideia do Dia 1 e a execucao do Dia 2.
> Escreve em linguagem clara de negocio. O objetivo nao e parecer tecnico; e retirar ambiguidade.

## 1. Problema e Objetivo
*Que dor concreta estamos a resolver e porque vale a pena resolver agora?*

- Problema do utilizador:
- Quem sente esta dor:
- Porque isto importa para o negocio:
- Objetivo desta feature nesta versao:

## 2. Fluxo Principal (Happy Path)
*Passo a passo, o que acontece quando tudo corre bem.*

1. Utilizador faz X.
2. Sistema valida Y.
3. Sistema apresenta Z.
4. Utilizador percebe o resultado e sabe o proximo passo.

## 3. Inputs, Regras e Outputs
**Inputs**
- [Ex: Ficheiro CSV com colunas A, B, C]
- [Ex: Tipo de assumption selecionado]

**Regras de negocio / validacoes**
- [Ex: A coluna `idade` e obrigatoria]
- [Ex: Taxas negativas sao rejeitadas]
- [Ex: O erro deve indicar o problema em portugues simples]

**Outputs**
- [Ex: Preview das primeiras linhas]
- [Ex: Estado de validacao: aprovado / rejeitado]
- [Ex: Resumo claro para o utilizador]

## 4. Casos de Erro e Edge Cases
*O que acontece quando os dados chegam mal ou o utilizador faz algo inesperado?*

- Erro 1: [Ex: Falta a coluna `Age`] -> [Mensagem clara + acao sugerida]
- Erro 2: [Ex: Ficheiro vazio] -> [Bloquear e explicar]
- Edge case: [Ex: Separador errado] -> [Como o sistema reage]
- Edge case: [Ex: Upload interrompido] -> [Como o sistema reage]

## 5. Fora de Ambito (Out of Scope)
*O que esta explicitamente fora desta versao?*

- [Ex: Nao aceita Excel, apenas CSV]
- [Ex: Nao faz OCR no browser]
- [Ex: Nao faz projecao atuarial completa]

## 6. Clarificacoes em Aberto
*Que perguntas ainda precisam de resposta antes do plano tecnico?*

- [Ex: Qual o tamanho maximo do ficheiro?]
- [Ex: Guardamos o ficheiro original ou apenas metadata?]
- [Ex: Que colunas sao obrigatorias em cada tipo de assumption?]

## 7. Criterios de Aceite
*Como e que uma pessoa nao tecnica consegue dizer "isto esta pronto"?*

- [ ] O utilizador percebe em menos de 30 segundos se o ficheiro e valido.
- [ ] Cada erro relevante gera uma mensagem clara e acionavel.
- [ ] O fluxo principal pode ser explicado sem linguagem tecnica obscura.
- [ ] Os limites desta versao estao escritos e nao dependem da memoria do chat.

## 8. Prompt Base para GitHub Spec Kit / LLM
*Resume o pedido num bloco curto para o passo de specify ou para uma revisao da spec.*

"Cria ou revê esta feature com foco no que e porque antes do como. Identifica ambiguidades, valida os edge cases, confirma os criterios de aceite e nao inventes comportamento fora de ambito."
