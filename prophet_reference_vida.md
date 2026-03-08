# FIS Prophet -- Referencia Funcional para Vida

> Este documento descreve o que o FIS Prophet faz, como esta organizado e onde um Prophet Lite pode entrar com vantagem. Usa-o como base para os exercicios dos Dias 1 e 5.

---

## 1. O Que e o Prophet

Prophet e uma plataforma de modelacao atuarial desenvolvida pela FIS (Financial Information Systems). E o standard de mercado para seguradoras de Vida em todo o mundo. A maior parte das grandes seguradoras europeias, africanas e asiaticas usa Prophet para calculos de reservas, pricing, profit testing e reporting regulatorio.

**Pontos fortes do incumbent:**
- Cobertura regulatoria profunda (Solvencia II, IFRS 17, US GAAP, local GAAP)
- Milhares de produtos suportados (vida, saude, pensoes, unit-linked, participacao nos resultados)
- Projecao estocastica e deterministica
- Audit trail e governance maduros
- Integracao com sistemas de gestao de apolices (policy admin)
- Comunidade global de utilizadores e consultores certificados

**Onde e pesado:**
- Licenciamento caro (tipicamente 6 figuras/ano por equipa)
- Curva de aprendizagem longa (meses ate autonomia)
- Dependencia de consultores especializados para configuracao
- Interface legacy (desktop, nao cloud-native)
- Actualizacoes lentas e dependentes do vendor

---

## 2. Modulos Core do Prophet

### 2.1 Model Points (Pontos do Modelo)

Cada apolice ou grupo de apolices e representado como um "model point" -- uma linha com atributos do contrato.

| Campo tipico | Descricao | Exemplo |
|---|---|---|
| policy_id | Identificador unico | POL-00142 |
| product_type | Tipo de produto | term, endowment, whole_life |
| sex | Sexo do segurado | M, F |
| age_at_entry | Idade a entrada | 35 |
| sum_assured | Capital seguro | 100 000 |
| premium | Premio anual | 1 200 |
| term | Duracao (anos) | 20 |
| smoker_status | Fumador | smoker, non_smoker |
| start_date | Data de inicio | 2022-01-01 |

**No Prophet completo:** milhoes de model points, com agrupamento (model point compression) para performance.

**Para um MVP:** centenas a poucos milhares de model points, sem compressao, lidos de CSV/Excel.

### 2.2 Assumptions (Pressupostos)

Assumptions sao as tabuas e parametros que alimentam a projecao. No Prophet, sao organizadas por tipo:

| Assumption | Descricao | Fonte tipica |
|---|---|---|
| Mortalidade (qx) | Probabilidade de morte por idade e sexo | Tabuas CSO 2017, regulador local |
| Lapse/Resgate (wx) | Probabilidade de cancelamento por ano de apolice | Experiencia interna + mercado |
| Taxas de desconto | Yield curve ou taxa fixa | ECB, regulador, banco central |
| Despesas | Custos unitarios por apolice/ano | Contabilidade interna |
| Comissoes | Percentagem do premio por ano | Contratos de mediacao |
| Inflacao de despesas | Crescimento anual dos custos | Projecao macroeconomica |
| Mortalidade melhorada | Factores de melhoria por idade/ano | Tabuas de melhoria (ex: CMI) |

**No Prophet completo:** centenas de tabuas, multiplas bases (best estimate, locked-in, Solvencia II), versionamento sofisticado, aprovacao por governance.

**Para um MVP:** 4-6 tabuas essenciais (mortalidade, lapse, desconto, despesas, comissoes, melhoria), lidas de CSV, com validacao basica de formato.

### 2.3 Projection Engine (Motor de Projecao)

O motor e o coracao do Prophet. Recebe model points + assumptions e produz cash flows projetados ano a ano.

