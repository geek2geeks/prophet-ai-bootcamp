# Prompt Base para o Relatorio PDF - Dia 2

Usa este prompt depois de calculares as metricas no teu codigo.

```text
Escreve um relatorio executivo curto em portugues de Portugal para uma carteira de seguros Vida individual.

Audiencia:
- CEO
- CFO
- diretor tecnico

Dados observados:
- total de apolices: <preencher>
- idade media: <preencher>
- premio anual total: <preencher>
- capital segurado total: <preencher>
- mistura por produto: <preencher>
- estados da carteira: <preencher>
- fumador vs nao fumador: <preencher se existir>

Estrutura obrigatoria:
1. Titulo
2. Resumo executivo (2 frases)
3. 4 metricas-chave em bullets
4. 3 insights executivos
5. Nota metodologica curta

Regras obrigatorias:
- Falar como relatorio executivo de seguros Vida
- Usar apenas os dados observados acima
- Nao mencionar reservas, provisoes, mortalidade esperada, longevidade, sinistralidade, lucro tecnico, lapses futuros ou projecoes
- Nao inferir risco futuro
- Nao assumir motivos de negocio, comportamento do cliente, finalidade sucessoria, credito ou protecao familiar se isso nao estiver nos dados
- Focar apenas em composicao da carteira, idade media, premio anual, capital segurado, mistura de produtos, estados observados e perfil fumador
- Se algo nao estiver nos dados, nao o menciones
- Linguagem simples, prudente e profissional
```

## Regra pratica

Se o modelo comecar a falar de risco futuro, reservas ou sinistralidade esperada, o prompt esta demasiado solto.
Nesse caso, reforca a lista de proibicoes e volta a pedir o texto.

Se o modelo inventar o motivo dos produtos, perfis de cliente ou contexto comercial, o prompt tambem esta demasiado solto.
Pede-lhe para descrever apenas o que e observavel no dataset.
