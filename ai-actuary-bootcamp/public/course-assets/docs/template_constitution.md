# Constitution do Projeto (Prophet Lite)

> No GitHub Spec Kit, o constitution vem antes da spec.
> Serve para definir principios permanentes para que o LLM, o founder e a futura equipa nao tomem decisoes diferentes a cada conversa.

## 1. Regras de UX e Linguagem
- A interface deve privilegiar clareza sobre efeito visual.
- Mensagens de erro devem estar em portugues natural, sem jargao tecnico assustador.
- Cada ecrã deve deixar claro o que aconteceu, porque aconteceu e qual o proximo passo.
- Quando houver risco de erro de dados, a app deve avisar cedo e de forma explicavel.

## 2. Regras de Dados e Validacao
- **Formato principal de tabelas:** CSV, salvo indicacao contraria numa feature especifica.
- **Sem magia oculta:** toda a logica de calculo atuarial, arredondamento e validacao deve ser visivel e explicavel.
- **Validacao primeiro:** ficheiros e inputs devem ser verificados antes de entrarem no motor.
- **Rastreabilidade:** sempre que possivel, guardar metadata suficiente para explicar de onde veio cada input.

## 3. Limites do MVP
- O foco e entregar uma projecao deterministica simples e audivel.
- Nao suportamos multiplos cenarios estocasticos na versao 1.
- Nao implementamos fluxos complexos de permissao; privilegia-se simplicidade operacional.
- Qualquer funcionalidade fora da wedge escolhida precisa de justificacao explicita.

## 4. Convencoes Matematicas
- **Arredondamentos:** valores monetarios com 2 casas decimais; taxas com 4 casas.
- **Moeda base:** EUR.
- **Datas e versoes:** sempre que relevante, assumptions devem ter data de referencia e identificador de versao.

## 5. Regras para Trabalhar com AI
- O LLM deve receber primeiro o que e porque, e so depois o como.
- Sempre que a spec estiver vaga, a resposta correta e pedir clarificacao, nao inventar comportamento.
- O output deve ser verificavel por uma pessoa nao tecnica.
- Se houver conflito entre rapidez e auditabilidade, escolher auditabilidade.
