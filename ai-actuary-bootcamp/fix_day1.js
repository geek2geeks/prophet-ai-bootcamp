const fs = require('fs');

const data = JSON.parse(fs.readFileSync('src/data/course.json', 'utf8'));
const day1 = data.days.find(d => d.dia === 1);

if (day1) {
  day1.exercicios[0].descricao = "Vais construir software e não apenas operar folhas de cálculo. Usa o OpenCode para definir rapidamente, nas tuas palavras (1-2 frases), os termos do jogo: (1) SaaS, (2) MVP, (3) Wedge, (4) Workflow, (5) UX, (6) Feature, (7) Deploy, (8) Incumbent, (9) Posicionamento, (10) Stack. Acrescenta um exemplo atuarial para cada um (formato tabela). Guarda como glossario_fundador.md. É a linguagem que vais usar até ao fim do curso.";
  
  day1.exercicios[1].descricao = "Ontem analisaste uma carteira de apólices com IA em 25 minutos. Quanto tempo demoraria à mão no Excel? Esse contraste é a alavanca. Usa o OpenCode para resumir a diferença entre vender horas de consultoria (onde o tempo é o limite) e vender um produto de software (SaaS). Compara em 3 dimensões: Margem, Escala e Dependência de Tempo. Entrega um documento de 1 página com essa tabela e 3 conclusões tuas. Queremos que visualizes porque é que o software escala e o teu tempo não.";
  
  day1.exercicios[2].descricao = "Lê o ficheiro prophet_reference_vida.md (nos Recursos). Este é o teu 'incumbent' - o dinossauro que domina o mercado. Cria uma tabela rápida: Modulo Prophet | Ponto Forte Deles | A Nossa Oportunidade (versão simples/MVP). Faz isto para 5 áreas (ex: assumptions, motor, reports). O objetivo não é copiar o gigante, mas descobrir onde ele é pesado demais para equipas pequenas.";
  
  day1.exercicios[3].descricao = "Abre os dados do Dia 0 no OpenCode e usa um prompt exploratório: 'Se fosses um atuário a receber estes dados todos os trimestres, o que te faria perder a cabeça sem um software dedicado?' Lista 3 frustrações reais que encontraste. Para cada uma, indica: Quem sofre com isto? Qual a frequência? Qual o impacto no negócio? Porque é que o Excel não chega? É aqui que descobres o que as pessoas estariam dispostas a pagar para resolver.";
  
  day1.exercicios[4].descricao = "Escreve um documento interno de 1 página a definir o teu produto. 1) Cliente Ideal (quem sofre com a dor que escolheste). 2) Problema Principal. 3) Wedge (o pequeno problema por onde vais entrar). 4) O que o Prophet Lite faz primeiro (3-5 coisas core). 5) O que NÃO faz (ser agressivo no corte de scope é essencial). 6) Argumento de Foco. Usa o OpenCode para criticar e afinar o teu documento. Guarda como memo_fundador.md.";
  
  day1.exercicios[5].titulo = "Mental Check do Dia 1";
  day1.exercicios[5].descricao = "Responde a estas perguntas por escrito em 2-3 frases sem usar IA. O objetivo é validares o teu próprio raciocínio. (1) O que separa vender horas de vender SaaS? (2) O que é um MVP? (3) Explica o que é uma 'wedge'. (4) Porque é que uma equipa pequena tem vantagem sobre o incumbent? (5) O que é posicionamento? (6) Porque é que dizer 'não' a funcionalidades é uma boa estratégia? Se souberes responder a isto, estás pronto para construir.";
  
  day1.exercicios[6].titulo = "Lab Interativo – Reporting e IA";
  day1.exercicios[6].descricao = "Usa o laboratório interativo na plataforma com os ficheiros de reporting. Explora os painéis de métricas e descobre onde a rentabilidade caiu. Depois, vai ao OpenCode e responde: (1) Que segmentos explicam a queda do lucro? (2) O aumento das reservas vem de onde? (3) Escreve uma nota de 5 linhas ao CFO a explicar a variação. (4) Propõe uma feature de IA para automatizar este trabalho repetitivo. Entrega o analise_variacao_trimestral.md.";

  day1.desafio.descricao = "Cria um documento de 2 páginas focado em convencer o teu primeiro utilizador real. Inclui: 1) Para Quem É (e estimativa de mercado). 2) O Problema Hoje (onde o workflow dói). 3) O Que Fazemos. 4) A Nossa Vantagem (UX moderno, IA embutida, sem atritos). 5) Prova de Conceito (mostra números reais da análise do Dia 0 para dar força aos teus argumentos). 6) Plano de Distribuição (3 passos para chegar a essa pessoa sem intermediários). 7) Riscos e Respostas (o que pode falhar e como reages). O memo descreve o produto; a tese argumenta porque é que o mercado o vai querer.";
}

fs.writeFileSync('src/data/course.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Day 1 texts improved.');
