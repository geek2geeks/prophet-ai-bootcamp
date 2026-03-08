const fs = require('fs');

const data = JSON.parse(fs.readFileSync('src/data/course.json', 'utf8'));
const day10 = data.days.find(d => d.dia === 10);

if (day10) {
  const exIndex = day10.exercicios.findIndex(e => e.titulo.includes('LinkedIn'));
  if (exIndex !== -1) {
    day10.exercicios[exIndex].titulo = 'Documentar o Lançamento';
    day10.exercicios[exIndex].descricao = 'Criar um resumo de lançamento com imagem, URL, problema resolvido, stack usada e aprendizagem. O objetivo é documentar e preparar a partilha de conhecimento com a tua equipa, colegas ou rede de contactos.';
  }
  
  if (day10.desafio && day10.desafio.descricao.includes('post de lancamento no LinkedIn')) {
    day10.desafio.descricao = day10.desafio.descricao.replace('o post de lancamento no LinkedIn', 'a nota de lançamento');
  }
}

fs.writeFileSync('src/data/course.json', JSON.stringify(data, null, 2), 'utf8');
console.log('course.json Day 10 LinkedIn references removed');
