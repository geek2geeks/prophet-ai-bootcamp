# Exemplo Simples de API Call - Dia 3

Usa este ficheiro como referencia minima.

## Pedido

```http
POST /api/scoring/run
Content-Type: application/json
Authorization: Bearer exemplo-local

{
  "customer_id": "CUS-9921",
  "product_code": "TERM_20",
  "insured_amount": 250000,
  "smoker": false
}
```

## Resposta

```json
{
  "request_id": "SCR-5521",
  "score_band": "A2",
  "decision": "review"
}
```

## Como ler isto

- `POST` = tipo de pedido
- `/api/scoring/run` = endpoint
- `Content-Type` = formato do payload
- o bloco JSON = payload enviado
- o bloco final = response recebida
