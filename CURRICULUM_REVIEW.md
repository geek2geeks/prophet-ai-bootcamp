# Prophet AI Bootcamp -- Curriculum Review

> **Date:** 2026-03-07
> **Reviewer:** 11 parallel AI critics (one per day)
> **Mission under review:** Help life actuaries catch up on data science, use AI for their daily job, understand how AI models work, and build a portfolio SaaS app (Prophet AI).

---

## Executive Summary

| Day | Title | Score | Key Issue |
|-----|-------|-------|-----------|
| 0 | Terminal LLMs para Tarefas de Escritorio | 5/10 | MCP too advanced for day 0; no terminal basics taught |
| 1 | Pensar em Escala -- O Porque Antes do Como | 4/10 | Only 2 exercises; overlap with Day 0; filler content |
| 2 | Data Wrangling -- Delegando o Trabalho Pesado a IA | 6/10 | Steep cliff from Day 1; fraud detection premature; Streamlit not taught |
| 3 | Modulo Saude -- OCR, Pipeline & Pricing | 4/10 | XGBoost before ML is taught; Health vertical orphaned; cognitive overload |
| 4 | ML para Vida -- Mortalidade, Lapse & Pricing | 6/10 | Too many new concepts; missing training datasets; fairness only a buzzword |
| 5 | Agentes Autonomos, RAG & Revisao Semana 1 | 6/10 | Overloaded (4 exercises); "Week 1 review" is a ghost; CrewAI is risky |
| 6 | Entendendo o Prophet & Arquitetando o Motor | 6/10 | Underfilled (2 exercises); no Prophet reference material; no conteudo |
| 7 | Construindo o Motor Deterministico (Vida) | 6/10 | Only 2 exercises for complex engine; no benchmark values; math rules incomplete |
| 8 | Agentes LLM, Cenarios de Stress & RBAC | 5/10 | Three unrelated topics jammed together; RBAC redundant; agent integration premature |
| 9 | De Prototipo a Produto -- Deploy & Modelo de Negocio | 5/10 | Streamlit deploy is trivial; business model is shallow; no AI content |
| 10 | Polimento Final & Apresentacoes | 5/10 | Drastically underweight; no retrospective; 5-min presentation too short |

**Average score: 5.3/10**

---

## Cross-Cutting Issues

### 1. Missing teaching content (`conteudo`)
Only Day 0 has detailed module content in `course.py`. Days 1-10 have module titles and exercise descriptions but **zero structured instructional material**. The AI Tutor has only one-line summaries for these days. This is the single largest gap in the curriculum.

### 2. Uneven exercise distribution
| Day | Exercises | Points (ex) | Points (total) |
|-----|-----------|-------------|----------------|
| 0 | 6 | 60 | 85 |
| 1 | 2 | 20 | 45 |
| 2 | 3 | 30 | 55 |
| 3 | 3 | 30 | 55 |
| 4 | 3 | 30 | 55 |
| 5 | 4 | 40 | 65 |
| 6 | 2 | 20 | 45 |
| 7 | 2 | 20 | 45 |
| 8 | 2 | 20 | 45 |
| 9 | 3 | 30 | 55 |
| 10 | 1 | 10 | 35 |

Days 1, 6, 7, 8, and 10 are underweight. Day 7 (the engine build -- the heart of the bootcamp) has the same exercise count as Day 1 (tool installation).

### 3. Sequencing violations
- **Day 3** uses XGBoost before ML is formally taught on Day 4.
- **Day 2** expects Streamlit dashboards before Streamlit is introduced.
- **Day 0** teaches MCP before students know what a terminal is.
- **Day 1** reinstalls OpenCode already installed on Day 0.

### 4. No Python/pandas fundamentals anywhere
The target audience is life actuaries who may have zero coding experience. There is no dedicated module on Python basics, pandas DataFrames, or basic plotting. The curriculum assumes students can review AI-generated pandas code but never teaches them how.

### 5. Health vertical is orphaned
Day 3 builds a complete Health TPA module that is never referenced again. Days 6-10 build Prophet AI exclusively around Life. The Health work contributes zero reusable components to the portfolio project.

