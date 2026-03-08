const fs = require('fs');
const file = 'src/data/course.json';
const data = JSON.parse(fs.readFileSync(file));

const day2 = data.days.find(d => d.dia === 2);

day2.exercicios[0].descricao = 'Pedir a um LLM para "fazer um upload de assumptions" é a receita certa para ter problemas. Usa o template_spec.md para ser absolutamente explícito sobre o fluxo de upload e validação das tábuas de mortalidade, lapsos e taxas de desconto. Define os inputs, os erros esperados e o output final. A qualidade do que a máquina constrói escala em proporção direta à qualidade da tua spec.';

day2.exercicios[1].descricao = 'Arrastar PDFs para a app não chega; precisas de definir o que acontece depois. Escreve a spec para a feature de Document Drop: o utilizador faz upload de ficheiros, e a app deve classificar, extrair metadados e indexar a informação. Pensa nisto como desenhar um processo fabril. Se não especificares como a máquina deve tratar os dados, o valor da feature será zero.';

day2.exercicios[2].descricao = 'O verdadeiro teste a uma ideia é tentar encontrar os seus pontos de falha antes de escrever código. Pede ao modelo base para fazer um plano de execução da tua spec, e usa as tuas ferramentas locais para uma auditoria impiedosa. O objetivo é destapar ambiguidades, edge cases e critérios de aceite em falta. É um stress-test à tua lógica antes de investires tempo a construir.';

day2.desafio.descricao = 'Entrega o teu pacote de especificação: spec.md, constitution.md e a checklist de aceite para o MVP (Prophet Lite). Este conjunto tem de ser claro o suficiente para que o LLM execute o projeto com autonomia, sem te interromper constantemente com perguntas básicas. Boas fundações hoje poupam-te muita dívida técnica amanhã.';

fs.writeFileSync(file, JSON.stringify(data, null, 2));
console.log('course.json Day 2 text updated.');
