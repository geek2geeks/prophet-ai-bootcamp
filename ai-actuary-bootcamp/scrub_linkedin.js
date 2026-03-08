const fs = require('fs');

const data = JSON.parse(fs.readFileSync('src/data/course.json', 'utf8'));

// Scrub Day 1
const day1 = data.days.find(d => d.dia === 1);
if (day1 && day1.desafio) {
  day1.desafio.descricao = day1.desafio.descricao.replace('contactar no LinkedIn', 'contactar diretamente');
}

// Scrub Day 10
const day10 = data.days.find(d => d.dia === 10);
if (day10) {
  day10.titulo = day10.titulo.replace('LinkedIn Launch', 'Lançamento');
  day10.objetivo = day10.objetivo.replace('via LinkedIn e demo final.', 'via demonstração final e comunicação com a tua equipa ou mercado.');
  
  if (day10.modulos) {
    day10.modulos = day10.modulos.map(m => m.replace('LinkedIn, Demo', 'Comunicação, Demo'));
  }
  
  if (day10.conteudo && day10.conteudo.modulo_2) {
    day10.conteudo.modulo_2.titulo = day10.conteudo.modulo_2.titulo.replace('LinkedIn, Demo', 'Comunicação, Demo');
    if (day10.conteudo.modulo_2.topicos) {
      day10.conteudo.modulo_2.topicos.forEach(t => {
        if (t.conteudo.includes('LinkedIn e uma extensao do lancamento')) {
          t.conteudo = t.conteudo.replace('LinkedIn e uma extensao do lancamento, nao um extra cosmico.', 'A comunicação é uma extensão do lançamento, e não apenas um detalhe extra.');
        }
      });
    }
  }
}

fs.writeFileSync('src/data/course.json', JSON.stringify(data, null, 2), 'utf8');
console.log('course.json scrubbed of LinkedIn references.');