---

## Day-by-Day Critiques

---

## DAY 0: "Terminal LLMs para Tarefas de Escritorio"

### Score: 5/10

### Goal alignment
The core idea -- get actuaries productive with terminal LLMs before the intensive weeks -- is sound and strategically correct. However, the day overreaches by introducing MCP configuration (a developer-level concept requiring JSON editing, server processes, and debugging) to an audience that may never have opened a terminal.

### Strengths
1. **Terminal LLMs as the entry point is the right call.** By Day 1 students must use OpenCode to generate specs and code.
2. **Actuarial-specific tasks in exercises 0.2 and 0.3 are excellent.** Interpreting regulation, analyzing mortality tables, and drafting technical opinions are tasks every life actuary does weekly.
3. **Module 2 covers concepts that prevent confusion later.** Understanding tokens, temperature, context windows, and cost estimation before students start burning API credits.
4. **The challenge (3 reusable prompts) is practical and portfolio-worthy.**

### Weaknesses
1. **No terminal/command-line fundamentals are taught.** There is zero content on what a terminal is, how to navigate directories, what a PATH is, or how to install things via npm/pip. Exercise 0.1 could be a show-stopper.
2. **MCP is too advanced for Day 0.** Exercises 0.5 and 0.6 require installing MCP servers, editing JSON configs, debugging client-server connectivity. This belongs in Day 1 or Day 5.
3. **The point allocation creates distorted incentives.** MCP exercises are 33% of points but the hardest, most failure-prone topic.
4. **No explicit mention of how to get an API key.** No guidance on account creation, billing, provider choice.
5. **Exercise 0.4 is vague.** "Vary temperature, test JSON mode" -- through what interface?
6. **No sample data provided for Day 0.** Exercises reference "a document" and "a CSV" without providing them.
7. **Web browsing topic is mentioned but never exercised.**
8. **No estimated time budget** for a self-paced pre-bootcamp day.

### Actionable improvements
1. Add a "Terminal & Environment Basics" preliminary section (30 min).
2. Move MCP to Day 1 or Day 5. Replace with prompt engineering and cost estimation exercises.
3. Provide a concrete "Which provider to use" guide with step-by-step screenshots.
4. Bundle a Day 0 starter kit (sample PDF, sample CSV, sample mortality table).
5. Make exercise 0.4 concrete with a structured comparison table.
6. Clarify mandatory vs. bonus nature. Resolve overlap with Day 1 setup.
7. Add estimated time per exercise.

---

## DAY 1: "Pensar em Escala -- O Porque Antes do Como"

### Score: 4/10

### Goal alignment
Partially aligned. The SDD introduction is strategically placed, but execution is thin and disjointed. The "actuary as tech entrepreneur" module is a pure motivation talk with no deliverable. The day does not move students meaningfully closer to building anything.

### Strengths
1. **The SDD introduction is strategically placed.** Days 2-5 depend on spec-driven workflows.
2. **The challenge is well-designed.** Writing spec.md, generating code, and auditing is a genuine end-to-end workflow.
3. **"Why before how" framing is pedagogically sound.**

### Weaknesses
1. **Severe overlap with Day 0.** Day 0 ex0.1 already covers OpenCode installation. Day 1 ex1.1 duplicates it.
2. **Only 2 exercises (20pts) is a structural anomaly.** Every other Week 1 day has 3-4 exercises.
3. **The "Calculadora de Escala Pessoal" is filler.** A motivational template exercise that teaches no Python, uses no AI tools, practices no measurable skill.
4. **No lesson content (`conteudo`) is defined.** Day 0 has 12 detailed topics. Day 1 has nothing.
5. **Module 1 has no deliverable.** Pure lecture with no associated exercise.
6. **SDD introduction is under-supported.** No guided spec walkthrough before asking students to write one independently.
7. **Z.ai is introduced without context.**

