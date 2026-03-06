import streamlit as st
from lib.auth import require_auth

require_auth()

st.header("Recursos & Datasets")
st.caption("Todos os ficheiros necessarios para o bootcamp")

st.markdown("### Vertical VIDA (Dominio Principal)")

vida_s1 = {
    "carteira_apolices_vida.csv": "Carteira de 3K apolices vida: temporario, vida inteira, misto, renda vitalicia",
    "sinistralidade_vida.csv": "Historico de eventos vida (obitos, resgates, vencimentos, rendas) — 1.5K registos, 8 anomalias",
    "exclusoes_apolice_vida.json": "Exclusoes: suicidio, guerra, desportos radicais, incontestabilidade",
    "nota_sinistro_vida.txt": "3 processos de sinistro vida (obito simples, suicidio em carencia, declaracao falsa)",
    "red_flags_fraude_vida.csv": "200 sinistros com ~40 red flags de fraude escondidos",
    "questionario_subscricao_vida.csv": "500 propostas de subscricao — ~20 declaracoes falsas",
}

vida_s2 = {
    "tabua_mortalidade_CSO2017.csv": "Tabua SOA CSO 2017 (qx por idade e sexo, 0-120 anos)",
    "taxas_resgate.csv": "Taxas de lapse por ano de apolice e produto",
    "yield_curve_ECB.csv": "Curva de taxas de juro ECB (72 meses, 6 tenors)",
    "factores_melhoramento_mortalidade.csv": "Melhoramento mortalidade 2017-2050, com choque COVID",
    "comissoes_mediacao.csv": "Comissoes por produto/ano, regras de clawback",
    "mortalidade_covid_portugal.csv": "Excesso mortalidade PT 2019-2023, por faixa etaria/sexo",
    "benchmark_mercado_vida_pt.csv": "Benchmarks mercado vida PT 2018-2025",
}

for name, desc in vida_s1.items():
    st.markdown(f"- **`{name}`** (`/dados/semana-1/`) — {desc}")
for name, desc in vida_s2.items():
    st.markdown(f"- **`{name}`** (`/dados/semana-2/`) — {desc}")

st.markdown("---")
st.markdown("### Vertical SAUDE (Dia 3)")

saude = {
    "medical_costs_sample.csv": "10K registos de custos medicos (idade, IMC, fumador, custo)",
    "sinistralidade_historica.csv": "5K sinistros saude com 10 anomalias intencionais",
    "exclusoes_apolice.json": "Exclusoes saude com codigos CID",
    "fatura_hospital_*.pdf": "5 faturas hospitalares para OCR",
    "fatura_farmacia_*.jpg": "3 recibos de farmacia para OCR",
    "condicoes_gerais_saude.pdf": "Clausulado geral de seguro saude (~30 paginas, para RAG)",
    "nota_alta_hospitalar.txt": "3 notas de alta hospitalar",
    "tabua_morbilidade_saude.csv": "Frequencia + severidade por faixa etaria",
    "carteira_beneficiarios.csv": "5K beneficiarios saude",
}

for name, desc in saude.items():
    st.markdown(f"- **`{name}`** — {desc}")

st.markdown("---")
st.markdown("### Templates & Utilidades")

templates = {
    "template_constitution.md": "Template base para constitution.md (SDD)",
    "template_spec.md": "Template base para spec.md",
    "template_modelo_negocio.md": "Template para modelo de negocio (Dia 9)",
    "template_calculadora_escala.md": "Template para exercicio de escala pessoal (Dia 1)",
    "checklist_auditoria_codigo.md": "5 perguntas de auditoria de codigo gerado por IA",
    "scripts_com_bugs.md": "5 scripts com bugs atuariais escondidos (Dia 2)",
    "excel_validacao_cashflow.md": "Calculo manual de referencia para validar cash flows (Dia 7)",
}

for name, desc in templates.items():
    st.markdown(f"- **`{name}`** (`/templates/`) — {desc}")

st.markdown("---")
st.markdown("### Stack Tecnologico")
st.markdown("""
| Categoria | Ferramenta |
|---|---|
| Linguagem | Python 3.11+ |
| AI Coding | OpenCode CLI + Z.ai Coding Plan (GLM-5) |
| LLM API | DeepSeek (endpoint OpenAI-compatible) |
| Agentes | CrewAI |
| ML | Scikit-learn, XGBoost, SHAP |
| Web | Streamlit |
| Auth & DB | Supabase (Auth + PostgreSQL + RLS) |
| RAG | ChromaDB (local) |
| Deploy | Streamlit Community Cloud |
""")

st.markdown("---")
st.markdown("### Links Uteis")
st.markdown("""
- [Repositorio do Curso](https://github.com/geek2geeks/prophet-ai-bootcamp)
- [Streamlit Cloud](https://share.streamlit.io/)
- [Supabase Dashboard](https://supabase.com/dashboard)
- [DeepSeek API Docs](https://platform.deepseek.com/docs)
- [CrewAI Docs](https://docs.crewai.com/)
""")