**Fluxo simplificado de um temporario (term life):**
```
Para cada ano t = 1 ate n:
  vivos_inicio(t)  = vivos_inicio(t-1) * (1 - qx(t-1)) * (1 - wx(t-1))
  premios(t)       = vivos_inicio(t) * premio_anual
  sinistros(t)     = vivos_inicio(t) * qx(t) * capital * v^0.5  [mid-year]
  resgates(t)      = vivos_inicio(t) * wx(t) * valor_resgate(t)
  despesas(t)      = vivos_inicio(t) * custo_unitario * (1+inflacao)^t
  comissoes(t)     = premios(t) * taxa_comissao(t)
  lucro(t)         = premios(t) - sinistros(t) - resgates(t) - despesas(t) - comissoes(t) + investimento(t)
```

**Outputs principais:**
- Cash flows por ano (premios, sinistros, resgates, despesas, comissoes)
- Reserva matematica V(t) por ano
- Profit signature (vetor de lucros)
- Valor Presente Liquido (VPL/NPV)
- Taxa Interna de Retorno (TIR/IRR)

**No Prophet completo:** projecao deterministica E estocastica, multiplos cenarios simultaneos, model point-level e portfolio-level, com paralelizacao.

**Para um MVP:** projecao deterministica apenas, um cenario de cada vez, policy-level, sem paralelizacao.

### 2.4 Reporting & Results

Prophet gera relatorios para multiplos stakeholders:

| Relatorio | Destinatario | Conteudo |
|---|---|---|
| Reservas (BEL) | Regulador / Solvencia II | Best Estimate Liabilities por produto |
| Profit Testing | Gestao / Pricing | Rentabilidade por produto e coorte |
| Embedded Value | Investidores / Board | Valor do negocio in-force |
| IFRS 17 | Contabilidade | CSM, Loss Component, RA |
| Sensibilidades | Risk Management | Impacto de choques em mortalidade, lapse, taxas |
| Run Comparison | Atuarios | Diferencas entre runs (versao a vs versao b) |

**No Prophet completo:** dezenas de relatorios pre-configurados, export para Excel/PDF, integracao com ferramentas de BI.

**Para um MVP:** dashboard simples com cash flows, reserva, profit e sensibilidade basica. Export JSON + tabela.

### 2.5 Governance & Audit Trail

Prophet tem um sistema de controlo rigoroso:

- **Versionamento de assumptions:** cada alteracao e registada com data, autor e justificacao
- **Run management:** cada execucao tem ID unico, inputs congelados, outputs rastreados
- **Approval workflows:** assumptions e resultados passam por cadeia de aprovacao
- **Role-based access:** quem pode editar assumptions vs. quem so pode ver resultados
- **Change logs:** historico completo de alteracoes a qualquer parametro

**No Prophet completo:** governance e uma feature madura com workflows de aprovacao multi-nivel, lock de periodos, e integracao com compliance.

**Para um MVP:** log basico de quem fez o que, versao de assumptions, e roles simples (admin, actuary, viewer).

---

## 3. Produtos Vida Tipicos

| Produto | Descricao | Complexidade |
|---|---|---|
| **Temporario (Term)** | Premio nivelado, beneficio por morte, sem resgate. Duracao fixa (10-30 anos). | Baixa -- bom para MVP |
| **Misto (Endowment)** | Premio temporario, beneficio por morte OU sobrevivencia, valor de resgate. | Media -- segundo produto MVP |
| **Vida Inteira (Whole Life)** | Premio vitalicio, beneficio por morte, valor de resgate crescente. Ate idade 120. | Media-alta |
| **Renda Vitalicia (Annuity)** | Premio unico ou acumulacao, pagamento periodico vitalicio. Risco de longevidade. | Alta -- pos-MVP |
| **Unit-Linked** | Componente financeira ligada a fundos de investimento. | Muito alta -- fora de scope |
| **Participacao nos Resultados** | Produto com partilha de lucros. Calculo complexo de bonus. | Muito alta -- fora de scope |

**Para o bootcamp:** foco em Temporario e Misto. Os outros sao extensoes futuras.

---

## 4. Onde um Prophet Lite Pode Entrar

### 4.1 Problemas reais do mercado atual