### Actionable improvements
1. Eliminate setup overlap. Merge all tool installation into Day 0.
2. Replace scale calculator with an SDD scaffolding exercise (given a pre-written spec, run OpenCode, compare output).
3. Add at least one more exercise: "Audit AI-Generated Code" using the checklist from Resources.
4. Populate the `conteudo` field with 4-6 topics per module.
5. Move scale calculator into Module 1's lecture content as a discussion prompt.
6. Add a guided spec walkthrough before the challenge.

---

## DAY 2: "Data Wrangling -- Delegando o Trabalho Pesado a IA"

### Score: 6/10

### Goal alignment
Well-aligned with the bootcamp's core thesis of delegating technical work to AI. The SDD methodology is reinforced and datasets are genuinely actuarial. However, the day covers too much ground for the second day after a thin Day 1.

### Strengths
1. **Excellent dataset design.** 3K policies, 1.5K events, 200 fraud claims with proper Portuguese insurance terminology.
2. **Intentional anomalies (8 in sinistralidade_vida.csv)** give students a concrete, verifiable target.
3. **SDD continuity** -- writing specs for data cleaning reinforces Day 1 methodology.
4. **Domain-rich EDA exercise** with standard actuarial portfolio analyses.
5. **Progressive dataset reuse** -- same files reappear on Day 5 for agent-based analysis.

### Weaknesses
1. **Steep pedagogical cliff from Day 1.** Day 1 was installing tools. Day 2 expects data cleaning, four-dimensional EDA, 30+ fraud flags, and a Streamlit dashboard. No intermediate pandas learning.
2. **Fraud detection (ex2.3) is premature and under-specified.** No fraud typology taught first. No rubric defining what counts as a "flag."
3. **Streamlit challenge assumes undeclared prior knowledge.** Streamlit has not been introduced anywhere.
4. **Missing module-level content (`conteudo`).**
5. **No answer key for the 8 anomalies.** No instructor solution file documented.
6. **No data dictionary** explaining column meanings and valid ranges.
7. **Flat point allocation** despite very different difficulty levels.

### Actionable improvements
1. Insert a "Python & Pandas for Actuaries" bridging module (either late Day 1 or early Day 2).
2. Move fraud detection (ex2.3) to Day 4 or Day 5 where ML/agents are taught.
3. Add a 30-minute Streamlit primer, or defer the dashboard to Day 3.
4. Create instructor answer keys and a data dictionary.
5. Provide a Streamlit starter template (50% pre-written).

---

## DAY 3: "Modulo Saude -- OCR, Pipeline & Pricing"

### Score: 4/10

### Goal alignment
Weak alignment. The Health vertical does not advance the Prophet AI portfolio project. The TPA module built in the challenge is never revisited. OCR is tangential to actuarial data science skills. XGBoost is used before ML is formally taught.

### Strengths
1. **Well-prepared data assets** -- thorough, realistic datasets with planted gotchas.
2. **Business rules exercise (ex3.3) is excellent pedagogy** -- cross-referencing OCR-extracted ICD codes against exclusions.
3. **End-to-end pipeline thinking** mirrors real TPA workflows.
4. **Variety of file formats** (PDF, JPG, CSV, JSON).

### Weaknesses
1. **XGBoost before ML fundamentals (critical sequencing error).** Day 4 is where ML is formally introduced. Students on Day 3 have had zero ML instruction.
2. **Cognitive overload -- four distinct skill domains in one day.** OCR + data wrangling + ML pricing + legal compliance + full Streamlit app.
3. **OCR is a niche skill for the target audience.** Life actuaries rarely process scanned invoices.
4. **Health vertical is orphaned.** The only Health-focused day. TPA module never referenced again in Days 6-10.
5. **Challenge scope is unrealistic** for a single-day deliverable (upload, OCR, exclusions, fraud, pricing in one app).
6. **No explicit learning about Vision APIs / multimodal models** despite the module title.

### Actionable improvements
1. Move Health pricing to Day 4 where ML is formally taught.
2. Consider merging Health content into existing Life days instead of a standalone day (OCR into Day 2, pricing into Day 4).
3. If Day 3 must remain standalone, narrow scope to OCR + business rules validation only.
4. Scale down the challenge to upload + OCR + exclusion flagging (drop pricing and fraud).
5. Connect Health work explicitly to the Prophet AI portfolio project (e.g., as a "Health add-on tier").

