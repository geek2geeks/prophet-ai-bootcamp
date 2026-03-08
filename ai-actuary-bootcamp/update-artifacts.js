const fs = require('fs');

const filePath = 'src/lib/day-experience.ts';
let content = fs.readFileSync(filePath, 'utf8');

const artifacts = {
  0: [
    '"mapa_stack.md com as ferramentas do fundador"',
    '"log_terminal.txt ou evidência de navegação CLI"',
    '"kit_fundador final preparado e validado"'
  ],
  2: [
    '"spec.md para Upload de Assumptions e Document Drop"',
    '"constitution.md com regras globais e convenções"',
    '"checklist_aceite.md rigorosa para testar o LLM"'
  ],
  3: [
    '"model_points.json definido e validado"',
    '"assumptions_schema.json como contrato de dados"',
    '"run_result.json pronto para o frontend"'
  ],
  4: [
    '"scorecard_llm.md comparando modelos"',
    '"playbook_model_selection.md para futuras decisões"'
  ],
  5: [
    '"blueprint_prophet_lite.md com scope rigoroso"',
    '"lista_out_of_scope.md provando coragem para cortar"'
  ],
  6: [
    '"schema_extracao.json para metadados de documentos"',
    '"desenho_knowledge_workspace.md com pipeline de RAG"'
  ],
  7: [
    '"mapa_ecras_mobile.md ou wireframes core"',
    '"landing_copy.md com Proposta de Valor e Pricing"',
    '"founder_launch_pack que une spec, UX e negócio"'
  ],
  8: [
    '"motor_local_v0.1 (scripts do motor de cálculo)"',
    '"comparacao_excel_vs_motor.md (validação de output)"'
  ],
  9: [
    '"app_local_shell (código do frontend/backend local)"',
    '"copiloto_integrado na navegação dos resultados"'
  ],
  10: [
    '"README.md limpo, profissional e voltado ao utilizador"',
    '"URL da App em Produção (Live Deploy)"',
    '"post_linkedin.md pronto para publicar"'
  ]
};

// Replace or insert artifactList for each day
for (const [day, list] of Object.entries(artifacts)) {
  const dayRegex = new RegExp(`(${day}:\s*{[\s\S]*?toolRoles:\s*\[[\s\S]*?\],)(\s*)(artifactList:\s*\[[\s\S]*?\],)?`);
  
  const artifactStr = `\n    artifactList: [\n      ${list.join(',\n      ')}\n    ],`;
  
  content = content.replace(dayRegex, `$1$2${artifactStr}`);
}

fs.writeFileSync(filePath, content);
console.log('Artifacts updated.');
