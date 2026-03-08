# Spec: [Nome da Feature]

## 1. Objetivo
*Em 1-2 frases, o que faz esta feature e porque é que o utilizador precisa dela?*

## 2. Fluxo Principal (Happy Path)
*Passo a passo, o que acontece quando tudo corre bem:*
1. Utilizador faz X.
2. Sistema valida Y.
3. App apresenta Z.

## 3. Inputs & Outputs
**Inputs:**
- [Ex: Ficheiro CSV com colunas A, B, C]
- [Ex: Parâmetro selecionado no dropdown]

**Outputs:**
- [Ex: Tabela de resultados no ecrã]
- [Ex: JSON gravado na base de dados]

## 4. Validações e Casos de Erro (Edge Cases)
*O que acontece se o utilizador fizer asneira?*
- Erro 1: [Ex: Falta a coluna 'Age' no CSV] -> [Mensagem de erro clara para o utilizador]
- Erro 2: [Ex: Taxa de desconto é negativa] -> [Rejeitar upload e avisar]

## 5. Fora de Âmbito (Out of Scope)
*O que é que a feature NÃO faz (para não perdermos tempo)?*
- [Ex: Não aceita Excel, apenas CSV]
- [Ex: Não faz conversão de moedas]

## 6. Critérios de Aceite
*Como é que o Founder sabe que isto está pronto?*
- [ ] O ficheiro carrega sem erros se o formato for válido.
- [ ] A mensagem "Erro na linha 5" aparece se faltar informação.
- [ ] A interface atualiza automaticamente.