---

## DAY 4: "ML para Vida -- Mortalidade, Lapse & Pricing"

### Score: 6/10

### Goal alignment
Directly serves the mission on multiple fronts. Bridges actuarial domain knowledge with data science tooling. Connects to the Prophet AI engine (Days 7-8). However, tries to cover so much conceptual ground that alignment risks becoming superficial.

### Strengths
1. **Actuarially grounded exercises.** Mortality modeling, lapse prediction, and underwriting fraud are the daily bread of life actuaries.
2. **Datasets are well-crafted.** CSO 2017, lapse rates, and 500 underwriting proposals with 35 verified false declarations.
3. **Smart sequencing** -- Day 3 gave prior XGBoost exposure; CSO and lapse tables reappear in Days 7-8.
4. **SHAP as the interpretability tool** is the current industry standard for model explainability.
5. **Challenge is well-scoped as integration** -- previews Prophet AI architecture.

### Weaknesses
1. **Cognitive overload.** Logistic Regression, XGBoost, SHAP, fairness, AND fraud detection in one day is too much for ML newcomers.
2. **No teaching content (`conteudo`).** Module titles are just labels with no material behind them.
3. **Algorithmic fairness is mentioned but never taught.** No metric, no protected attribute, no concrete deliverable.
4. **ex4.1 lacks a training dataset.** CSO 2017 is a mortality table, not individual-level training data. How do students build a classifier?
5. **ex4.2 similarly lacks a labeled training set.** `taxas_resgate.csv` is aggregate rates, not individual surrender events.
6. **ex4.3 says "~20 false declarations" but data has ~35.** Discrepancy will confuse students.
7. **ex4.3 framing as "ML" is questionable.** A simple string filter on the verification column suffices. Need to specify: train on declared features only.
8. **No mention of data splitting, overfitting, or evaluation metrics.**

### Actionable improvements
1. Add full teaching content (`conteudo`) for both modules.
2. Explicitly specify training datasets for ex4.1 and ex4.2 (join portfolio with events to create labels).
3. Fix false declaration count ("~20" -> "~35").
4. Clarify ex4.3: "Train using only declared features. Use verification column as ground truth labels only."
5. Add mandatory evaluation steps (train/test split, AUC-ROC, confusion matrix).
6. Give fairness a concrete mini-exercise with a specific metric and threshold.
7. Provide a starter notebook skeleton.
8. Bridge to Day 7: "Save your trained models as pickle files for the cash flow engine."

---

## DAY 5: "Agentes Autonomos, RAG & Revisao da Semana 1"

### Score: 6/10

### Goal alignment
RAG and autonomous agents are directly relevant to actuaries' daily work. However, the "Week 1 review" objective is completely absent from actual exercises. The day tries to cover too much and agents are not connected to Prophet AI until Day 8.

### Strengths
1. **Excellent supporting data.** The 3 claim processes in `nota_sinistro_vida.txt` have increasing legal complexity.
2. **Strong domain relevance.** Every exercise maps to a recognizable actuarial workflow.
3. **Progressive complexity** from RAG to single agent to specialized agents to multi-agent orchestration.
4. **The challenge is genuinely compelling** -- 5-agent team with objectively gradable outcomes.
5. **Data files exist and are consistent.**

### Weaknesses
1. **Overloaded: 4 exercises + challenge is the heaviest day.** Each exercise requires setting up a different system.
2. **"Week 1 Review" is a ghost.** Zero review content, no retrospective, no consolidation.
3. **CrewAI is a risky framework choice.** Breaking API changes, steep learning curve, not in `requirements.txt`.
4. **No teaching content defined.** No structured instructional material for RAG or agent concepts.
5. **Sequencing problem.** ML was just introduced yesterday. RAG, vector databases, embeddings, and agents are unrelated and complex.
6. **ex5.1 uses a health document** in a life-focused day (domain mismatch).
7. **ex5.3 and ex5.4 overlap with Day 2** using the same datasets.
8. **PythonREPLTool is a security concern** without sandboxing instructions.

