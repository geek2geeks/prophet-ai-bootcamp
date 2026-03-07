import streamlit as st

TRANSLATIONS = {
    # ── Sidebar & Global ──
    "sidebar_subtitle": {
        "pt": "AI & Data Science | Atuarios",
        "en": "AI & Data Science | Actuaries",
        "fr": "AI & Data Science | Actuaires",
    },
    "logout": {
        "pt": "Terminar Sessao",
        "en": "Log Out",
        "fr": "Deconnexion",
    },
    "demo_mode": {
        "pt": "Modo Demo (Auth Mocked)",
        "en": "Demo Mode (Auth Mocked)",
        "fr": "Mode Demo (Auth Mocked)",
    },
    "login_required": {
        "pt": "Faz login para aceder a esta pagina.",
        "en": "Please log in to access this page.",
        "fr": "Connectez-vous pour acceder a cette page.",
    },

    # ── Landing Page ──
    "hero_title_1": {
        "pt": "O Futuro da Atuaria",
        "en": "The Future of Actuarial Science",
        "fr": "Le Futur de l'Actuariat",
    },
    "hero_title_2": {
        "pt": "Comeca",
        "en": "Starts",
        "fr": "Commence",
    },
    "hero_title_3": {
        "pt": "Aqui.",
        "en": "Here.",
        "fr": "Ici.",
    },
    "hero_subtitle": {
        "pt": "10 dias intensivos para te transformares num <strong>AI Actuary</strong>. Constroi do zero um motor de Vida escalavel e lanca-o como SaaS.",
        "en": "10 intensive days to become an <strong>AI Actuary</strong>. Build a scalable Life engine from scratch and launch it as SaaS.",
        "fr": "10 jours intensifs pour devenir un <strong>AI Actuary</strong>. Construisez un moteur Vie scalable et lancez-le en SaaS.",
    },
    "hero_kicker": {
        "pt": "Bootcamp intensivo para atuarios que querem construir produtos AI",
        "en": "An intensive bootcamp for actuaries building AI products",
        "fr": "Un bootcamp intensif pour les actuaires qui construisent des produits AI",
    },
    "landing_metric_days": {
        "pt": "dias de imersao",
        "en": "days immersed",
        "fr": "jours d'immersion",
    },
    "landing_metric_cases": {
        "pt": "casos reais",
        "en": "real cases",
        "fr": "cas reels",
    },
    "landing_metric_launch": {
        "pt": "motor + SaaS MVP",
        "en": "engine + SaaS MVP",
        "fr": "moteur + SaaS MVP",
    },
    "landing_build_title": {
        "pt": "No final do percurso vais sair com",
        "en": "By the end of the journey you leave with",
        "fr": "A la fin du parcours vous repartez avec",
    },
    "landing_build_1": {
        "pt": "um motor atuarial de Vida com dados, regras e cashflows prontos a validar",
        "en": "a Life actuarial engine with data, rules, and cashflows ready to validate",
        "fr": "un moteur actuariel Vie avec donnees, regles et cashflows prets a valider",
    },
    "landing_build_2": {
        "pt": "assistentes AI para subscricao, fraude, auditoria tecnica e suporte interno",
        "en": "AI assistants for underwriting, fraud, technical audit, and internal support",
        "fr": "des assistants AI pour la souscription, la fraude, l'audit technique et le support interne",
    },
    "landing_build_3": {
        "pt": "um MVP demonstravel para portfolio, clientes piloto ou evolucao em equipa",
        "en": "a demonstrable MVP for your portfolio, pilot clients, or team handoff",
        "fr": "un MVP demonstrable pour votre portfolio, des clients pilotes ou une reprise en equipe",
    },
    "login_title": {
        "pt": "Entrar na Plataforma",
        "en": "Sign In",
        "fr": "Se Connecter",
    },
    "login_subtitle": {
        "pt": "Autentica-te para comecar",
        "en": "Authenticate to get started",
        "fr": "Authentifiez-vous pour commencer",
    },
    "landing_auth_badge": {
        "pt": "Candidaturas abertas",
        "en": "Applications open",
        "fr": "Candidatures ouvertes",
    },
    "landing_auth_note": {
        "pt": "Entra com Google ou email para continuares no mesmo ponto em qualquer dispositivo.",
        "en": "Use Google or email to continue from the same point on any device.",
        "fr": "Utilisez Google ou l'email pour reprendre au meme point sur n'importe quel appareil.",
    },
    "continue_google": {
        "pt": "Continuar com Google",
        "en": "Continue with Google",
        "fr": "Continuer avec Google",
    },
    "or_email": {
        "pt": "ou com email",
        "en": "or with email",
        "fr": "ou par email",
    },
    "tab_login": {
        "pt": "Entrar",
        "en": "Sign In",
        "fr": "Connexion",
    },
    "tab_register": {
        "pt": "Criar Conta",
        "en": "Sign Up",
        "fr": "Creer un Compte",
    },
    "email": {
        "pt": "Email",
        "en": "Email",
        "fr": "Email",
    },
    "password": {
        "pt": "Password",
        "en": "Password",
        "fr": "Mot de passe",
    },
    "full_name": {
        "pt": "Nome Completo",
        "en": "Full Name",
        "fr": "Nom Complet",
    },
    "btn_login": {
        "pt": "Entrar",
        "en": "Sign In",
        "fr": "Connexion",
    },
    "btn_register": {
        "pt": "Criar Conta",
        "en": "Sign Up",
        "fr": "Creer un Compte",
    },
    "what_you_learn": {
        "pt": "O que vais dominar",
        "en": "What you will master",
        "fr": "Ce que vous apprendrez",
    },
    "landing_curriculum_title": {
        "pt": "Curriculo desenhado para aprender fazendo",
        "en": "A curriculum built to learn by shipping",
        "fr": "Un programme concu pour apprendre en construisant",
    },
    "landing_curriculum_sub": {
        "pt": "Cada bloco combina teoria aplicada, dados de seguros e entregas prontas para portfolio.",
        "en": "Each block combines applied theory, insurance datasets, and deliverables ready for your portfolio.",
        "fr": "Chaque bloc combine theorie appliquee, jeux de donnees assurance et livrables prets pour votre portfolio.",
    },
    "feat_agents": {
        "pt": "Agentes LLM",
        "en": "LLM Agents",
        "fr": "Agents LLM",
    },
    "feat_agents_desc": {
        "pt": "CrewAI, RAG, auditoria automatica de sinistros",
        "en": "CrewAI, RAG, automated claims auditing",
        "fr": "CrewAI, RAG, audit automatique des sinistres",
    },
    "feat_ml": {
        "pt": "Python & ML",
        "en": "Python & ML",
        "fr": "Python & ML",
    },
    "feat_ml_desc": {
        "pt": "XGBoost, SHAP, mortalidade e lapse preditivos",
        "en": "XGBoost, SHAP, predictive mortality & lapse",
        "fr": "XGBoost, SHAP, mortalite et lapse predictifs",
    },
    "feat_engine": {
        "pt": "Motor V(t)",
        "en": "V(t) Engine",
        "fr": "Moteur V(t)",
    },
    "feat_engine_desc": {
        "pt": "Reservas, profit testing, cenarios Solvencia II",
        "en": "Reserves, profit testing, Solvency II scenarios",
        "fr": "Reserves, profit testing, scenarios Solvabilite II",
    },
    "feat_deploy": {
        "pt": "SaaS Deploy",
        "en": "SaaS Deploy",
        "fr": "SaaS Deploy",
    },
    "feat_deploy_desc": {
        "pt": "Streamlit Cloud, Supabase Auth, RBAC",
        "en": "Streamlit Cloud, Supabase Auth, RBAC",
        "fr": "Streamlit Cloud, Supabase Auth, RBAC",
    },

    # ── Dashboard (Home) ──
    "hello": {
        "pt": "Ola, {name}!",
        "en": "Hello, {name}!",
        "fr": "Bonjour, {name}!",
    },
    "progress_msg": {
        "pt": "O teu Progresso Atuarial. Ja completaste <strong>{done}</strong> de <strong>{total}</strong> tarefas cruciais no bootcamp.",
        "en": "Your Actuarial Progress. You've completed <strong>{done}</strong> of <strong>{total}</strong> critical bootcamp tasks.",
        "fr": "Votre Progres Actuariel. Vous avez complete <strong>{done}</strong> sur <strong>{total}</strong> taches cruciales.",
    },
    "completion_rate": {
        "pt": "Taxa de Conclusao",
        "en": "Completion Rate",
        "fr": "Taux d'Achevement",
    },
    "xp_points": {
        "pt": "XP / Pontos Ganhos",
        "en": "XP / Points Earned",
        "fr": "XP / Points Gagnes",
    },
    "tasks_submitted": {
        "pt": "Tarefas Submetidas",
        "en": "Tasks Submitted",
        "fr": "Taches Soumises",
    },
    "current_rank": {
        "pt": "Rank Atual",
        "en": "Current Rank",
        "fr": "Rang Actuel",
    },
    "featured_modules": {
        "pt": "Modulos em Destaque",
        "en": "Featured Modules",
        "fr": "Modules en Vedette",
    },
    "pre_bootcamp": {
        "pt": "Pre-Bootcamp",
        "en": "Pre-Bootcamp",
        "fr": "Pre-Bootcamp",
    },
    "week_1": {
        "pt": "Semana 1",
        "en": "Week 1",
        "fr": "Semaine 1",
    },
    "week_2": {
        "pt": "Semana 2",
        "en": "Week 2",
        "fr": "Semaine 2",
    },
    "pre_bootcamp_desc": {
        "pt": "Fundamentos de LLMs e automacao e MCPs.",
        "en": "LLM fundamentals, automation and MCPs.",
        "fr": "Fondamentaux LLM, automatisation et MCPs.",
    },
    "week1_desc": {
        "pt": "Engenharia Atuarial com modelos de Machine Learning locais.",
        "en": "Actuarial Engineering with local Machine Learning models.",
        "fr": "Ingenierie Actuarielle avec modeles ML locaux.",
    },
    "week2_desc": {
        "pt": "Arquitetura e distribuicao do teu Cloud App comercial MVP.",
        "en": "Architecture and deployment of your commercial Cloud App MVP.",
        "fr": "Architecture et deploiement de votre MVP Cloud App commercial.",
    },
    "progress": {
        "pt": "Progresso",
        "en": "Progress",
        "fr": "Progres",
    },

    # ── Dashboard Page ──
    "dashboard": {
        "pt": "Dashboard",
        "en": "Dashboard",
        "fr": "Tableau de Bord",
    },
    "dashboard_sub": {
        "pt": "A tua visao geral de progresso no bootcamp",
        "en": "Your bootcamp progress overview",
        "fr": "Votre apercu de progression du bootcamp",
    },
    "dashboard_kicker": {
        "pt": "Ritmo semanal e progresso do cohort",
        "en": "Weekly cadence and cohort progress",
        "fr": "Rythme hebdomadaire et progression du cohort",
    },
    "dashboard_focus": {
        "pt": "O teu painel para acompanhar progresso, niveis e proximas entregas.",
        "en": "Your control panel for tracking progress, levels, and upcoming deliverables.",
        "fr": "Votre panneau de controle pour suivre progression, niveaux et prochains livrables.",
    },
    "dashboard_challenges_done": {
        "pt": "desafios submetidos",
        "en": "challenges submitted",
        "fr": "defis soumis",
    },
    "dashboard_points_to_next": {
        "pt": "pontos para o proximo nivel",
        "en": "points to next level",
        "fr": "points jusqu'au niveau suivant",
    },
    "dashboard_top_level": {
        "pt": "topo da progressao",
        "en": "top progression tier",
        "fr": "palier maximum",
    },
    "total_points": {
        "pt": "Pontos Total",
        "en": "Total Points",
        "fr": "Points Totaux",
    },
    "completed": {
        "pt": "Completos",
        "en": "Completed",
        "fr": "Termines",
    },
    "badge": {
        "pt": "Badge",
        "en": "Badge",
        "fr": "Badge",
    },
    "complete": {
        "pt": "completo",
        "en": "complete",
        "fr": "termine",
    },
    "progress_by_day": {
        "pt": "Progresso por Dia",
        "en": "Progress by Day",
        "fr": "Progres par Jour",
    },
    "levels": {
        "pt": "Niveis",
        "en": "Levels",
        "fr": "Niveaux",
    },
    "points_detail": {
        "pt": "Detalhe de Pontos",
        "en": "Points Breakdown",
        "fr": "Detail des Points",
    },
    "day": {
        "pt": "Dia",
        "en": "Day",
        "fr": "Jour",
    },
    "chart_complete": {
        "pt": "Completo",
        "en": "Complete",
        "fr": "Termine",
    },
    "chart_total": {
        "pt": "Total",
        "en": "Total",
        "fr": "Total",
    },
    "challenge": {
        "pt": "DESAFIO",
        "en": "CHALLENGE",
        "fr": "DEFI",
    },
    "points": {
        "pt": "pontos",
        "en": "points",
        "fr": "points",
    },

    # ── Programa Page ──
    "programa_title": {
        "pt": "Programa do Bootcamp",
        "en": "Bootcamp Programme",
        "fr": "Programme du Bootcamp",
    },
    "programa_sub": {
        "pt": "Pre-bootcamp + 10 dias de imersao intensiva em AI & Data Science",
        "en": "Pre-bootcamp + 10 days of intensive AI & Data Science immersion",
        "fr": "Pre-bootcamp + 10 jours d'immersion intensive en AI & Data Science",
    },
    "pre_bootcamp_tab": {
        "pt": "Pre-Bootcamp (Dia 0)",
        "en": "Pre-Bootcamp (Day 0)",
        "fr": "Pre-Bootcamp (Jour 0)",
    },
    "week1_tab": {
        "pt": "Semana 1 (Dias 1-5)",
        "en": "Week 1 (Days 1-5)",
        "fr": "Semaine 1 (Jours 1-5)",
    },
    "week2_tab": {
        "pt": "Semana 2 (Dias 6-10)",
        "en": "Week 2 (Days 6-10)",
        "fr": "Semaine 2 (Jours 6-10)",
    },
    "day_lessons": {
        "pt": "Aulas do Dia",
        "en": "Day Lessons",
        "fr": "Cours du Jour",
    },
    "practical_work": {
        "pt": "Trabalho Pratico",
        "en": "Practical Work",
        "fr": "Travail Pratique",
    },
    "module": {
        "pt": "Modulo",
        "en": "Module",
        "fr": "Module",
    },
    "challenge_label": {
        "pt": "Desafio",
        "en": "Challenge",
        "fr": "Defi",
    },
    "grading_title": {
        "pt": "Criterios de Avaliacao",
        "en": "Grading Criteria",
        "fr": "Criteres d'Evaluation",
    },
    "programa_snapshot": {
        "pt": "Visao rapida do modulo",
        "en": "Quick module snapshot",
        "fr": "Vue rapide du module",
    },

    # ── Exercicios Page ──
    "exercicios_title": {
        "pt": "Exercicios & Desafios",
        "en": "Exercises & Challenges",
        "fr": "Exercices & Defis",
    },
    "exercicios_sub": {
        "pt": "Marca os exercicios como completos e submete os teus desafios diarios para avaliacao.",
        "en": "Mark exercises as complete and submit your daily challenges for evaluation.",
        "fr": "Marquez les exercices comme termines et soumettez vos defis quotidiens.",
    },
    "select_day": {
        "pt": "Selecione o Dia de Trabalho",
        "en": "Select Working Day",
        "fr": "Selectionnez le Jour",
    },
    "tasks_done": {
        "pt": "Completos",
        "en": "Completed",
        "fr": "Termines",
    },
    "exercise_checklist": {
        "pt": "Checklist de Exercicios",
        "en": "Exercise Checklist",
        "fr": "Liste des Exercices",
    },
    "mark_complete": {
        "pt": "Marcar como concluido",
        "en": "Mark as complete",
        "fr": "Marquer comme termine",
    },
    "day_challenge": {
        "pt": "Desafio do Dia",
        "en": "Day Challenge",
        "fr": "Defi du Jour",
    },
    "submit_project": {
        "pt": "Entregar Projeto",
        "en": "Submit Project",
        "fr": "Soumettre le Projet",
    },
    "exercise_sprint": {
        "pt": "Sprint do dia",
        "en": "Today's sprint",
        "fr": "Sprint du jour",
    },
    "exercise_repo_hint": {
        "pt": "Entrega um unico link GitHub com codigo, notas e evidencia do resultado final.",
        "en": "Submit one GitHub link with code, notes, and evidence of the final result.",
        "fr": "Soumettez un seul lien GitHub avec code, notes et preuve du resultat final.",
    },
    "repo_placeholder": {
        "pt": "https://github.com/teu-user/prophet-ai-solucao",
        "en": "https://github.com/your-user/prophet-ai-solution",
        "fr": "https://github.com/votre-user/prophet-ai-solution",
    },
    "submit_btn": {
        "pt": "Enviar Submissao",
        "en": "Submit",
        "fr": "Soumettre",
    },
    "submitted_success": {
        "pt": "Desafio submetido com sucesso!",
        "en": "Challenge submitted successfully!",
        "fr": "Defi soumis avec succes!",
    },
    "admin_panel": {
        "pt": "Painel de Avaliacao (Admin)",
        "en": "Grading Panel (Admin)",
        "fr": "Panneau d'Evaluation (Admin)",
    },
    "project_submitted": {
        "pt": "Projeto Entregue e Avaliado",
        "en": "Project Submitted and Graded",
        "fr": "Projet Soumis et Evalue",
    },

    # ── Recursos Page ──
    "recursos_title": {
        "pt": "Recursos & Datasets",
        "en": "Resources & Datasets",
        "fr": "Ressources & Datasets",
    },
    "recursos_sub": {
        "pt": "Todos os ficheiros necessarios para o bootcamp",
        "en": "All files needed for the bootcamp",
        "fr": "Tous les fichiers necessaires pour le bootcamp",
    },
    "resources_kicker": {
        "pt": "Biblioteca operacional do bootcamp",
        "en": "Bootcamp operating library",
        "fr": "Bibliotheque operationnelle du bootcamp",
    },
    "resource_count": {
        "pt": "{count} ficheiros",
        "en": "{count} files",
        "fr": "{count} fichiers",
    },
    "vida_s1": {
        "pt": "Vertical VIDA — Semana 1",
        "en": "LIFE Vertical — Week 1",
        "fr": "Vertical VIE — Semaine 1",
    },
    "vida_s2": {
        "pt": "Vertical VIDA — Semana 2",
        "en": "LIFE Vertical — Week 2",
        "fr": "Vertical VIE — Semaine 2",
    },
    "saude_dia3": {
        "pt": "Vertical SAUDE (Dia 3)",
        "en": "HEALTH Vertical (Day 3)",
        "fr": "Vertical SANTE (Jour 3)",
    },
    "templates": {
        "pt": "Templates & Utilidades",
        "en": "Templates & Utilities",
        "fr": "Templates & Utilitaires",
    },
    "tech_stack": {
        "pt": "Stack Tecnologico",
        "en": "Tech Stack",
        "fr": "Stack Technologique",
    },
    "vida_s1_badge": {"pt": "S1", "en": "W1", "fr": "S1"},
    "vida_s2_badge": {"pt": "S2", "en": "W2", "fr": "S2"},

    # ── Programa Page (extra) ──
    "select_module": {
        "pt": "Selecione o Modulo",
        "en": "Select Module",
        "fr": "Selectionnez le Module",
    },
    "pre_bootcamp_intro_title": {
        "pt": "Pre-Bootcamp: Setup & Fundamentos",
        "en": "Pre-Bootcamp: Setup & Fundamentals",
        "fr": "Pre-Bootcamp: Setup & Fondamentaux",
    },
    "pre_bootcamp_intro_desc": {
        "pt": "Preparacao antes do arranque oficial. Configurar ferramentas essenciais (OpenCode, Claude Code) e aprender conceitos vitais de LLMs: tokens, parametros de contexto e Model Context Protocol (MCP).",
        "en": "Preparation before the official launch. Set up essential tools (OpenCode, Claude Code) and learn vital LLM concepts: tokens, context parameters and Model Context Protocol (MCP).",
        "fr": "Preparation avant le lancement officiel. Configurer les outils essentiels (OpenCode, Claude Code) et apprendre les concepts vitaux des LLM : tokens, parametres de contexte et Model Context Protocol (MCP).",
    },
    "week1_intro_title": {
        "pt": "Semana 1: AI Engineering & Competencias Core",
        "en": "Week 1: AI Engineering & Core Skills",
        "fr": "Semaine 1 : AI Engineering & Competences Core",
    },
    "week1_intro_desc": {
        "pt": "Dominar a arte de construir com IA. Especificar solucoes, data wrangling massivo, pipelines de saude (OCR, pricing) e agentes autonomos auditores com LLM.",
        "en": "Master the art of building with AI. Specify solutions, massive data wrangling, health pipelines (OCR, pricing) and autonomous LLM auditing agents.",
        "fr": "Maitriser l'art de construire avec l'IA. Specifier des solutions, data wrangling massif, pipelines sante (OCR, pricing) et agents autonomes auditeurs LLM.",
    },
    "week2_intro_title": {
        "pt": "Semana 2: Arquitetar & Lancar Produto",
        "en": "Week 2: Architect & Launch Product",
        "fr": "Semaine 2 : Architecturer & Lancer le Produit",
    },
    "week2_intro_desc": {
        "pt": "Construir do zero um motor atuarial Vida cloud-native com agentes embutidos. Implementar RBAC e lancar como um SaaS pronto a monetizar.",
        "en": "Build from scratch a cloud-native Life actuarial engine with embedded agents. Implement RBAC and launch as a monetization-ready SaaS.",
        "fr": "Construire de zero un moteur actuariel Vie cloud-native avec agents embarques. Implementer RBAC et lancer en SaaS pret a monetiser.",
    },

    # ── Grading table ──
    "grading_component": {
        "pt": "Componente", "en": "Component", "fr": "Composante",
    },
    "grading_points": {
        "pt": "Pontos", "en": "Points", "fr": "Points",
    },
    "grading_weight": {
        "pt": "Peso na Nota", "en": "Grade Weight", "fr": "Poids dans la Note",
    },
    "grading_prebootcamp": {
        "pt": "Pre-Bootcamp (Dia 0)", "en": "Pre-Bootcamp (Day 0)", "fr": "Pre-Bootcamp (Jour 0)",
    },
    "grading_bonus": {
        "pt": "Bonus Extra", "en": "Extra Bonus", "fr": "Bonus Extra",
    },
    "grading_exercises": {
        "pt": "Exercicios Diarios (Dias 1-9)", "en": "Daily Exercises (Days 1-9)", "fr": "Exercices Quotidiens (Jours 1-9)",
    },
    "grading_challenges": {
        "pt": "Desafios Diarios (melhor 8 de 9)", "en": "Daily Challenges (best 8 of 9)", "fr": "Defis Quotidiens (meilleurs 8 sur 9)",
    },
    "grading_homework": {
        "pt": "Tarefas para Casa", "en": "Homework", "fr": "Devoirs",
    },
    "grading_participation": {
        "pt": "Participacao & Forum", "en": "Participation & Forum", "fr": "Participation & Forum",
    },
    "grading_final": {
        "pt": "Projeto Final (MVP Prophet AI)", "en": "Final Project (MVP Prophet AI)", "fr": "Projet Final (MVP Prophet AI)",
    },
    "grading_decisive": {
        "pt": "Decisivo", "en": "Decisive", "fr": "Decisif",
    },

    # ── Exercicios Page (extra) ──
    "submit_description": {
        "pt": "Cola o hiperlink do teu repositorio GitHub com a solucao deste desafio.",
        "en": "Paste the hyperlink to your GitHub repository with the solution for this challenge.",
        "fr": "Collez le lien de votre depot GitHub avec la solution de ce defi.",
    },
    "repo_label": {
        "pt": "URL do repositorio GitHub",
        "en": "GitHub repository URL",
        "fr": "URL du depot GitHub",
    },
    "assign_score": {
        "pt": "Atribuir Pontuacao",
        "en": "Assign Score",
        "fr": "Attribuer un Score",
    },
    "graded_msg": {
        "pt": "Foram atribuidos {pts} de {max} pontos possiveis.",
        "en": "{pts} of {max} possible points were awarded.",
        "fr": "{pts} sur {max} points possibles ont ete attribues.",
    },

    # ── AI Tutor Page ──
    "tutor_title": {
        "pt": "AI Tutor",
        "en": "AI Tutor",
        "fr": "AI Tuteur",
    },
    "tutor_sub": {
        "pt": "O teu assistente pessoal para duvidas do bootcamp — powered by DeepSeek",
        "en": "Your personal assistant for bootcamp questions — powered by DeepSeek",
        "fr": "Votre assistant personnel pour le bootcamp — powered by DeepSeek",
    },
    "tutor_ready": {
        "pt": "Pronto para explicar conceitos, desbloquear exercicios e rever abordagens.",
        "en": "Ready to explain concepts, unblock exercises, and review approaches.",
        "fr": "Pret a expliquer les concepts, debloquer les exercices et revoir les approches.",
    },
    "tutor_prompt_title": {
        "pt": "Prompts sugeridos para arrancar",
        "en": "Suggested prompts to get started",
        "fr": "Prompts suggeres pour commencer",
    },
    "tutor_capability_1": {
        "pt": "Reservas, cashflows e logica atuarial explicados passo a passo.",
        "en": "Reserves, cashflows, and actuarial logic explained step by step.",
        "fr": "Reserves, cashflows et logique actuarielle expliques pas a pas.",
    },
    "tutor_capability_2": {
        "pt": "Ajuda a destravar Python, ML, Streamlit e debugging do bootcamp.",
        "en": "Help unblocking Python, ML, Streamlit, and bootcamp debugging.",
        "fr": "Aide pour debloquer Python, ML, Streamlit et le debugging du bootcamp.",
    },
    "tutor_capability_3": {
        "pt": "Contexto sobre MCPs, RAG, agentes e arquitetura do produto final.",
        "en": "Context on MCPs, RAG, agents, and the final product architecture.",
        "fr": "Contexte sur les MCPs, le RAG, les agents et l'architecture du produit final.",
    },
    "tutor_capability_4": {
        "pt": "Sugestoes de proximos passos, testes e melhoria da tua entrega.",
        "en": "Suggestions for next steps, tests, and improving your submission.",
        "fr": "Suggestions de prochaines etapes, tests et amelioration de votre livraison.",
    },
    "tutor_welcome": {
        "pt": "Ola! Sou o teu AI Tutor",
        "en": "Hi! I'm your AI Tutor",
        "fr": "Bonjour! Je suis votre AI Tuteur",
    },
    "tutor_welcome_sub": {
        "pt": "Posso ajudar-te com conceitos atuariais, exercicios do bootcamp,<br>Python, ML, MCPs, ou qualquer duvida do curso.",
        "en": "I can help you with actuarial concepts, bootcamp exercises,<br>Python, ML, MCPs, or any course question.",
        "fr": "Je peux vous aider avec les concepts actuariels, les exercices du bootcamp,<br>Python, ML, MCPs, ou toute question du cours.",
    },
    "chat_placeholder": {
        "pt": "Escreve a tua pergunta...",
        "en": "Type your question...",
        "fr": "Ecrivez votre question...",
    },
    "thinking": {
        "pt": "A pensar...",
        "en": "Thinking...",
        "fr": "En reflexion...",
    },
    "clear_chat": {
        "pt": "Limpar conversa",
        "en": "Clear chat",
        "fr": "Effacer la conversation",
    },
    "tutor_ask_hint": {
        "pt": "Pergunta-me qualquer coisa!",
        "en": "Ask me anything!",
        "fr": "Posez-moi une question!",
    },
    "tutor_sug_1": {
        "pt": "O que e a clausula de incontestabilidade e como afeta os sinistros?",
        "en": "What is the incontestability clause and how does it affect claims?",
        "fr": "Qu'est-ce que la clause d'incontestabilite et comment affecte-t-elle les sinistres?",
    },
    "tutor_sug_2": {
        "pt": "Como calculo a reserva V(t) para um seguro temporario?",
        "en": "How do I calculate the V(t) reserve for a term life policy?",
        "fr": "Comment calculer la reserve V(t) pour une assurance temporaire?",
    },
    "tutor_sug_3": {
        "pt": "Quais sao os choques de Solvencia II para o modulo Vida?",
        "en": "What are the Solvency II shocks for the Life module?",
        "fr": "Quels sont les chocs de Solvabilite II pour le module Vie?",
    },
    "tutor_sug_4": {
        "pt": "O que sao MCPs e como os configuro no OpenCode?",
        "en": "What are MCPs and how do I configure them in OpenCode?",
        "fr": "Que sont les MCPs et comment les configurer dans OpenCode?",
    },
    "tutor_sug_5": {
        "pt": "Diferenca entre Net Premium Reserve e Gross Premium Reserve?",
        "en": "Difference between Net Premium Reserve and Gross Premium Reserve?",
        "fr": "Difference entre la reserve de prime nette et la reserve de prime brute?",
    },
    "tutor_sug_6": {
        "pt": "Como deteto anomalias no sinistralidade_vida.csv?",
        "en": "How do I detect anomalies in sinistralidade_vida.csv?",
        "fr": "Comment detecter les anomalies dans sinistralidade_vida.csv?",
    },

    # ── Settings labels ──
    "language": {
        "pt": "Idioma",
        "en": "Language",
        "fr": "Langue",
    },
    "dark_mode": {
        "pt": "Modo Escuro",
        "en": "Dark Mode",
        "fr": "Mode Sombre",
    },
}

LANGUAGES = {"pt": "Portugues", "en": "English", "fr": "Francais"}


def init_i18n():
    if "lang" not in st.session_state:
        st.session_state.lang = "pt"
    if "dark_mode" not in st.session_state:
        st.session_state.dark_mode = False
    try:
        query_lang = st.query_params.get("lang")
        if isinstance(query_lang, list):
            query_lang = query_lang[0] if query_lang else None
        if query_lang in LANGUAGES:
            st.session_state.lang = query_lang
    except Exception:
        pass


def get_lang() -> str:
    return st.session_state.get("lang", "pt")


def t(key: str, **kwargs) -> str:
    lang = get_lang()
    entry = TRANSLATIONS.get(key, {})
    text = entry.get(lang, entry.get("pt", key))
    if kwargs:
        text = text.format(**kwargs)
    return text
