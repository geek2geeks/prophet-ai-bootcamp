const fs = require('fs');
const file = 'src/app/page.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  'Uma plataforma de aprendizagem onde o estudante sabe sempre o que fazer a seguir.',
  'De Atuário a Fundador AI-Native em 10 Dias.'
);

code = code.replace(
  'O curriculum fica intacto. A experiencia passa a funcionar como uma plataforma de curso real:\n              retomar onde ficaste, seguir um roteiro semanal, mudar para ferramentas locais no momento certo\n              e manter notas que ficam contigo ao longo do bootcamp.',
  'Esquece o Excel e as folhas de cálculo intermináveis. Neste bootcamp vais construir o teu próprio "Prophet Lite": um motor de cálculo com inteligência artificial integrada. Aprende a pensar como um fundador de produto, usar LLMs para escrever código e lançar uma aplicação SaaS do zero.'
);

code = code.replace(
  'Notas adesivas em qualquer pagina.',
  'A Stack Moderna'
);

code = code.replace(
  'Usa o botao no canto inferior esquerdo para criar notas coloridas que ficam onde as deixares.\n                Arrasta, redimensiona e guarda — tudo sincronizado automaticamente.',
  'Next.js, Python, DeepSeek e ferramentas de CLI. Vais deixar de ser um mero utilizador de software para passares a ser o arquiteto da tua própria tecnologia.'
);

code = code.replace(
  '<p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">\n                Notas flutuantes\n              </p>',
  '<p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">\n                A tua arma secreta\n              </p>'
);

code = code.replace(
  '<p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">\n              Ferramenta de notas\n            </p>\n            <h2 className="mt-3 font-serif text-3xl text-[var(--foreground)] sm:text-4xl">\n              Notas adesivas persistentes em cada sessao.\n            </h2>\n            <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">\n              Clica no botao <strong>Notas</strong> no canto inferior esquerdo para abrir o painel de notas adesivas.\n              Cria notas coloridas, arrasta-as para onde quiseres e redimensiona-as livremente.\n              As notas ficam guardadas na tua conta e aparecem em qualquer pagina do bootcamp.\n            </p>',
  '<p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">\n              Aplicações, não scripts\n            </p>\n            <h2 className="mt-3 font-serif text-3xl text-[var(--foreground)] sm:text-4xl">\n              Constrói um produto, não um tutorial.\n            </h2>\n            <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">\n              Ao longo do curso não vais apenas preencher espaços em branco. Vais desenhar a arquitetura, escrever especificações rigorosas, integrar uma base de dados vetorial para leitura de PDFs e publicar a tua aplicação no mundo real para os teus primeiros utilizadores.\n            </p>'
);

code = code.replace(
  '["Criar notas rapidamente", "Arrastar e redimensionar", "Cores personalizadas", "Sincronizado com a conta"]',
  '["Motor Local v0.1", "Integração API LLM", "Sistema Document Drop", "Deploy em Produção"]'
);

code = code.replace(
  '<p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">\n                O que mudou\n              </p>\n              <h2 className="mt-3 font-serif text-3xl text-[var(--foreground)] sm:text-4xl">\n                Um produto de aprendizagem, nao um dashboard.\n              </h2>',
  '<p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">\n                O Resultado Final\n              </p>\n              <h2 className="mt-3 font-serif text-3xl text-[var(--foreground)] sm:text-4xl">\n                O que levas contigo no Dia 10.\n              </h2>'
);

code = code.replace(
  'O estudante entra num fluxo de continuidade, nao numa parede de filosofia de produto.',
  'Um motor atuarial básico mas robusto, capaz de correr projeções com inputs dinâmicos, integrado numa interface web.'
);
code = code.replace(
  'Proximo passo claro',
  'MVP Funcional'
);

code = code.replace(
  'Momentos de CLI explicitos',
  'Playbooks de IA'
);
code = code.replace(
  'Cada dia diz ao estudante quando deve sair do navegador e abrir ferramentas locais.',
  'Critérios para escolher LLMs, documentação e processos repetíveis para construir mais funcionalidades no futuro.'
);

code = code.replace(
  'Caderno persistente',
  'Portefólio de Lançamento'
);
code = code.replace(
  'As notas globais e as notas da aula ficam disponiveis sem tomar conta de toda a interface.',
  'Tudo empacotado com um README profissional, cópia de vendas afiada e a tua aplicação a correr ao vivo.'
);

fs.writeFileSync(file, code, 'utf8');
console.log('Landing page improved.');