### Actionable improvements
1. Reduce to 3 exercises. Merge ex5.3 and ex5.4 into a single analytics + fraud agent.
2. Add a genuine Week 1 review component, or rename the day.
3. Teach agents framework-agnostically first (simple function-calling loop), then optionally introduce CrewAI.
4. Create `conteudo` content (RAG intuition, embeddings, agent paradigm, tool calling).
5. Fix domain mismatch: create `condicoes_gerais_vida.pdf` or reframe ex5.1 as cross-domain.
6. Update `requirements.txt` with chromadb, crewai, sentence-transformers.
7. Add safety notes for PythonREPLTool.

---

## DAY 6: "Entendendo o Prophet & Arquitetando o Motor"

### Score: 6/10

### Goal alignment
Conceptually well-placed as the Week 2 opener. Spec-first, build-second reinforces SDD methodology. However, leans too heavily on document writing and too lightly on hands-on coding.

### Strengths
1. **Strategic Week 2 opener.** Forcing architecture before coding is sound.
2. **Constitution.md as a concept** bridges actuarial rigor and software engineering.
3. **RBAC at design time** avoids costly rework.
4. **Challenge deliverable is tangible** and directly feeds Day 7.

### Weaknesses
1. **Underfilled -- only 2 exercises (20 pts).** Ties for lowest exercise count.
2. **Missing `conteudo`.** No structured teaching material for modules.
3. **No Prophet reference material.** No document describing what FIS Prophet actually does. Students who never used Prophet have no starting point.
4. **Jarring transition from Day 5.** No bridge connecting agent skills to Prophet AI architecture.
5. **Exercise 6.2 packs three distinct tasks** (constitution, RBAC spec, Supabase setup) into one 10-point exercise.
6. **No connection to Week 1 outputs.** Day 6 does not reference mortality models, fraud detectors, or pricing engines from Days 1-5.

### Actionable improvements
1. Add ex6.3: "Architecture Kata -- Connect Week 1 to Week 2" (map Week 1 outputs to Prophet AI modules).
2. Provide a Prophet reference document (2-3 page PDF describing FIS Prophet workflow).
3. Split ex6.2 into two: (a) constitution.md with math rules, (b) RBAC spec + Supabase setup.
4. Add `conteudo` with topics like "What is FIS Prophet?", "The Model Point Concept", "RBAC Fundamentals."
5. Add a transition warm-up connecting Day 5 agents to Prophet AI.
6. Move Supabase project configuration to Day 1 pre-work.

---

## DAY 7: "Construindo o Motor Deterministico (Vida)"

### Score: 6/10

### Goal alignment
The single most important day in the bootcamp. Perfectly aligned with the mission. However, under-invested relative to its importance -- same exercise count as Day 1 (setup) or Day 6 (architecture).

### Strengths
1. **Correct sequencing with Day 6** (spec-first, build-second).
2. **Well-chosen data assets** (CSO 2017, lapse rates, improvement factors, yield curve, commissions).
3. **Math rules stated explicitly** (ACT/365, mid-year convention, smoker +50%, multiplicative improvement).
4. **Challenge is well-scoped as a concept** (JSON input, 20-year projection, V(t), profit signature, NPV, pytest).
5. **AI-assisted code generation is central.**

### Weaknesses
1. **Only 2 exercises for an enormously complex engine.** The engine involves 6-8 distinct sub-problems. Each exercise is actually 3-4 exercises bundled together.
2. **Math rules are incomplete.** Missing: premium calculation method, discount rate source, reserve method (prospective vs retrospective), endowment product definition, expense treatment, mid-year convention precision.
3. **No reference/benchmark values.** "Compare with manual calculation" but no golden-answer file exists. Students cannot verify correctness.
4. **Challenge is too ambitious for a single day.** JSON schema + 20-year projection + V(t) + profit signature + NPV + pytest tests.
5. **No "minimum viable engine" checkpoint** between exercises and challenge. If Day 7 is buggy, Day 8 collapses.
6. **Product types are underspecified.** No product specifications for term vs endowment vs whole life.
7. **Commissions data is never referenced** despite existing in the data directory.