1. **Preco:** Prophet custa muito para equipas pequenas, consultoras ou seguradoras emergentes. Muitas usam Excel por falta de alternativa acessivel.

2. **Complexidade:** Configurar Prophet demora meses. Uma equipa pequena precisa de algo que funcione em dias, nao em trimestres.

3. **Interface:** Prophet e desktop-first, legacy. Equipas modernas querem cloud, browser, mobile.

4. **Explicabilidade:** Prophet produz numeros. Nao explica o que fez nem porque. Um copiloto AI que explica resultados e uma vantagem competitiva real.

5. **Documentos desligados:** Memos, clausulados, especificacoes tecnicas vivem em pastas partilhadas, desligados dos calculos. Ligar documentos ao motor cria valor imediato.

### 4.2 Wedge sugerida para o bootcamp

Uma "wedge" e o ponto de entrada no mercado -- o problema pequeno e concreto que resolves muito bem antes de expandir.

**Wedge do Prophet Lite:**
- Upload de assumptions (mortalidade, lapse, desconto) com validacao
- Upload de model points (carteira de apolices) com validacao
- Projecao deterministica para Vida (temporario + misto)
- Dashboard de resultados (cash flows, reserva, profit)
- Copiloto AI que explica outputs e deteta lacunas
- Document drop para memos e clausulados ligados ao trabalho

**O que fica FORA do MVP:**
- Projecao estocastica
- IFRS 17 / contabilidade completa
- Multiplas geografias e regulacoes
- Produtos unit-linked ou com participacao nos resultados
- Governance multi-nivel com approval workflows
- Integracao com policy admin systems
- Model point compression / paralelizacao

### 4.3 Quem e o primeiro cliente

| Segmento | Porque compra | Tamanho tipico |
|---|---|---|
| Consultora atuarial pequena | Precisa de ferramenta propria, nao quer depender de licencas Prophet | 3-15 pessoas |
| Seguradora sem stack moderna | Usa Excel, quer modernizar sem investimento enorme | Equipa atuarial de 5-20 |
| Broker com operacoes de Vida | Precisa de validar premios e reservas rapidamente | 2-10 atuarios |
| Equipa de pricing em seguradora media | Quer autonomia para prototipar sem esperar pela equipa central de Prophet | 3-8 pessoas |

---

## 5. Regras Matematicas de Referencia

Estas sao as convencoes que o Prophet Lite deve seguir no bootcamp:

| Regra | Convencao |
|---|---|
| Base temporal | ACT/365 |
| Mortes | Mid-year: desconto a v^(t-0.5) |
| Premios | Inicio de ano: desconto a v^(t-1) |
| Resgates | Fim de ano: desconto a v^t |
| Arredondamento | Monetarios 2 casas; taxas 8 intermedias, 6 no output final |
| Tabua base | CSO 2017, idade terminal 120 (qx=1.0) |
| Fumador | qx_fumador = qx_base * 1.50 |
| Melhoria mortalidade | Multiplicativa: qx(x,ano) = qx_base(x) * prod(1-f(x,a)) |
| Taxa desconto base | 4% anual para motor v0.1; yield curve ECB para stress |
| Produtos | Temporario (term) e Misto (endowment) |

---

## 6. Resumo para Decisao

| Dimensao | Prophet (FIS) | Prophet Lite (Bootcamp) |
|---|---|---|
| Produtos | 50+ tipos | 2 (term + endowment) |
| Projecao | Deterministica + estocastica | Deterministica apenas |
| Assumptions | Centenas de tabuas | 4-6 tabuas essenciais |
| Interface | Desktop legacy | Web (Streamlit), mobile-first |
| Explicabilidade | Nenhuma nativa | Copiloto AI integrado |
| Documentos | Externos | Document drop integrado |
| Governance | Multi-nivel, maduro | Basico (roles + logs) |
| Preco | 6 figuras/ano | SaaS acessivel |
| Setup | Meses | Dias |
| Publico | Grandes seguradoras | Equipas pequenas, consultoras |

