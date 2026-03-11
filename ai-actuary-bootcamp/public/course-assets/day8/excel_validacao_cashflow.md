# Validacao de Cash Flows — Caso de Referencia

Este documento serve como benchmark para validar o motor deterministic do Prophet Lite.
Use estes valores esperados para confirmar que o seu motor esta a produzir resultados correctos.

---

## Caso: Temporario 10 anos — Homem, 40 anos, Nao-Fumador

### Parametros de Input

| Parametro | Valor |
|-----------|-------|
| Produto | Temporario Vida |
| Idade de entrada | 40 |
| Sexo | Masculino |
| Fumador | Nao |
| Capital segurado | 100 000 EUR |
| Prazo | 10 anos |
| Premio anual | 285 EUR |
| Tabua de mortalidade | CSO 2017 (Male, Non-Smoker) |
| Taxa de desconto | 2.82% (spot 5Y, yield_curve_ECB.csv) |
| Taxa de resgate | taxas_resgate.csv (temporario_vida) |

### Cash Flows Esperados (arredondados)

| Ano | Vivos (inicio) | qx     | Lapse   | Premios  | Sinistros | Resgate | CF Liquido | Reserva (fim) |
|-----|----------------|--------|---------|----------|-----------|---------|------------|---------------|
| 1   | 1.0000         | 0.0012 | 0.10    | 285.00   | 120.00    | 0.00    | 165.00     | 160.55        |
| 2   | 0.8988         | 0.0013 | 0.08    | 256.16   | 116.84    | 0.00    | 139.32     | 291.82        |
| 3   | 0.8260         | 0.0014 | 0.06    | 235.41   | 115.64    | 0.00    | 119.77     | 394.21        |
| 4   | 0.7749         | 0.0016 | 0.05    | 220.85   | 123.98    | 0.00    | 96.87      | 470.83        |
| 5   | 0.7352         | 0.0018 | 0.04    | 209.53   | 132.34    | 0.00    | 77.19      | 524.50        |
| 6   | 0.7043         | 0.0021 | 0.035   | 200.73   | 147.90    | 0.00    | 52.83      | 548.87        |
| 7   | 0.6777         | 0.0025 | 0.03    | 193.15   | 169.43    | 0.00    | 23.72      | 540.89        |
| 8   | 0.6545         | 0.0030 | 0.025   | 186.53   | 196.35    | 0.00    | -9.82      | 497.52        |
| 9   | 0.6356         | 0.0036 | 0.02    | 181.15   | 228.82    | 0.00    | -47.67     | 414.56        |
| 10  | 0.6209         | 0.0043 | 0.018   | 176.96   | 266.99    | 0.00    | -90.03     | 288.14        |

### Metricas Resumo

| Metrica | Valor |
|---------|-------|
| PV Premios | 1 862.45 EUR |
| PV Sinistros | 1 354.78 EUR |
| PV Comissoes | 0.00 EUR |
| Profit Signature (PV CF Liquido) | 507.67 EUR |
| Profit Margin | 27.3% |
| Breakeven Year | Ano 8 |

---

## Notas de Validacao

1. **Mortalidade**: valores qx retirados de `tabua_mortalidade_CSO2017.csv`, coluna Male Non-Smoker, idades 40-49.
2. **Lapse**: valores retirados de `taxas_resgate.csv`, produto temporario_vida, taxa ajustada.
3. **Desconto**: taxa spot a 5 anos de `yield_curve_ECB.csv` (2.82%) usada como flat rate por simplicidade.
4. **Tolerancia**: o motor deve produzir valores dentro de +/- 2% dos apresentados nesta tabela.
5. **Arredondamentos**: todos os valores monetarios arredondados a 2 casas decimais; probabilidades a 4 casas.

## Como Usar

1. Carregue os 3 ficheiros de input no motor (tabua, lapse, yield curve).
2. Crie um model point com os parametros acima.
3. Corra a projecao deterministic.
4. Compare os cash flows e metricas com esta tabela.
5. Documente quaisquer diferencas superiores a 2% e explique a causa.