### Actionable improvements
1. **Expand to 4-5 exercises**, each targeting one sub-problem: (a) load assumptions, (b) single-decrement projection, (c) multiple decrements + premium calculation, (d) V(t) reserves, (e) profit testing with expenses.
2. **Provide a "golden spreadsheet"** with expected values for at least one standard policy.
3. **Specify discount rate convention** (flat 4% for Day 7; yield curve for Day 8 stress tests).
4. **Define product specifications** in a `produtos_vida.json` file.
5. Add a "minimum viable engine" checkpoint after exercises.
6. **Consider making Day 7 a 1.5-day effort** (start afternoon of Day 6 or extend into Day 8 morning).
7. Clarify mid-year convention with a formula.
8. Provide a JSON input schema example.

---

## DAY 8: "Agentes LLM, Cenarios de Stress & RBAC"

### Score: 5/10

### Goal alignment
Three individually valuable topics, but bundling them dilutes depth. The day feels like a list of leftovers rather than a coherent learning arc.

### Strengths
1. **Actuarially meaningful agent integration** with real scenario parameters.
2. **Real Solvency II stress calibration** broadly consistent with EIOPA Standard Formula.
3. **Supporting datasets exist** (COVID mortality, ECB yield curve).
4. **Tornado chart is specific, visual, assessable** and standard actuarial practice.
5. **RBAC schema already scaffolded** in Supabase.

### Weaknesses
1. **Three unrelated topics jammed into one day.** Agent orchestration + Solvency II + RBAC are each full-day topics.
2. **Only 2 exercises for three major domains.** ex8.1 alone contains 4+ distinct implementation tasks.
3. **RBAC is redundant** with Day 6 (spec) and Day 9 (production). Unclear what is new here.
4. **Agent integration is premature.** No framework specified, no API contract between agent and engine, no intermediate steps.
5. **Solvency II shocks have inconsistencies.** ex8.1 says mortality +20% but the spec says +15%. Missing nuances: longevity applies only to annuities, mass lapse only to positive surrender strain.
6. **Challenge is essentially the entire Prophet AI MVP.** Overlaps with Day 10 final project.
7. **COVID scenario lacks specification** on how to translate excess mortality into qx shocks.

### Actionable improvements
1. **Split or redistribute.** Make Day 8 purely stress testing + tornado chart. Move RBAC to Day 9. Move agent integration to Day 7 afternoon.
2. **Add at least one more exercise** to decompose workload.
3. **Reconcile mortality shock values** (+15% or +20%).
4. **Add nuance to Solvency II descriptions** (which products each shock applies to).
5. **Provide agent-engine integration scaffolding** (interface contract, tool definitions).
6. Write detailed `conteudo` for both modules.
7. Clarify RBAC scope boundaries across Days 6, 8, and 9.
8. Add explicit COVID scenario guidance.

---

## DAY 9: "De Prototipo a Produto -- Deploy & Modelo de Negocio"

### Score: 5/10

### Goal alignment
The right narrative beat for a penultimate day. However, Streamlit Cloud deployment is trivially simple, the business model exercise is shallow, and the day drops AI content entirely -- breaking the bootcamp's through-line.

### Strengths
1. **Correct narrative placement** (deploy before final presentation day).
2. **Solid market data** in `benchmark_mercado_vida_pt.csv`.
3. **RBAC continuity** -- validates that Supabase RLS survives deployment.
4. **Business model template scaffolding** exists in Resources.
5. **End-to-end deliverable** (live URL, RBAC, UI, README, pricing).

### Weaknesses
1. **No module content (`conteudo`)** for deployment or business model frameworks.
2. **Streamlit Cloud as "SaaS" is misleading.** No custom domain, no billing, no background workers. Deployment is clicking a button.
3. **ex9.2 (benchmarking) is disconnected.** Engine produces policy-level projections; benchmark CSV has aggregate market metrics. No bridge between them.
4. **ex9.3 (business model) is shallow.** Fill-in-the-blanks template with no competitive analysis, unit economics, or financial modeling.
5. **No technical depth on production concerns.** No secrets management, monitoring, error handling, CI/CD, or testing.
6. **Challenge overlaps with Day 8's challenge** (both require RBAC + professional interface).
7. **No AI content on Day 9.** Breaks the rhythm of every prior day using AI tools.
8. **Hardcoded Supabase URL in auth.py** is a security anti-pattern that Day 9 should flag and fix.