> **Pergunta central para o exercicio:** Olhando para esta tabela, onde esta a oportunidade? O que podes fazer melhor, mais rapido ou mais barato do que o incumbent -- sem tentar fazer tudo?

---

## Glossario de Termos Nao Atuariais

Se encontraste palavras desconhecidas neste documento, aqui estao as definicoes:

| Termo | Significado |
|---|---|
| **Incumbent** | O produto dominante que ja existe no mercado. Neste caso, o FIS Prophet. |
| **MVP (Minimum Viable Product)** | A versao mais simples do produto que ja e util o suficiente para alguem usar. Nao tem todas as funcionalidades -- tem apenas as essenciais. |
| **SaaS (Software as a Service)** | Software que o cliente acede pela internet (num browser) e paga por subscricao mensal ou anual, em vez de instalar no computador. |
| **Wedge (cunha de mercado)** | O primeiro problema pequeno e concreto que o teu produto resolve, antes de expandir para problemas maiores. |
| **Cloud-native** | Software desenhado para funcionar na internet (em servidores remotos como AWS ou Azure), em vez de ser instalado no computador do escritorio. |
| **Legacy** | Software antigo que ainda esta em uso porque e dificil ou caro substituir, mesmo que ja esteja desatualizado. |
| **Vendor** | A empresa que fez e vende o software. No caso do Prophet, o vendor e a FIS. |
| **Streamlit** | Uma ferramenta gratuita em Python que permite criar paginas web e paineis interativos sem saber programacao web. E o que vamos usar para construir a interface do Prophet Lite. |
| **Mobile-first** | Filosofia de design onde se desenha primeiro para telemovel, depois adapta para computador. Obriga a simplicidade e clareza. |
| **UX (User Experience)** | A facilidade, clareza e agradabilidade com que alguem usa o software. Boa UX = o utilizador percebe o que fazer sem precisar de manual. |
| **Copiloto AI** | Um assistente de inteligencia artificial integrado no software que ajuda o utilizador -- explica resultados, deteta erros, e responde a perguntas sobre os calculos. |
| **Document drop** | Funcionalidade onde se arrasta um documento (PDF, Word) para a aplicacao e o sistema le, classifica e liga a informacao ao trabalho atuarial. |
| **Dashboard (painel)** | Um ecra na aplicacao que mostra os resultados principais (graficos, tabelas, metricas) de forma visual e interativa. |
| **JSON** | Um formato de dados usado por software para trocar informacao. E como um CSV mas com estrutura hierarquica. Exemplo: `{"nome": "Maria", "idade": 35}`. |
| **CSV (Comma-Separated Values)** | Ficheiro de texto onde os dados sao separados por virgulas. E o formato mais simples para dados tabulares -- como um Excel sem formatacao. |
| **Deploy** | O ato de colocar o software na internet para que outras pessoas o possam usar, em vez de funcionar apenas no teu computador. |
| **Stack (tech stack)** | O conjunto de ferramentas e tecnologias que o produto usa. Ex: Python + Streamlit + Supabase e uma stack. |
| **Feature (funcionalidade)** | Uma capacidade especifica do software. Ex: "carregar tabuas de mortalidade" e uma feature. |
| **BI (Business Intelligence)** | Ferramentas como Power BI ou Tableau que criam graficos, relatorios e paineis visuais a partir de dados. |
| **Policy admin systems** | Os sistemas informaticos que as seguradoras usam para gerir apolices -- emissao, alteracoes, renovacoes e cancelamentos. |
| **Paralelizacao** | Tecnica informatica de correr muitos calculos ao mesmo tempo (em vez de um a um) para que o software seja mais rapido. |
| **6 figuras/ano** | Expressao que significa "100.000 ou mais" por ano. Uma licenca de Prophet custa tipicamente 100.000+ EUR/ano por equipa. |
| **Scope (ambito)** | O que o produto faz e o que nao faz. "Fora de scope" = algo que o produto deliberadamente nao inclui. |
| **Audit trail** | Registo automatico de quem fez o que, quando e com que dados. Essencial para reguladores e auditores -- ja conheces este conceito do trabalho atuarial. |
