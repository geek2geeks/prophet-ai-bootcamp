# Constitution do Projeto (Prophet Lite)

## 1. Regras de Design e UI/UX
- Manter a interface limpa e minimalista.
- Mensagens de erro devem ser sempre em português natural, sem jargão técnico assustador.
- Tudo deve ser concebido a pensar no "Mobile-First" (ou "Web-First" muito simples).

## 2. Padrões de Código e Arquitetura
- **Tecnologia Principal:** [ex: Next.js, Python/FastAPI, Streamlit]
- **Formato de Dados:** Todos os inputs de tabelas (mortalidade, dados) devem usar CSV (separado por vírgulas).
- **Sem Magia Oculta:** Toda a lógica de cálculo atuarial deve estar visível e explicável (ex: os inputs de taxa de desconto devem ser guardados e mostrados).

## 3. Gestão de Escopo (MVP Limits)
- O foco é entregar uma projecção determinística simples.
- Não suportamos múltiplos cenários estocásticos na Versão 1.
- Não implementamos sistemas de permissões complexos (Admin vs User é suficiente).

## 4. Convenções Matemáticas
- **Arredondamentos:** Valores monetários são sempre guardados com 2 casas decimais. Taxas com 4 casas.
- **Moeda Base:** EUR.