### Actionable improvements
1. Add `conteudo` covering deployment best practices, Streamlit Cloud limitations, and SaaS pricing models.
2. Replace trivial ex9.1 with real DevOps (Dockerfile, GitHub Actions CI, secrets via env vars, health check).
3. Redesign ex9.2: run engine for 100 sample policies, aggregate to market level, compare with benchmark.
4. Deepen ex9.3: TAM estimation, 3-tier pricing model, 12-month revenue projection, CAC payback. Play to actuarial strengths.
5. Reintroduce AI: use LLM to generate README, deployment checklist, and pitch text.
6. Add production hardening sub-exercise (audit hardcoded credentials, fix silent exception handling).
7. Differentiate challenge from Day 8 (require live URL + recorded walkthrough + landing page).

---

## DAY 10: "Polimento Final & Apresentacoes"

### Score: 5/10

### Goal alignment
A final presentation is the right capstone. However, the day severely underutilizes its time and misses critical opportunities for knowledge consolidation.

### Strengths
1. **Presentation as a forcing function** ensures the app actually works end-to-end.
2. **Business model + 90-day plan** pushes beyond pure technical execution.
3. **Peer voting** introduces social stakes and mirrors real pitch dynamics.
4. **Morning polish sprint** acknowledges software is never "done."

### Weaknesses
1. **Drastically underweight** -- only 35 points (10 ex + 25 challenge). Lowest in the bootcamp.
2. **No retrospective or knowledge consolidation.** After 10 intensive days, zero structured reflection.
3. **5-minute presentation is too short.** Live demo + business model + 90-day roadmap in 5 minutes is unrealistic.
4. **"90-day roadmap" is speculative.** Students lack context for credible projections after 10 days of coding.
5. **Module 2 is undefined.** "O Dia Depois do Bootcamp" has no content description.
6. **No peer code review.** A missed opportunity for learning and quality assurance.
7. **ex10.1 conflates four distinct activities** (bug fixes, README, testing, presentation rehearsal).
8. **No demo failure contingency.** Live demos crash.

### Actionable improvements
1. **Extend presentation to 8-10 min** with structured segments. Drop 90-day roadmap from presentation; make it a written deliverable.
2. **Add a structured retrospective exercise** (Skills Acquired Matrix, self-assessment).
3. **Add a peer code review exercise** (review one peer's Prophet AI repo).
4. Break ex10.1 into separate exercises (technical polish vs. presentation prep).
5. Define Module 2 content (learning paths, how to maintain Prophet AI, community resources).
6. Add a written 90-day plan as a separate graded exercise with a template.
7. Rebalance points to ~65 (proportionate to capstone importance).
8. Require screenshots or recorded backup video as demo failure contingency.

---

## Top 10 Priority Fixes

1. **Add `conteudo` (teaching content) for Days 1-10** -- match the depth of Day 0.
2. **Add a Python/pandas fundamentals module** early in the curriculum (Day 1 or Day 2).
3. **Provide golden-answer files / benchmark values** for Days 2, 4, and especially Day 7.
4. **Move MCP from Day 0 to Day 1 or Day 5** -- too advanced for onboarding.
5. **Fix sequencing: move XGBoost in Day 3 after ML intro in Day 4** (or restructure Day 3).
6. **Expand Day 7 to 4-5 exercises** with clear sub-problems and validation checkpoints.
7. **Decide what to do with Health (Day 3)** -- integrate into Life days or explicitly connect to Prophet AI.
8. **Split Day 8's three topics** -- stress testing on Day 8, RBAC on Day 9, agents earlier.
9. **Add more exercises to underweight days** (1, 6, 7, 8, 10).
10. **Add a Streamlit primer** before first dashboard challenge (Day 2).
