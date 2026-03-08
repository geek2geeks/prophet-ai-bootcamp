import streamlit as st

TRANSLATIONS = {
    # ── Sidebar & Global ──
    "sidebar_subtitle": {
        "pt": "AI-Native Product Builders | Atuarios",
        "en": "AI-Native Product Builders | Actuaries",
        "fr": "Builders Produit AI-Native | Actuaires",
    },
    "logout": {
        "pt": "Terminar Sessao",
        "en": "Log Out",
        "fr": "Deconnexion",
    },
    "demo_mode": {
        "pt": "Modo Demo",
        "en": "Demo Mode",
        "fr": "Mode Demo",
    },
    "login_required": {
        "pt": "Faz login para aceder a esta pagina.",
        "en": "Please log in to access this page.",
        "fr": "Connectez-vous pour acceder a cette page.",
    },
    "app_page_title": {
        "pt": "AI Founder Bootcamp",
        "en": "AI Founder Bootcamp",
        "fr": "AI Founder Bootcamp",
    },
    "ui_review_mode_title": {
        "pt": "Modo de revisao da interface",
        "en": "UI review mode",
        "fr": "Mode revision UI",
    },
    "ui_review_mode_body": {
        "pt": "A autenticacao foi temporariamente ignorada para validar o layout localmente.",
        "en": "Authentication is temporarily bypassed for local layout verification.",
        "fr": "L'authentification est temporairement ignoree pour verifier le layout en local.",
    },
    "sidebar_brand_title": {
        "pt": "AI Founder Bootcamp",
        "en": "AI Founder Bootcamp",
        "fr": "AI Founder Bootcamp",
    },
    "sidebar_footer_title": {
        "pt": "Prophet Lite Lab",
        "en": "Prophet Lite Lab",
        "fr": "Prophet Lite Lab",
    },
    "auth_email_placeholder": {
        "pt": "atuario@exemplo.com",
        "en": "actuary@example.com",
        "fr": "actuaire@exemple.com",
    },
    "landing_founder_kicker": {
        "pt": "Percurso do founder",
        "en": "Founder Flow",
        "fr": "Parcours Fondateur",
    },
    "landing_quote_kicker": {
        "pt": "AI x Industria",
        "en": "AI x Industry",
        "fr": "AI x Industrie",
    },

    # ── Landing Page ──
    "hero_title_1": {
        "pt": "De Atuario a",
        "en": "The Future of Actuarial Science",
        "fr": "Le Futur de l'Actuariat",
    },
    "hero_title_2": {
        "pt": "Founder",
        "en": "Starts",
        "fr": "Commence",
    },
    "hero_title_3": {
        "pt": "AI-Native",
        "en": "Here.",
        "fr": "Ici.",
    },
    "hero_subtitle": {
        "pt": "10 dias intensivos para te transformares num <strong>AI founder</strong>. Aprende a usar coding LLMs para criar um Prophet Lite com copiloto AI, primeiro localmente e depois online.",
        "en": "10 intensive days to become an <strong>AI founder</strong>. Learn to use coding LLMs to create a Prophet Lite with an AI copilot, first locally and then online.",
        "fr": "10 jours intensifs pour devenir un <strong>fondateur AI</strong>. Apprenez a utiliser des LLMs de code pour creer un Prophet Lite avec copilote AI, d'abord en local puis en ligne.",
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
        "pt": "um Prophet Lite focado: assumptions, model points, runs deterministicos e resultados explicaveis",
        "en": "a focused Prophet Lite: assumptions, model points, deterministic runs, and explainable results",
        "fr": "un Prophet Lite cible : hypotheses, model points, runs deterministes et resultats explicables",
    },
    "landing_build_2": {
        "pt": "um copiloto AI que explica outputs, ajuda a validar runs e transforma documentos em memoria pesquisavel",
        "en": "an AI copilot that explains outputs, helps validate runs, and turns documents into searchable memory",
        "fr": "un copilote AI qui explique les resultats, aide a valider les runs et transforme les documents en memoire consultable",
    },
    "landing_build_3": {
        "pt": "um MVP deployado, uma narrativa de mercado clara e um lancamento publico pronto para LinkedIn e clientes piloto",
        "en": "a deployed MVP, a clear market narrative, and a public launch ready for LinkedIn and pilot clients",
        "fr": "un MVP deploye, une narration marche claire et un lancement public pret pour LinkedIn et des clients pilotes",
    },
    "login_title": {
        "pt": "Entrar e construir",
        "en": "Sign In",
        "fr": "Se Connecter",
    },
    "login_subtitle": {
        "pt": "Autentica-te para continuar o bootcamp",
        "en": "Authenticate to get started",
        "fr": "Authentifiez-vous pour commencer",
    },
    "landing_auth_badge": {
        "pt": "Entrar e comecar",
        "en": "Applications open",
        "fr": "Candidatures ouvertes",
    },
    "landing_auth_note": {
        "pt": "Entra para guardares progresso, iteracoes de produto e o teu launch pack em qualquer dispositivo.",
        "en": "Sign in to save progress, product iterations, and your launch pack on any device.",
        "fr": "Connectez-vous pour sauvegarder votre progression, vos iterations produit et votre launch pack sur n'importe quel appareil.",
    },
    "auth_benefit_1": {
        "pt": "Specs e prompts guardados",
        "en": "Saved specs and prompts",
        "fr": "Specs et prompts sauvegardes",
    },
    "auth_benefit_2": {
        "pt": "MVP local -> deploy",
        "en": "Local MVP -> deploy",
        "fr": "MVP local -> deployement",
    },
    "auth_benefit_3": {
        "pt": "Launch pack para LinkedIn",
        "en": "LinkedIn launch pack",
        "fr": "Launch pack LinkedIn",
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
        "pt": "Cada bloco traduz conhecimento atuarial em alavanca de produto: specs, dados, copiloto AI, MVP local, deploy e distribuicao publica.",
        "en": "Each block turns actuarial knowledge into product leverage: specs, data, AI copilot, local MVP, deployment, and public distribution.",
        "fr": "Chaque bloc transforme le savoir actuariel en levier produit : specs, donnees, copilote AI, MVP local, deployement et distribution publique.",
    },
    "landing_founder_title": {
        "pt": "O percurso em 3 movimentos",
        "en": "The journey in 3 moves",
        "fr": "Le parcours en 3 mouvements",
    },
    "landing_founder_1_title": {
        "pt": "Aprender a operar",
        "en": "Learn to operate",
        "fr": "Apprendre a operer",
    },
    "landing_founder_1_desc": {
        "pt": "OpenCode, MCPs, APIs, docs e modelos para trabalhares com LLMs como motor de execucao.",
        "en": "OpenCode, MCPs, APIs, docs, and models to work with LLMs as an execution engine.",
        "fr": "OpenCode, MCPs, APIs, docs et modeles pour travailler avec les LLMs comme moteur d'execution.",
    },
    "landing_founder_2_title": {
        "pt": "Definir um produto pequeno",
        "en": "Define a small product",
        "fr": "Definir un petit produit",
    },
    "landing_founder_2_desc": {
        "pt": "Escolher uma wedge Prophet Lite, escrever specs fortes e desenhar a experiencia mobile-first.",
        "en": "Choose a Prophet Lite wedge, write strong specs, and design the mobile-first experience.",
        "fr": "Choisir une wedge Prophet Lite, ecrire de bonnes specs et concevoir une experience mobile-first.",
    },
    "landing_founder_3_title": {
        "pt": "Lancar em publico",
        "en": "Launch in public",
        "fr": "Lancer en public",
    },
    "landing_founder_3_desc": {
        "pt": "Construir localmente, fazer deploy, apresentar a demo e transformar o projeto num ativo de mercado.",
        "en": "Build locally, deploy, present the demo, and turn the project into a market-facing asset.",
        "fr": "Construire en local, deployer, presenter la demo et transformer le projet en actif visible sur le marche.",
    },
    "landing_quote_title": {
        "pt": "Construir a nova industria",
        "en": "Building the new industry",
        "fr": "Construire la nouvelle industrie",
    },
    "landing_quote_1": {
        "pt": "\"The development of AI is as fundamental as the creation of the microprocessor, the personal computer, the Internet, and the mobile phone.\" — Bill Gates",
        "en": "\"The development of AI is as fundamental as the creation of the microprocessor, the personal computer, the Internet, and the mobile phone.\" — Bill Gates",
        "fr": "\"The development of AI is as fundamental as the creation of the microprocessor, the personal computer, the Internet, and the mobile phone.\" — Bill Gates",
    },
    "landing_quote_2": {
        "pt": "\"Software is eating the world.\" — Marc Andreessen",
        "en": "\"Software is eating the world.\" — Marc Andreessen",
        "fr": "\"Software is eating the world.\" — Marc Andreessen",
    },
    "landing_quote_3": {
        "pt": "\"Plans should be measured in decades, execution should be measured in weeks.\" — Sam Altman",
        "en": "\"Plans should be measured in decades, execution should be measured in weeks.\" — Sam Altman",
        "fr": "\"Plans should be measured in decades, execution should be measured in weeks.\" — Sam Altman",
    },
    "feat_agents": {
        "pt": "AI Builder Stack",
        "en": "AI Builder Stack",
        "fr": "Stack AI Builder",
    },
    "feat_agents_desc": {
        "pt": "OpenCode, GLM-5, DeepSeek, MCPs e prompts reutilizaveis para construir com velocidade",
        "en": "OpenCode, GLM-5, DeepSeek, MCPs, and reusable prompts to build with speed",
        "fr": "OpenCode, GLM-5, DeepSeek, MCPs et prompts reutilisables pour construire rapidement",
    },
    "feat_ml": {
        "pt": "Specs & APIs",
        "en": "Specs & APIs",
        "fr": "Specs & APIs",
    },
    "feat_ml_desc": {
        "pt": "Speckit, JSON, documentacao, API calls e contratos de dados para dar instrucoes claras aos LLMs",
        "en": "Speckit, JSON, documentation, API calls, and data contracts to give clear instructions to LLMs",
        "fr": "Speckit, JSON, documentation, appels API et contrats de donnees pour guider clairement les LLMs",
    },
    "feat_engine": {
        "pt": "Prophet Lite",
        "en": "Prophet Lite",
        "fr": "Prophet Lite",
    },
    "feat_engine_desc": {
        "pt": "Assumptions, model points, runs deterministicos, document drop e copiloto AI num MVP credivel",
        "en": "Assumptions, model points, deterministic runs, document drop, and an AI copilot in a credible MVP",
        "fr": "Hypotheses, model points, runs deterministes, depot de documents et copilote AI dans un MVP credible",
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
        "pt": "Ja completaste <strong>{done}</strong> de <strong>{total}</strong> etapas de execucao do bootcamp.",
        "en": "You have completed <strong>{done}</strong> of <strong>{total}</strong> execution steps in the bootcamp.",
        "fr": "Vous avez complete <strong>{done}</strong> sur <strong>{total}</strong> etapes d'execution du bootcamp.",
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
        "pt": "Terminal sem medo, API key, OpenCode configurado, dados reais analisados e regras de operacao segura.",
        "en": "Fearless terminal use, API key, OpenCode configured, real data analyzed, and safe operating rules.",
        "fr": "Terminal sans peur, cle API, OpenCode configure, donnees reelles analysees et regles d'operation securisee.",
    },
    "bootcamp_keys_title": {
        "pt": "Chaves do Bootcamp",
        "en": "Bootcamp Keys",
        "fr": "Cles du Bootcamp",
    },
    "bootcamp_keys_desc": {
        "pt": "Estas sao as chaves partilhadas do bootcamp. Usa-as para configurar o DeepSeek e o OpenCode. As chaves so sao visiveis para alunos autenticados.",
        "en": "These are the shared bootcamp keys. Use them to configure DeepSeek and OpenCode. Keys are only visible to authenticated students.",
        "fr": "Voici les cles partagees du bootcamp. Utilisez-les pour configurer DeepSeek et OpenCode. Les cles ne sont visibles que pour les etudiants authentifies.",
    },
    "bootcamp_keys_deepseek_hint": {
        "pt": "Cola este comando no terminal para configurar a key do DeepSeek antes de abrir o OpenCode.",
        "en": "Paste this command in your terminal to configure the DeepSeek key before opening OpenCode.",
        "fr": "Collez cette commande dans votre terminal pour configurer la cle DeepSeek avant d'ouvrir OpenCode.",
    },
    "bootcamp_keys_opencode_hint": {
        "pt": "Key para o plano OpenCode do bootcamp. Configura-se nas definicoes do OpenCode.",
        "en": "Key for the bootcamp OpenCode plan. Configure it in OpenCode settings.",
        "fr": "Cle pour le plan OpenCode du bootcamp. Configurez-la dans les parametres OpenCode.",
    },
    "bootcamp_keys_config_cmd": {
        "pt": "Comando para configurar:",
        "en": "Configuration command:",
        "fr": "Commande de configuration :",
    },
    "bootcamp_keys_not_configured": {
        "pt": "Chaves do bootcamp nao configuradas. Contacta o instrutor.",
        "en": "Bootcamp keys not configured. Contact the instructor.",
        "fr": "Cles du bootcamp non configurees. Contactez l'instructeur.",
    },
    "bootcamp_keys_opencode_usage": {
        "pt": "Usa esta key nas definicoes do OpenCode ou como variavel de ambiente OPENCODE_API_KEY.",
        "en": "Use this key in OpenCode settings or as the OPENCODE_API_KEY environment variable.",
        "fr": "Utilisez cette cle dans les parametres OpenCode ou comme variable d'environnement OPENCODE_API_KEY.",
    },
    "week1_desc": {
        "pt": "Escolha da wedge, specs, APIs, dados, Prophet Lite e memoria documental.",
        "en": "Wedge selection, specs, APIs, data, Prophet Lite, and document memory.",
        "fr": "Choix de la wedge, specs, APIs, donnees, Prophet Lite et memoire documentaire.",
    },
    "week2_desc": {
        "pt": "UX mobile-first, build local, copiloto AI, deploy e lancamento no LinkedIn.",
        "en": "Mobile-first UX, local build, AI copilot, deployment, and LinkedIn launch.",
        "fr": "UX mobile-first, build local, copilote AI, deployement et lancement sur LinkedIn.",
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
        "pt": "O teu painel de progresso como AI founder em construcao",
        "en": "Your progress dashboard as an AI founder in the making",
        "fr": "Votre tableau de progression en tant que fondateur AI en construction",
    },
    "dashboard_kicker": {
        "pt": "Ritmo semanal e progresso do founder",
        "en": "Weekly cadence and founder progress",
        "fr": "Rythme hebdomadaire et progression du fondateur",
    },
    "dashboard_focus": {
        "pt": "Acompanha o caminho do setup ao deploy: ferramentas, specs, MVP local, lancamento e distribuicao publica.",
        "en": "Track the path from setup to deployment: tools, specs, local MVP, launch, and public distribution.",
        "fr": "Suivez le chemin du setup au deployement : outils, specs, MVP local, lancement et distribution publique.",
    },
    "dashboard_stage_title": {
        "pt": "Mapa de Execucao do Founder",
        "en": "Founder Execution Map",
        "fr": "Carte d'Execution du Fondateur",
    },
    "dashboard_stage_1": {
        "pt": "Operar a stack",
        "en": "Operate the stack",
        "fr": "Operer la stack",
    },
    "dashboard_stage_2": {
        "pt": "Definir o produto",
        "en": "Define the product",
        "fr": "Definir le produit",
    },
    "dashboard_stage_3": {
        "pt": "Build local",
        "en": "Build locally",
        "fr": "Build local",
    },
    "dashboard_stage_4": {
        "pt": "Lancar em publico",
        "en": "Launch in public",
        "fr": "Lancer en public",
    },
    "dashboard_focus_title": {
        "pt": "Foco Atual",
        "en": "Current Focus",
        "fr": "Focus Actuel",
    },
    "dashboard_next_action": {
        "pt": "Proxima acao",
        "en": "Next action",
        "fr": "Prochaine action",
    },
    "dashboard_launch_title": {
        "pt": "Prontidao para Lancamento",
        "en": "Launch Readiness",
        "fr": "Preparation au lancement",
    },
    "dashboard_launch_copy": {
        "pt": "Nao queremos apenas completar tarefas. Queremos chegar a um produto demonstravel, com deploy, narrativa e distribuicao.",
        "en": "We do not just want to complete tasks. We want to reach a demonstrable product with deployment, narrative, and distribution.",
        "fr": "Nous ne voulons pas seulement terminer des taches. Nous voulons arriver a un produit demonstrable avec deployement, narration et distribution.",
    },
    "dashboard_next_action_stage_1": {
        "pt": "Configura a stack, domina OpenCode e fecha as primeiras specs.",
        "en": "Set up the stack, get comfortable with OpenCode, and finish the first specs.",
        "fr": "Configurez la stack, maitrisez OpenCode et finalisez les premieres specs.",
    },
    "dashboard_next_action_stage_2": {
        "pt": "Aperta a wedge, os contratos de dados e o blueprint do Prophet Lite.",
        "en": "Tighten the wedge, the data contracts, and the Prophet Lite blueprint.",
        "fr": "Affinez la wedge, les contrats de donnees et le blueprint Prophet Lite.",
    },
    "dashboard_next_action_stage_3": {
        "pt": "Mantem o fluxo local estavel: inputs, run, output, docs e copiloto.",
        "en": "Keep the local flow stable: inputs, run, output, docs, and copilot.",
        "fr": "Gardez le flux local stable : inputs, run, output, docs et copilote.",
    },
    "dashboard_next_action_stage_4": {
        "pt": "Polir deploy, landing, demo e o lancamento em publico.",
        "en": "Polish deployment, landing, demo, and the public launch.",
        "fr": "Affinez le deployement, la landing, la demo et le lancement public.",
    },
    "dashboard_top_state_copy": {
        "pt": "Ja estas no topo da progressao. Agora e distribuicao e repeticao.",
        "en": "You are already at the top tier. Now focus on distribution and repetition.",
        "fr": "Vous etes deja au sommet. Maintenant, place a la distribution et a la repetition.",
    },
    "dashboard_launches_in_motion": {
        "pt": "lancamentos em curso",
        "en": "launches in motion",
        "fr": "lancements en cours",
    },
    "dashboard_lessons_title": {
        "pt": "Abrir as aulas",
        "en": "Open lessons",
        "fr": "Ouvrir les lecons",
    },
    "dashboard_lessons_open_now": {
        "pt": "Abrir as aulas agora",
        "en": "Open lessons now",
        "fr": "Ouvrir les lecons maintenant",
    },
    "dashboard_lessons_pre_bootcamp_short": {
        "pt": "Pre-Bootcamp",
        "en": "Pre-Bootcamp",
        "fr": "Pre-Bootcamp",
    },
    "dashboard_lessons_week_2_short": {
        "pt": "Semana 2",
        "en": "Week 2",
        "fr": "Semaine 2",
    },
    "dashboard_lessons_help_text": {
        "pt": "Escolhe uma semana abaixo ou carrega em abrir agora para entrar diretamente no programa.",
        "en": "Choose a week below or open now to jump straight into the programme.",
        "fr": "Choisissez une semaine ci-dessous ou ouvrez maintenant pour entrer directement dans le programme.",
    },
    "dashboard_lessons_open_pre_bootcamp": {
        "pt": "Abrir Pre-Bootcamp",
        "en": "Open Pre-Bootcamp",
        "fr": "Ouvrir le Pre-Bootcamp",
    },
    "dashboard_lessons_open_week_1": {
        "pt": "Abrir Semana 1",
        "en": "Open Week 1",
        "fr": "Ouvrir la Semaine 1",
    },
    "dashboard_lessons_open_week_2": {
        "pt": "Abrir Semana 2",
        "en": "Open Week 2",
        "fr": "Ouvrir la Semaine 2",
    },
    "dashboard_lessons_open_this_week": {
        "pt": "Abrir aulas desta semana",
        "en": "Open this week's lessons",
        "fr": "Ouvrir les lecons de cette semaine",
    },
    "dashboard_lessons_open_prefix": {
        "pt": "Abrir",
        "en": "Open",
        "fr": "Ouvrir",
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
        "pt": "Concluidos",
        "en": "Completed",
        "fr": "Termines",
    },
    "badge": {
        "pt": "Badge",
        "en": "Badge",
        "fr": "Badge",
    },
    "complete": {
        "pt": "concluido",
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
        "pt": "Pre-bootcamp + 10 dias para passar de atuario a founder AI-native, construir localmente e deployar um Prophet Lite",
        "en": "Pre-bootcamp + 10 days to go from actuary to AI-native founder, build locally, and deploy a Prophet Lite",
        "fr": "Pre-bootcamp + 10 jours pour passer d'actuaire a fondateur AI-native, construire en local et deployer un Prophet Lite",
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
        "pt": "Sistema de Pontos do Founder",
        "en": "Founder Points System",
        "fr": "Systeme de Points du Fondateur",
    },
    "programa_snapshot": {
        "pt": "Visao rapida do modulo",
        "en": "Quick module snapshot",
        "fr": "Vue rapide du module",
    },
    "programa_points_hint": {
        "pt": "O sistema de pontos mede execucao, nao teoria.",
        "en": "The points system measures execution, not theory.",
        "fr": "Le systeme de points mesure l'execution, pas la theorie.",
    },
    "programa_modules_short": {
        "pt": "mods",
        "en": "mods",
        "fr": "mods",
    },
    "programa_exercises_short": {
        "pt": "ex",
        "en": "ex",
        "fr": "ex",
    },
    "programa_challenge_points_short": {
        "pt": "pts desafio",
        "en": "challenge pts",
        "fr": "pts defi",
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
    "exercise_status_completed": {
        "pt": "Concluido",
        "en": "Completed",
        "fr": "Termine",
    },
    "exercise_status_open": {
        "pt": "Em aberto",
        "en": "Open",
        "fr": "Ouvert",
    },

    # ── Recursos Page ──
    "recursos_title": {
        "pt": "Recursos & Datasets",
        "en": "Resources & Datasets",
        "fr": "Ressources & Datasets",
    },
    "recursos_sub": {
        "pt": "Datasets, templates, referencias Prophet Lite e stack AI-native para passar da ideia ao MVP deployado",
        "en": "Datasets, templates, Prophet Lite references, and an AI-native stack to go from idea to deployed MVP",
        "fr": "Jeux de donnees, templates, references Prophet Lite et stack AI-native pour passer de l'idee au MVP deploye",
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
    "templates_badge": {"pt": "TPL", "en": "TPL", "fr": "TPL"},
    "stack_category_runtime": {
        "pt": "Base Runtime",
        "en": "Base Runtime",
        "fr": "Runtime de base",
    },
    "stack_category_ai_builder": {
        "pt": "AI Builder",
        "en": "AI Builder",
        "fr": "AI Builder",
    },
    "stack_category_planning": {
        "pt": "Planning",
        "en": "Planning",
        "fr": "Planification",
    },
    "stack_category_llm": {
        "pt": "LLM",
        "en": "LLM",
        "fr": "LLM",
    },
    "stack_category_tooling": {
        "pt": "Tooling",
        "en": "Tooling",
        "fr": "Outillage",
    },
    "stack_category_local_mvp_ui": {
        "pt": "UI do MVP Local",
        "en": "Local MVP UI",
        "fr": "UI du MVP local",
    },
    "stack_category_docs_memory": {
        "pt": "Docs & Memoria",
        "en": "Docs & Memory",
        "fr": "Docs & Memoire",
    },
    "stack_category_auth_db": {
        "pt": "Auth & BD",
        "en": "Auth & DB",
        "fr": "Auth & BD",
    },
    "stack_category_deploy": {
        "pt": "Deploy",
        "en": "Deploy",
        "fr": "Deploiement",
    },
    "resource_vida_s1_carteira_apolices_vida_desc": {
        "pt": "Carteira de 3K apolices vida: temporario, vida inteira, misto e renda vitalicia.",
        "en": "3K life policy portfolio: term, whole life, endowment, and annuity.",
        "fr": "Portefeuille de 3K polices vie : temporaire, vie entiere, mixte et rente viagere.",
    },
    "resource_vida_s1_sinistralidade_vida_desc": {
        "pt": "Historico de eventos vida com obitos, resgates, vencimentos e rendas, incluindo anomalias intencionais.",
        "en": "Life events history with deaths, surrenders, maturities, and annuities, including intentional anomalies.",
        "fr": "Historique des evenements vie avec deces, rachats, echeances et rentes, incluant des anomalies intentionnelles.",
    },
    "resource_vida_s1_exclusoes_apolice_vida_desc": {
        "pt": "Exclusoes de apolice: suicidio, guerra, desportos radicais e incontestabilidade.",
        "en": "Policy exclusions: suicide, war, extreme sports, and incontestability.",
        "fr": "Exclusions de police : suicide, guerre, sports extremes et incontestabilite.",
    },
    "resource_vida_s1_nota_sinistro_vida_desc": {
        "pt": "Tres processos de sinistro vida para analise e revisao.",
        "en": "Three life claim files for analysis and review.",
        "fr": "Trois dossiers de sinistre vie pour analyse et revue.",
    },
    "resource_vida_s1_red_flags_fraude_vida_desc": {
        "pt": "200 sinistros com sinais de alerta de fraude escondidos.",
        "en": "200 claims with hidden fraud red flags.",
        "fr": "200 sinistres avec signaux faibles de fraude caches.",
    },
    "resource_vida_s1_questionario_subscricao_vida_desc": {
        "pt": "500 propostas de subscricao com declaracoes falsas e inconsistencias.",
        "en": "500 underwriting proposals with false declarations and inconsistencies.",
        "fr": "500 propositions de souscription avec fausses declarations et incoherences.",
    },
    "resource_vida_s2_tabua_mortalidade_cso2017_desc": {
        "pt": "Tabua SOA CSO 2017 com qx por idade e sexo, dos 0 aos 120 anos.",
        "en": "SOA CSO 2017 table with qx by age and sex, ages 0 to 120.",
        "fr": "Table SOA CSO 2017 avec qx par age et sexe, de 0 a 120 ans.",
    },
    "resource_vida_s2_taxas_resgate_desc": {
        "pt": "Taxas de lapse por ano de apolice e tipo de produto.",
        "en": "Lapse rates by policy year and product type.",
        "fr": "Taux de rachat par annee de police et type de produit.",
    },
    "resource_vida_s2_yield_curve_ecb_desc": {
        "pt": "Curva de taxas de juro ECB para discounting do motor.",
        "en": "ECB yield curve for discounting in the engine.",
        "fr": "Courbe de taux ECB pour le discounting du moteur.",
    },
    "resource_vida_s2_factores_melhoramento_mortalidade_desc": {
        "pt": "Melhoramento da mortalidade 2017-2050 com choque COVID incluido.",
        "en": "Mortality improvement factors from 2017-2050 including a COVID shock.",
        "fr": "Facteurs d'amelioration de mortalite 2017-2050 incluant un choc COVID.",
    },
    "resource_vida_s2_comissoes_mediacao_desc": {
        "pt": "Comissoes por produto e ano, com regras de clawback.",
        "en": "Commissions by product and year, including clawback rules.",
        "fr": "Commissions par produit et par annee, avec regles de clawback.",
    },
    "resource_vida_s2_mortalidade_covid_portugal_desc": {
        "pt": "Excesso de mortalidade em Portugal entre 2019 e 2023 por idade e sexo.",
        "en": "Excess mortality in Portugal from 2019 to 2023 by age and sex.",
        "fr": "Surmortalite au Portugal de 2019 a 2023 par age et sexe.",
    },
    "resource_vida_s2_benchmark_mercado_vida_pt_desc": {
        "pt": "Benchmarks do mercado vida em Portugal entre 2018 e 2025.",
        "en": "Portuguese life market benchmarks from 2018 to 2025.",
        "fr": "Benchmarks du marche vie portugais entre 2018 et 2025.",
    },
    "resource_saude_medical_costs_sample_desc": {
        "pt": "10K registos de custos medicos com variaveis de risco basicas.",
        "en": "10K medical cost records with basic risk variables.",
        "fr": "10K enregistrements de couts medicaux avec variables de risque de base.",
    },
    "resource_saude_sinistralidade_historica_desc": {
        "pt": "5K sinistros saude com anomalias intencionais para exploracao.",
        "en": "5K health claims with intentional anomalies for exploration.",
        "fr": "5K sinistres sante avec anomalies intentionnelles pour l'exploration.",
    },
    "resource_saude_exclusoes_apolice_desc": {
        "pt": "Exclusoes saude com codigos CID e regras de negocio.",
        "en": "Health exclusions with ICD codes and business rules.",
        "fr": "Exclusions sante avec codes CIM et regles metier.",
    },
    "resource_saude_fatura_hospital_desc": {
        "pt": "Cinco faturas hospitalares para OCR e extracao.",
        "en": "Five hospital invoices for OCR and extraction.",
        "fr": "Cinq factures hospitalieres pour OCR et extraction.",
    },
    "resource_saude_fatura_farmacia_desc": {
        "pt": "Tres recibos de farmacia para OCR.",
        "en": "Three pharmacy receipts for OCR.",
        "fr": "Trois recus de pharmacie pour OCR.",
    },
    "resource_saude_condicoes_gerais_desc": {
        "pt": "Clausulado geral de seguro saude para RAG e pesquisa.",
        "en": "General health insurance wording for RAG and retrieval.",
        "fr": "Conditions generales de sante pour RAG et recherche.",
    },
    "resource_saude_nota_alta_hospitalar_desc": {
        "pt": "Tres notas de alta hospitalar para classificacao e resumo.",
        "en": "Three discharge notes for classification and summarization.",
        "fr": "Trois comptes rendus de sortie pour classification et resume.",
    },
    "resource_saude_tabua_morbilidade_desc": {
        "pt": "Frequencia e severidade por faixa etaria para saude.",
        "en": "Frequency and severity by age band for health.",
        "fr": "Frequence et severite par tranche d'age pour la sante.",
    },
    "resource_saude_carteira_beneficiarios_desc": {
        "pt": "Carteira de 5K beneficiarios saude para exploracao.",
        "en": "5K health beneficiaries portfolio for exploration.",
        "fr": "Portefeuille de 5K beneficiaires sante pour exploration.",
    },
    "resource_template_constitution_desc": {
        "pt": "Template base para constitution.md em Spec-Driven Development.",
        "en": "Base template for constitution.md in Spec-Driven Development.",
        "fr": "Template de base pour constitution.md en Spec-Driven Development.",
    },
    "resource_template_spec_desc": {
        "pt": "Template base para spec.md.",
        "en": "Base template for spec.md.",
        "fr": "Template de base pour spec.md.",
    },
    "resource_template_modelo_negocio_desc": {
        "pt": "Template para pricing e modelo de negocio no Dia 7.",
        "en": "Template for pricing and business model work on Day 7.",
        "fr": "Template pour pricing et modele economique au Jour 7.",
    },
    "resource_template_calculadora_premio_desc": {
        "pt": "Template para o exercicio da calculadora de premio simples.",
        "en": "Template for the simple premium calculator exercise.",
        "fr": "Template pour l'exercice de calculatrice de prime simple.",
    },
    "resource_checklist_auditoria_codigo_desc": {
        "pt": "Cinco perguntas para auditar codigo gerado por IA.",
        "en": "Five questions to audit AI-generated code.",
        "fr": "Cinq questions pour auditer du code genere par IA.",
    },
    "resource_scripts_com_bugs_desc": {
        "pt": "Cinco scripts com bugs atuariais escondidos para revisao.",
        "en": "Five scripts with hidden actuarial bugs for review.",
        "fr": "Cinq scripts avec bugs actuariels caches pour revue.",
    },
    "resource_prophet_reference_vida_desc": {
        "pt": "Referencia funcional do FIS Prophet para desenhar o Prophet Lite.",
        "en": "Functional FIS Prophet reference to design Prophet Lite.",
        "fr": "Reference fonctionnelle FIS Prophet pour concevoir Prophet Lite.",
    },
    "resource_excel_validacao_cashflow_desc": {
        "pt": "Calculo manual de referencia para validar cash flows do motor local.",
        "en": "Manual reference calculation to validate local engine cash flows.",
        "fr": "Calcul manuel de reference pour valider les cash flows du moteur local.",
    },

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
        "pt": "Preparacao pratica para operar como builder AI-native: terminal desde zero, API key configurada, OpenCode operacional, analise de dados reais com prompts e regras de seguranca para atuarios.",
        "en": "Practical preparation to operate as an AI-native builder: terminal from zero, API key configured, OpenCode operational, real data analysis with prompts, and security rules for actuaries.",
        "fr": "Preparation pratique pour operer comme builder AI-native : terminal depuis zero, cle API configuree, OpenCode operationnel, analyse de donnees reelles avec prompts et regles de securite pour actuaires.",
    },
    "week1_intro_title": {
        "pt": "Semana 1: Fundacao do Founder AI",
        "en": "Week 1: AI Founder Foundations",
        "fr": "Semaine 1 : Fondations du Fondateur AI",
    },
    "week1_intro_desc": {
        "pt": "Semana de formacao do fundador: escolher a wedge, operar coding LLMs, escrever specs, trabalhar com APIs e dados, entender Prophet e desenhar um MVP vendavel.",
        "en": "Founder formation week: choose the wedge, operate coding LLMs, write specs, work with APIs and data, understand Prophet, and design a sellable MVP.",
        "fr": "Semaine de formation du fondateur : choisir la wedge, utiliser les coding LLMs, ecrire des specs, travailler avec APIs et donnees, comprendre Prophet et concevoir un MVP vendable.",
    },
    "week2_intro_title": {
        "pt": "Semana 2: Build, Deploy & Distribuicao",
        "en": "Week 2: Build, Deploy & Distribution",
        "fr": "Semaine 2 : Build, Deployement & Distribution",
    },
    "week2_intro_desc": {
        "pt": "Semana de execucao: document drop, UX mobile-first, build local do Prophet Lite, copiloto AI, deploy, demo final e lancamento no LinkedIn.",
        "en": "Execution week: document drop, mobile-first UX, local Prophet Lite build, AI copilot, deployment, final demo, and LinkedIn launch.",
        "fr": "Semaine d'execution : depot de documents, UX mobile-first, build local du Prophet Lite, copilote AI, deployement, demo finale et lancement sur LinkedIn.",
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
        "pt": "Exercicios Diarios (Dias 1-10)", "en": "Daily Exercises (Days 1-10)", "fr": "Exercices Quotidiens (Jours 1-10)",
    },
    "grading_exercises_desc": {
        "pt": "Checklist diaria de execucao",
        "en": "Daily execution checklist",
        "fr": "Checklist quotidienne d'execution",
    },
    "grading_challenges": {
        "pt": "Desafios Diarios (melhor 8 de 10)", "en": "Daily Challenges (best 8 of 10)", "fr": "Defis Quotidiens (meilleurs 8 sur 10)",
    },
    "grading_challenges_desc": {
        "pt": "Entrega principal de cada dia",
        "en": "Main deliverable of each day",
        "fr": "Livrable principal de chaque jour",
    },
    "grading_homework": {
        "pt": "Tarefas para Casa", "en": "Homework", "fr": "Devoirs",
    },
    "grading_homework_desc": {
        "pt": "Refino, notas e consolidacao",
        "en": "Refinement, notes, and consolidation",
        "fr": "Refinements, notes et consolidation",
    },
    "grading_participation": {
        "pt": "Participacao & Forum", "en": "Participation & Forum", "fr": "Participation & Forum",
    },
    "grading_participation_desc": {
        "pt": "Feedback, colaboracao e presenca ativa",
        "en": "Feedback, collaboration, and active presence",
        "fr": "Feedback, collaboration et presence active",
    },
    "grading_final": {
        "pt": "Projeto Final (MVP Prophet Lite)", "en": "Final Project (Prophet Lite MVP)", "fr": "Projet Final (MVP Prophet Lite)",
    },
    "grading_final_desc": {
        "pt": "MVP online, demo publica e lancamento no LinkedIn",
        "en": "Online MVP, public demo, and LinkedIn launch",
        "fr": "MVP en ligne, demo publique et lancement sur LinkedIn",
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
        "pt": "O teu copiloto para specs, tools, Prophet Lite, deploy e lancamento — powered by DeepSeek",
        "en": "Your copilot for specs, tools, Prophet Lite, deployment, and launch — powered by DeepSeek",
        "fr": "Votre copilote pour specs, outils, Prophet Lite, deployement et lancement — powered by DeepSeek",
    },
    "tutor_ready": {
        "pt": "Pronto para ajudar com specs, copiloto AI, document drop, deploy, prompts e decisoes de produto.",
        "en": "Ready to help with specs, AI copilot, document drop, deployment, prompts, and product decisions.",
        "fr": "Pret a aider sur les specs, le copilote AI, le depot de documents, le deployement, les prompts et les decisions produit.",
    },
    "tutor_prompt_title": {
        "pt": "Prompts sugeridos para arrancar",
        "en": "Suggested prompts to get started",
        "fr": "Prompts suggeres pour commencer",
    },
    "tutor_capability_1": {
        "pt": "Ajuda a transformar ideias de negocio em specs claras para LLMs executarem.",
        "en": "Helps turn business ideas into clear specs that LLMs can execute.",
        "fr": "Aide a transformer les idees business en specs claires que les LLMs peuvent executer.",
    },
    "tutor_capability_2": {
        "pt": "Explica tools, APIs, JSON, erros comuns e como operar a stack sem depender de coding manual.",
        "en": "Explains tools, APIs, JSON, common errors, and how to operate the stack without depending on manual coding.",
        "fr": "Explique les outils, APIs, JSON, erreurs courantes et comment operer la stack sans dependre du code manuel.",
    },
    "tutor_capability_3": {
        "pt": "Da contexto sobre Prophet Lite, document drop, UX mobile-first e arquitetura do MVP final.",
        "en": "Provides context on Prophet Lite, document drop, mobile-first UX, and final MVP architecture.",
        "fr": "Donne du contexte sur Prophet Lite, le depot de documents, l'UX mobile-first et l'architecture finale du MVP.",
    },
    "tutor_capability_4": {
        "pt": "Ajuda a preparar deploy, demo, post de LinkedIn e proximos passos de mercado.",
        "en": "Helps prepare deployment, demo, LinkedIn post, and next market-facing steps.",
        "fr": "Aide a preparer le deployement, la demo, le post LinkedIn et les prochaines etapes de marche.",
    },
    "tutor_welcome": {
        "pt": "Ola! Sou o teu AI Tutor",
        "en": "Hi! I'm your AI Tutor",
        "fr": "Bonjour! Je suis votre AI Tuteur",
    },
    "tutor_welcome_sub": {
        "pt": "Posso ajudar-te com specs, OpenCode, MCPs, APIs, Prophet Lite,<br>document drop, deploy, narrativa de produto e qualquer duvida do bootcamp.",
        "en": "I can help with specs, OpenCode, MCPs, APIs, Prophet Lite,<br>document drop, deployment, product narrative, and any bootcamp question.",
        "fr": "Je peux aider sur les specs, OpenCode, MCPs, APIs, Prophet Lite,<br>depot de documents, deployement, narration produit et toute question du bootcamp.",
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
        "pt": "Ajuda-me a escolher uma wedge pequena e vendavel para o meu Prophet Lite.",
        "en": "Help me choose a small, sellable wedge for my Prophet Lite.",
        "fr": "Aide-moi a choisir une petite wedge vendable pour mon Prophet Lite.",
    },
    "tutor_sug_2": {
        "pt": "Revê a minha spec de upload de assumptions como se fosses um product engineer.",
        "en": "Review my assumptions upload spec as if you were a product engineer.",
        "fr": "Relis ma spec d'upload d'hypotheses comme si tu etais un product engineer.",
    },
    "tutor_sug_3": {
        "pt": "Que dados e schemas preciso para ligar model points, assumptions e run results?",
        "en": "What data and schemas do I need to connect model points, assumptions, and run results?",
        "fr": "De quelles donnees et schemas ai-je besoin pour relier model points, hypotheses et run results ?",
    },
    "tutor_sug_4": {
        "pt": "Como desenho um document drop simples e fiavel para esta app?",
        "en": "How do I design a simple, reliable document drop for this app?",
        "fr": "Comment concevoir un depot de documents simple et fiable pour cette app ?",
    },
    "tutor_sug_5": {
        "pt": "Que modelo devo usar para planear, construir e explicar o MVP?",
        "en": "Which model should I use to plan, build, and explain the MVP?",
        "fr": "Quel modele dois-je utiliser pour planifier, construire et expliquer le MVP ?",
    },
    "tutor_sug_6": {
        "pt": "Ajuda-me a escrever o post final de lancamento para o LinkedIn.",
        "en": "Help me write the final launch post for LinkedIn.",
        "fr": "Aide-moi a ecrire le post final de lancement pour LinkedIn.",
    },
    "tutor_unavailable": {
        "pt": "AI Tutor indisponivel -- configura a chave DeepSeek em secrets.toml.",
        "en": "AI Tutor unavailable -- configure the DeepSeek key in secrets.toml.",
        "fr": "AI Tutor indisponible -- configurez la cle DeepSeek dans secrets.toml.",
    },
    "tutor_no_response": {
        "pt": "Sem resposta do modelo.",
        "en": "No response from the model.",
        "fr": "Aucune reponse du modele.",
    },
    "tutor_contact_error": {
        "pt": "Erro ao contactar o AI Tutor: {error}",
        "en": "Error contacting the AI Tutor: {error}",
        "fr": "Erreur lors du contact avec l'AI Tutor : {error}",
    },

    # ── LinkedIn Launch Page ──
    "launch_title": {
        "pt": "LinkedIn Launch Kit",
        "en": "LinkedIn Launch Kit",
        "fr": "Kit de Lancement LinkedIn",
    },
    "launch_sub": {
        "pt": "Transforma o MVP em narrativa publica, distribuicao e conversa com mercado.",
        "en": "Turn the MVP into public narrative, distribution, and market conversation.",
        "fr": "Transformez le MVP en narration publique, distribution et conversation avec le marche.",
    },
    "launch_kicker": {
        "pt": "Construir em publico",
        "en": "Build in public",
        "fr": "Build in public",
    },
    "launch_why_title": {
        "pt": "Porque lancar em publico",
        "en": "Why launch in public",
        "fr": "Pourquoi lancer en public",
    },
    "launch_why_1": {
        "pt": "Atrai feedback, pilotos e conversas reais com a industria.",
        "en": "Attracts feedback, pilot users, and real industry conversations.",
        "fr": "Attire du feedback, des pilotes et de vraies conversations avec l'industrie.",
    },
    "launch_why_2": {
        "pt": "Transforma aprendizagem em reputacao e prova publica de execucao.",
        "en": "Turns learning into reputation and public proof of execution.",
        "fr": "Transforme l'apprentissage en reputation et preuve publique d'execution.",
    },
    "launch_why_3": {
        "pt": "Ajuda-te a passar de estudante a fundador ou operador de produto.",
        "en": "Helps you move from student to founder or product operator.",
        "fr": "Vous aide a passer d'etudiant a fondateur ou operateur produit.",
    },
    "launch_template_title": {
        "pt": "Template de post",
        "en": "Post template",
        "fr": "Template de post",
    },
    "launch_template_body": {
        "pt": "Hoje lancei o meu Prophet Lite com copiloto AI.\n\nProblema: muitas equipas ainda trabalham com processos pesados, ferramentas legacy e demasiada friccao para transformar assumptions, model points e documentos em runs claros.\n\nO que construí: um MVP que permite subir inputs, correr projecoes deterministicas, explicar resultados com AI e capturar conhecimento a partir de documentos.\n\nStack: OpenCode, GLM-5, DeepSeek, MCPs, Streamlit, ChromaDB e Supabase.\n\nO mais importante que aprendi: com coding LLMs nao preciso de ser programador tradicional para construir software; preciso de saber especificar, validar, iterar e lancar.\n\nSe trabalhas em seguros, vida, analytics ou software B2B e isto te interessa, fala comigo.",
        "en": "Today I launched my Prophet Lite with an AI copilot.\n\nProblem: many teams still work with heavy processes, legacy tools, and too much friction when turning assumptions, model points, and documents into clear runs.\n\nWhat I built: an MVP that lets users upload inputs, run deterministic projections, explain results with AI, and capture knowledge from documents.\n\nStack: OpenCode, GLM-5, DeepSeek, MCPs, Streamlit, ChromaDB, and Supabase.\n\nWhat I learned most: with coding LLMs I do not need to be a traditional programmer to build software; I need to know how to specify, validate, iterate, and launch.\n\nIf you work in insurance, life, analytics, or B2B software and this is relevant, let’s talk.",
        "fr": "Aujourd'hui j'ai lance mon Prophet Lite avec copilote AI.\n\nProbleme : beaucoup d'equipes travaillent encore avec des processus lourds, des outils legacy et trop de friction pour transformer hypotheses, model points et documents en runs clairs.\n\nCe que j'ai construit : un MVP qui permet d'uploader des inputs, lancer des projections deterministes, expliquer les resultats avec l'AI et capturer la connaissance depuis des documents.\n\nStack : OpenCode, GLM-5, DeepSeek, MCPs, Streamlit, ChromaDB et Supabase.\n\nLe plus important que j'ai appris : avec les coding LLMs je n'ai pas besoin d'etre un programmeur traditionnel pour construire du software ; je dois savoir specifier, valider, iterer et lancer.\n\nSi vous travaillez dans l'assurance, la vie, l'analytics ou le software B2B et que cela vous parle, parlons-en.",
    },
    "launch_assets_title": {
        "pt": "Assets a preparar",
        "en": "Assets to prepare",
        "fr": "Assets a preparer",
    },
    "launch_assets_1": {
        "pt": "1 screenshot mobile + 1 screenshot desktop",
        "en": "1 mobile screenshot + 1 desktop screenshot",
        "fr": "1 capture mobile + 1 capture desktop",
    },
    "launch_assets_2": {
        "pt": "URL deployada e CTA claro",
        "en": "Deployed URL and clear CTA",
        "fr": "URL deployee et CTA clair",
    },
    "launch_assets_3": {
        "pt": "1 frase sobre o problema e 1 frase sobre o resultado",
        "en": "1 sentence on the problem and 1 sentence on the outcome",
        "fr": "1 phrase sur le probleme et 1 phrase sur le resultat",
    },
    "launch_assets_4": {
        "pt": "Stack curta, nao uma lista interminavel de buzzwords",
        "en": "Short stack mention, not an endless list of buzzwords",
        "fr": "Mention de stack courte, pas une liste interminable de buzzwords",
    },
    "launch_checklist_title": {
        "pt": "Checklist de lancamento",
        "en": "Launch checklist",
        "fr": "Checklist de lancement",
    },
    "launch_check_1": {
        "pt": "Mostrar um fluxo completo: input -> run -> output -> copiloto",
        "en": "Show one complete flow: input -> run -> output -> copilot",
        "fr": "Montrer un flux complet : input -> run -> output -> copilote",
    },
    "launch_check_2": {
        "pt": "Explicar a wedge em menos de 2 frases",
        "en": "Explain the wedge in under 2 sentences",
        "fr": "Expliquer la wedge en moins de 2 phrases",
    },
    "launch_check_3": {
        "pt": "Pedir feedback ou pilotos, nao apenas likes",
        "en": "Ask for feedback or pilot users, not just likes",
        "fr": "Demander du feedback ou des pilotes, pas seulement des likes",
    },
    "launch_check_4": {
        "pt": "Fechar com convite para conversa ou demo",
        "en": "Close with an invitation to talk or request a demo",
        "fr": "Conclure avec une invitation a parler ou demander une demo",
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
    # ── Navigation: Programa → Exercicios ──
    "start_exercises_btn": {
        "pt": "Iniciar Exercicios",
        "en": "Start Exercises",
        "fr": "Commencer les Exercices",
    },
    "go_to_exercises_hint": {
        "pt": "Abre a pagina de exercicios para completar e submeter o teu trabalho.",
        "en": "Open the exercises page to complete and submit your work.",
        "fr": "Ouvrez la page des exercices pour completer et soumettre votre travail.",
    },
    "dashboard_go_exercises": {
        "pt": "Ir para Exercicios",
        "en": "Go to Exercises",
        "fr": "Aller aux Exercices",
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
