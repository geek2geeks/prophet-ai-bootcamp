from typing import Any


COURSE_TITLE = "AI Founder Bootcamp para Atuarios"
COURSE_SUBTITLE = "Do conhecimento atuarial ao Prophet Lite com copiloto AI"
TOTAL_POINTS = 675

BADGES = [
    (0, "Builder Ready"),
    (120, "Tool Operator"),
    (240, "Spec Strategist"),
    (360, "Workflow Architect"),
    (480, "Product Builder"),
    (600, "AI Founder"),
]


def get_badge(points: int) -> str:
    badge = BADGES[0][1]
    for threshold, name in BADGES:
        if points >= threshold:
            badge = name
    return badge


DAYS = [
    {
        "dia": 0,
        "titulo": "Setup do Builder AI-Native",
        "semana": 0,
        "objetivo": "Entrar no bootcamp sem medo do terminal. Configurar o ambiente, obter API key, instalar OpenCode e ganhar fluencia basica para usar LLMs como ferramenta de trabalho atuarial.",
        "modulos": [
            "Terminal & Ambiente: Zero a Confortavel",
            "OpenCode, API Key & Primeiras Instrucoes",
            "LLMs, Tokens, Custos & Regras de Operacao"
        ],
        "exercicios": [
            {"id": "ex0.1", "titulo": "Abrir o Terminal e Navegar sem Medo", "pontos": 10,
             "descricao": "⏱ ~15 min | Abrir o terminal (no Windows: procurar 'cmd' no menu Iniciar; no Mac: Aplicacoes > Utilitarios > Terminal). Executar 5 comandos: (1) ver a pasta atual -- escrever 'cd' no Windows ou 'pwd' no Mac, (2) listar ficheiros -- 'dir' no Windows ou 'ls' no Mac, (3) criar pasta do projeto -- 'mkdir projeto_prophet', (4) entrar nela -- 'cd projeto_prophet', (5) voltar atras -- 'cd ..'. Para guardar o output: abrir o Bloco de Notas (Windows) ou TextEdit (Mac), colar os resultados e guardar como comandos_dia0.txt."},
            {"id": "ex0.2", "titulo": "Obter API Key e Configurar DeepSeek", "pontos": 10,
             "descricao": "⏱ ~20 min | Esta key vai dar-te acesso a um modelo de IA capaz de analisar tabuas de mortalidade, carteiras e regulacao em segundos. OPCAO A (recomendada): Ir a pagina Exercicios nesta app, selecionar Dia 0, e clicar em 'Chaves do Bootcamp' para copiar a key partilhada. OPCAO B (conta propria): Ir a platform.deepseek.com, criar conta, adicionar credito (~$2 por cartao, processado na Europa via Stripe), clicar 'API Keys' no menu lateral, criar nova key e copia-la IMEDIATAMENTE. Feito: quando tiveres a key copiada e guardada num local seguro, marca como concluido."},
            {"id": "ex0.3", "titulo": "Instalar OpenCode e Primeiro Teste", "pontos": 10,
             "descricao": "⏱ ~25 min | PREREQUISITO: instalar o Node.js primeiro (vai a nodejs.org, descarrega a versao LTS, instala, e FECHA E REABRE o terminal). Depois, instalar o OpenCode: escrever 'npm install -g @opencode/cli' no terminal. Copiar a DeepSeek key da pagina Exercicios > Dia 0 > 'Chaves do Bootcamp'. Configurar de forma PERMANENTE (ver instrucoes detalhadas no Modulo 2 -- 'Configuracao Permanente'). Abrir o OpenCode (escrever 'opencode' no terminal -- aparece uma interface de texto onde escreves instrucoes). Testar com: 'Sou atuario vida com experiencia em pricing e reservas. Diz-me em 3 frases o que consegues fazer com uma tabua de mortalidade CSO 2017.' Para sair do OpenCode: escrever '/exit' ou premir Ctrl+C. Documentar o resultado: pedir ao OpenCode 'guarda esta conversa num ficheiro chamado setup_log.md'."},
            {"id": "ex0.4", "titulo": "Analisar Dados Reais com OpenCode", "pontos": 10,
             "descricao": "⏱ ~25 min | Descarregar os ficheiros de dados do bootcamp (o instrutor fornece o link ou envia por email). Abrir o OpenCode na pasta onde guardaste os ficheiros (escrever 'cd caminho_da_pasta' no terminal antes de abrir o OpenCode). Pedir ao OpenCode: (1) 'Abre o ficheiro carteira_vida_sample.csv e diz-me quantas apolices tem, qual o capital total segurado em EUR e como se distribui por tipo de produto', (2) 'Qual e a idade media e a distribuicao por sexo e estado de fumador? Ha diferencas nos premios entre fumadores e nao-fumadores para a mesma faixa etaria?', (3) 'Resume esta carteira como se fosse para apresentar ao board da seguradora: incluir exposicao total, concentracao de risco, e eventuais apolices a vigiar'. Para guardar: pedir ao OpenCode 'guarda estas respostas num ficheiro chamado analise_carteira.md'."},
            {"id": "ex0.5", "titulo": "Prompt Preciso vs Prompt Explorador", "pontos": 10,
             "descricao": "⏱ ~20 min | Usar o ficheiro tabua_mortalidade_CSO2017.csv (nota: tabua americana usada como exemplo educativo -- em Portugal usarias tabuas aprovadas pela ASF). PROMPT PRECISO: 'Abre tabua_mortalidade_CSO2017.csv. Qual e o valor exato de qx para homens e mulheres aos 65 anos? Calcula a diferenca relativa entre sexos e a esperanca de vida restante para ambos.' PROMPT EXPLORADOR: 'Olhando para a mortalidade aos 65 anos e a progressao da tabua, que implicacoes tem para o pricing de um seguro temporario 10 anos vs um seguro vida inteira? Que margens de seguranca recomendarias?' Comparar as respostas e anotar: o modelo acertou nos numeros? As recomendacoes fazem sentido atuarial? Guardar com: 'guarda ambas as respostas num ficheiro comparacao_prompts.md'."},
            {"id": "ex0.6", "titulo": "Mapa da Stack AI do Fundador", "pontos": 10,
             "descricao": "⏱ ~15 min | Pedir ao OpenCode: 'Cria um diagrama em texto da stack do bootcamp: Terminal → OpenCode CLI → API DeepSeek → Modelo LLM → Resposta. Mostra onde ficam os ficheiros locais (CSVs no meu computador), o que viaja pela internet (apenas o texto dos prompts e respostas), e onde fica o modelo (servidor DeepSeek). Explica porque e que dados reais de clientes NUNCA devem ser enviados para o modelo, em contexto de RGPD e regulacao de seguros (ASF).' Guardar com: 'guarda este diagrama num ficheiro chamado mapa_stack.md'. O objetivo e perceber o fluxo de dados e as fronteiras de seguranca antes de construir."},
        ],
        "desafio": {"id": "des0", "titulo": "Kit do Fundador AI", "pontos": 25,
                    "descricao": "⏱ ~30 min | Entregar um founder-kit com: (1) setup_log.md documentando toda a instalacao, (2) 3 prompts reutilizaveis para trabalho atuarial -- escolher 3 destas tarefas e criar um prompt testado para cada: calcular premio de risco, comparar mortalidade observada vs esperada, analisar concentracao de risco por faixa etaria, resumir impacto regulatorio (Solvencia II ou IFRS 17), gerar relatorio de carteira para o board, explicar uma tabua de mortalidade a um nao-atuario, (3) mapa_stack.md com fronteiras de seguranca e RGPD, (4) checklist pessoal de 5 regras de operacao segura com LLMs para trabalho em seguros. PREVIEW DIA 1: amanha vais usar estas ferramentas para pensar como fundador -- escolher que problema atuarial resolver com IA e desenhar o teu primeiro produto. Para submeter: cola um link (Google Drive, pasta partilhada) OU descreve o que fizeste no campo abaixo."},
        "conteudo": {
            "modulo_1": {
                "titulo": "Terminal & Ambiente: Zero a Confortavel",
                "topicos": [
                    {"titulo": "O Que e o Terminal?",
                     "conteudo": "O terminal (ou linha de comandos) e uma janela onde escreves instrucoes diretamente ao computador. No Windows chama-se CMD ou PowerShell (procura 'cmd' no menu Iniciar). No Mac chama-se Terminal (esta em Aplicacoes > Utilitarios). Nao tem botoes nem menus -- escreves um comando, carregas Enter, e o computador executa. Parece assustador, mas com 5 comandos basicos fazes tudo o que precisas."},
                    {"titulo": "Os 5 Comandos Que Precisas",
                     "conteudo": "Estes 5 comandos cobrem 90% do que vais fazer no terminal: (1) cd nome_da_pasta -- entrar numa pasta (ex: cd Documents). (2) cd .. -- voltar atras uma pasta. (3) dir (Windows) ou ls (Mac) -- listar o que esta na pasta atual. (4) mkdir nome -- criar uma pasta nova (ex: mkdir projeto). (5) cls (Windows) ou clear (Mac) -- limpar o ecra do terminal. Bonus: pwd (Mac) ou cd sem argumentos (Windows) -- mostra em que pasta estas agora. Nao precisas de decorar mais nada. O OpenCode ajuda-te com o resto."},
                    {"titulo": "Instalar Programas pelo Terminal",
                     "conteudo": "Programas como o OpenCode instalam-se pelo terminal com um unico comando. Usa-se o npm (Node Package Manager) -- uma ferramenta que descarrega e instala programas automaticamente. Para ter o npm, precisas primeiro de instalar o Node.js (um motor que corre programas -- tu nao o vais usar diretamente, mas o npm vem incluido). PASSO A PASSO: (1) Vai a nodejs.org. (2) Clica no botao verde 'LTS' (versao estavel). (3) Descarrega e instala como qualquer programa (aceita tudo por defeito). (4) IMPORTANTE: fecha o terminal e abre um novo -- sem isto, o npm nao sera reconhecido. (5) Testa escrevendo 'npm --version' -- se mostrar um numero (ex: 10.2.0), esta pronto. No Mac, em alternativa ao npm, podes usar o Homebrew (brew) -- um gestor de pacotes popular. Se der erro de permissoes no Mac, escreve 'sudo' antes do comando (sudo = 'super user do' -- executa com permissoes de administrador, vai pedir a tua password do Mac)."},
                    {"titulo": "Quando Algo Da Erro (E Vai Dar)",
                     "conteudo": "Erros no terminal nao sao motivo de panico. Le sempre a ULTIMA linha da mensagem de erro -- normalmente diz o que esta mal. Os 3 erros mais comuns: (1) 'nao e reconhecido como comando' = o programa nao esta instalado ou o terminal nao sabe onde o encontrar. Isto chama-se problema de PATH -- o PATH e uma lista de pastas onde o computador procura programas. Solucao mais comum: fechar e reabrir o terminal (muitas instalacoes so atualizam o PATH quando abres um terminal novo). (2) 'acesso negado' = precisas de permissoes. No Mac escreve 'sudo' antes do comando (vai pedir password). No Windows: fecha o terminal, clica com o botao direito no icone do CMD/PowerShell e escolhe 'Executar como Administrador'. (3) 'ficheiro nao encontrado' = estas na pasta errada. Usa 'dir' (Windows) ou 'ls' (Mac) para ver onde estas e 'cd nome_da_pasta' para navegar. Dica geral: copia a mensagem de erro e cola no OpenCode -- ele explica o que esta mal e como resolver."},
                ]
            },
            "modulo_2": {
                "titulo": "OpenCode, API Key & Primeiras Instrucoes",
                "topicos": [
                    {"titulo": "O Que e Uma API Key e Como Obter",
                     "conteudo": "Uma API key e como uma senha que identifica quem esta a usar um servico de inteligencia artificial. Para usar o DeepSeek (o LLM do bootcamp), precisas de: (1) Ir a platform.deepseek.com e criar conta com email. (2) No menu lateral, clicar em 'API Keys'. (3) Clicar 'Create new API key' e dar-lhe um nome (ex: 'bootcamp'). (4) Copiar a chave IMEDIATAMENTE -- so aparece uma vez! (5) Guardar num gestor de passwords ou num ficheiro que NAO esta no projeto. (6) Ir a 'Billing' e adicionar credito ($2-5 e suficiente para o bootcamp inteiro). Alternativa: o instrutor pode fornecer uma key partilhada para a turma."},
                    {"titulo": "OpenCode: O Teu Co-Piloto Tecnico",
                     "conteudo": "OpenCode nao e apenas um chat. E o cockpit do bootcamp: le ficheiros do teu computador, executa comandos no terminal, procura documentacao, edita projetos e coordena trabalho tecnico. Quando abres o OpenCode no terminal, aparece uma interface de texto com uma zona onde escreves instrucoes (chamadas 'prompts' -- um prompt e simplesmente o texto/pergunta que envias ao modelo de IA). Tu escreves o que queres em portugues, ele faz o trabalho tecnico. Exemplo: em vez de aprenderes a programar em Python para analisar um CSV (ficheiro de dados em formato de tabela, como um Excel simplificado), dizes ao OpenCode 'abre o ficheiro carteira.csv e diz-me quantas apolices tem capital acima de 100 mil euros'. Ele faz, tu verificas. Para sair do OpenCode, escreve '/exit' ou prime Ctrl+C."},
                    {"titulo": "Configurar a API Key no Ambiente",
                     "conteudo": "A API key nunca vai dentro do codigo. Configura-se como 'variavel de ambiente' -- um valor que o computador guarda em memoria e que qualquer programa pode ler. CONFIGURACAO TEMPORARIA (funciona ate fechares o terminal): No Windows: abre o CMD e escreve set DEEPSEEK_API_KEY=a-tua-chave-aqui. No Mac: abre o Terminal e escreve export DEEPSEEK_API_KEY=a-tua-chave-aqui. CONFIGURACAO PERMANENTE (recomendada -- nao precisas de repetir): No Windows: (1) Abre o menu Iniciar e procura 'Variaveis de ambiente'. (2) Clica em 'Editar variaveis de ambiente do sistema'. (3) Clica 'Variaveis de Ambiente'. (4) Em 'Variaveis do utilizador', clica 'Novo'. (5) Nome: DEEPSEEK_API_KEY, Valor: a-tua-chave. (6) OK em tudo. (7) Fecha e reabre o terminal. No Mac: (1) Abre o Terminal. (2) Escreve: echo 'export DEEPSEEK_API_KEY=a-tua-chave' >> ~/.zshrc (3) Fecha e reabre o Terminal. Depois disto, o OpenCode encontra a key automaticamente sempre que abrires o terminal."},
                    {"titulo": "Primeiro Teste: Confirmar que Tudo Funciona",
                     "conteudo": "Depois de instalar o OpenCode e configurar a API key: (1) Abre o terminal. (2) Escreve 'opencode' e carrega Enter. (3) Se aparecer a interface do OpenCode, esta instalado. (4) Escreve: 'Ola, sou atuario e estou a comecar o bootcamp. Confirma que estas operacional e diz-me que modelo estas a usar.' (5) Se responder, esta tudo pronto. Se der erro, copia a mensagem de erro e procura ajuda -- o mais provavel e a API key estar mal configurada."},
                ]
            },
            "modulo_3": {
                "titulo": "LLMs, Tokens, Custos & Regras de Operacao",
                "topicos": [
                    {"titulo": "LLM vs API vs CLI vs App: Nao Confundir",
                     "conteudo": "Quatro conceitos que parecem iguais mas sao camadas diferentes: O LLM (Large Language Model) e o 'cerebro' -- gera texto e raciocinio. A API e o 'telefone' -- da acesso ao cerebro pela internet. O CLI (Command Line Interface, neste caso OpenCode) e o 'volante' -- a forma de operares o cerebro no teu computador. A App e o 'produto final' -- o que o teu cliente vai usar. Quando algo falha, precisas de saber em que camada esta o problema: o modelo deu resposta errada? A API esta em baixo? O CLI esta mal configurado? A app tem um bug?"},
                    {"titulo": "Tokens, Contexto & Quanto Custa",
                     "conteudo": "LLMs nao leem palavras inteiras -- leem 'tokens' (pedacos de ~4 caracteres). 1 pagina A4 ≈ 500 tokens. O custo do DeepSeek e ~$0.14 por milhao de tokens de input e ~$0.28 por milhao de output. Na pratica: analisar um CSV de 100 linhas custa menos de $0.01. Para o bootcamp inteiro, $2-5 sao suficientes se fores eficiente. O 'contexto' e a quantidade de texto que o modelo 'lembra' numa conversa -- se mandares demasiado, ele esquece o inicio. Dica: resume documentos longos antes de os enviar."},
                     {"titulo": "Prompts Precisos vs Prompts Exploradores",
                     "conteudo": "A qualidade da resposta depende de COMO fazes o pedido. Existem dois estilos fundamentais: PROMPT PRECISO -- pedes numeros exactos, formatos especificos, sem margem para interpretacao. Ex: 'Qual e o valor de qx aos 65 anos? Mostra o numero com 6 casas decimais.' Ideal para: calculos, extrair dados, gerar tabelas, validar resultados. PROMPT EXPLORADOR -- pedes interpretacao, ideias, analogias, cenarios. Ex: 'Olhando para esta tabua de mortalidade, que produtos de seguro faria sentido criar para o mercado portugues?' Ideal para: brainstorming, analise qualitativa, descobrir angulos novos. Regra para atuarios: comecar sempre com prompts precisos para garantir que os dados estao corretos, e so depois usar prompts exploradores para interpretar. Nota tecnica: por tras, os modelos de IA tem um parametro chamado 'temperature' (0=preciso, 1=criativo) que controla esta aleatoriedade. Em ferramentas CLI como o OpenCode, a temperature e configurada pelo provider -- o que tu controlas e o estilo do teu prompt."},
                    {"titulo": "5 Regras de Seguranca para Atuarios",
                     "conteudo": "(1) NUNCA colar dados reais de clientes num LLM -- em Portugal, o RGPD (Regulamento Geral de Protecao de Dados) proibe o envio de dados pessoais para servidores fora da UE sem consentimento explicito. Os servidores do DeepSeek estao na China. Usar sempre dados sinteticos ou anonimizados. (2) Guardar API keys FORA do codigo -- em variaveis de ambiente (que ja aprendeste no Modulo 2) ou em ficheiros .env (um ficheiro de texto simples com chaves, que fica no teu computador mas nunca vai para o repositorio gracas ao .gitignore -- um ficheiro que diz ao sistema quais ficheiros ignorar). (3) Verificar SEMPRE os calculos do LLM -- ele e excelente a estruturar e explicar, mas comete erros numericos. Como atuario, a tua responsabilidade profissional perante a ASF nao muda por usares IA. Confiar, mas verificar. (4) Documentar o que o LLM fez -- para auditoria e compliance, registar que prompts usaste e que outputs obtiveste. Isto sera exigido pelo regulador a medida que a IA entra no sector segurador. (5) Separar ambientes -- o que testas localmente com dados sinteticos nao e o que vai para producao com dados reais. A credibilidade do teu produto para seguros comeca aqui."},
                ]
            }
        }
    },
    {
        "dia": 1,
        "titulo": "De Atuario a Fundador AI-Native",
        "semana": 1,
        "objetivo": "No Dia 0 aprendeste a operar as ferramentas: terminal, OpenCode, API keys, prompts precisos e exploradores. Agora vais usar essas mesmas ferramentas com um novo objetivo: pensar como fundador. Sair da logica de analista interno e entrar na logica de quem cria e vende um produto. Vais reutilizar os dados que ja analisaste (carteira e tabuas), o mapa de stack que construiste e as ideias de produto que geraste no Dia 0 para investigar o que o Prophet (da FIS) resolve, onde ha espaco para uma versao mais simples e moderna (Prophet Lite), e que problema concreto vale a pena atacar primeiro. O trabalho deste dia alimenta diretamente as especificacoes tecnicas do Dia 2.",
        "modulos": ["Vocabulario Novo: Do Mundo Atuarial ao Mundo de Produto", "Porque Criar um Produto em vez de Vender Horas", "Escolher o Ponto de Entrada no Mercado"],
        "exercicios": [
            {"id": "ex1.1", "titulo": "Glossario Pessoal do Fundador", "pontos": 10,
             "descricao": "Depois de ler o Modulo 1, usa o OpenCode para pesquisar e escrever definicoes curtas (1-2 frases, nas tuas palavras) para cada um destes termos: (1) SaaS, (2) MVP, (3) Wedge, (4) Workflow, (5) UX, (6) Feature, (7) Deploy, (8) Incumbent, (9) Posicionamento, (10) Stack. Nota: alguns destes termos ja apareceram no Dia 0 -- Deploy e Stack foram parte do teu mapa_stack.md. Para esses, nao copies a definicao tecnica do Dia 0: reescreve com a perspetiva de produto que aprendeste hoje (ex: Stack nao e so 'as ferramentas que uso', e 'as ferramentas que o meu cliente vai usar'). Para cada termo, acrescenta um exemplo concreto do mundo dos seguros. Formato: tabela com colunas [Termo | Definicao | Exemplo em Seguros]. Guardar como glossario_fundador.md. Este glossario vai ser util para o resto do bootcamp."},
            {"id": "ex1.2", "titulo": "Horas vs Produto -- Porque Construir Software", "pontos": 10,
             "descricao": "Comeca por pensar na tua experiencia do Dia 0: analisaste uma carteira de apolices e uma tabua de mortalidade usando OpenCode em ~25 minutos. Quanto tempo demoraria a fazer a mesma analise manualmente em Excel? Esse contraste e o ponto de partida deste exercicio. Agora usa o OpenCode para pesquisar e resumir: qual a diferenca entre um atuario que vende horas de consultoria e um atuario que vende um produto de software por subscricao (SaaS -- software que o cliente acede pela internet e paga mensalmente)? Pedir ao LLM para comparar em 3 dimensoes: (a) Margem -- quanto sobra de cada euro faturado, (b) Escala -- se podes crescer sem trabalhar proporcionalmente mais horas, (c) Dependencia de tempo -- se paras de trabalhar, o rendimento para? Entregar um documento curto (1 pagina max) com a tabela comparativa e 3 conclusoes pessoais. Na conclusao, usa a tua experiencia concreta do Dia 0 como exemplo de alavanca. Formato: tabela com colunas [Dimensao | Vender Horas | Vender Produto] + 3 bullets de conclusao."},
            {"id": "ex1.3", "titulo": "Analisar o Prophet sem Construir Demais", "pontos": 10,
             "descricao": "Ler o prophet_reference_vida.md (disponivel na pagina de Recursos). Este documento descreve o que o FIS Prophet faz. Criar uma tabela com 3 colunas: [Modulo Prophet | Ponto Forte do Prophet (incumbent = produto dominante no mercado) | Oportunidade para uma versao simples (MVP = versao minima que ja e util)]. Preencher para pelo menos 5 areas: model points, assumptions, motor de projecao, relatorios e governance. O objetivo e perceber onde o Prophet e demasiado grande para copiar e onde uma equipa pequena pode oferecer algo mais simples e mais moderno. Podes usar o OpenCode para ajudar a estruturar a analise."},
            {"id": "ex1.4", "titulo": "Escolher 3 Problemas que Alguem Pagaria para Resolver", "pontos": 10,
             "descricao": "Abre os ficheiros de dados do Dia 0 (carteira_vida_sample.csv e tabua_mortalidade_CSO2017.csv) no OpenCode. Usa um prompt explorador (a tecnica que praticaste no ex0.5) para perguntar: 'Imagina que es o responsavel atuarial de uma seguradora pequena que recebe estes dados todos os trimestres. Que partes deste processo seriam frustrantes, lentas ou arriscadas sem software dedicado?' A partir das respostas e da tua experiencia profissional, lista 3 frustracoes reais em seguros de Vida que um software moderno poderia resolver. Para cada frustacao, preencher: (1) Quem sofre com este problema (que pessoa, que funcao, que tipo de equipa), (2) Com que frequencia acontece (diario, semanal, trimestral), (3) Que impacto tem no negocio (atraso, erro, custo, risco), (4) Porque as solucoes atuais (Excel, Prophet, processos manuais) nao resolvem bem. Exemplo: 'Equipas atuariais pequenas (3-5 pessoas) perdem 2-3 dias por trimestre a montar projecoes em Excel porque nao tem orcamento para Prophet. Impacto: atraso no reporting, erros de copy-paste, dependencia total de uma unica pessoa que sabe como a folha funciona.' Entregar as 3 frustracoes neste formato."},
            {"id": "ex1.5", "titulo": "Memo do Fundador -- O Teu Plano Numa Pagina", "pontos": 10,
             "descricao": "Escrever um documento interno de 1 pagina usando este template: (1) Cliente Ideal -- descrever a empresa e equipa que mais beneficiaria do teu produto (ex: 'consultora atuarial com 5 pessoas que usa Excel para tudo'), (2) Problema Principal -- a frustacao que escolheste do ex1.4 (baseada nos dados reais que analisaste), (3) Ponto de Entrada no Mercado (wedge) -- o primeiro problema pequeno e concreto que vais resolver (ver Modulo 3 para explicacao completa), (4) O que o Prophet Lite Faz Primeiro -- 3 a 5 capacidades iniciais do produto (ex: 'carregar tabuas de mortalidade, correr uma projecao simples, mostrar resultados num painel web'), (5) O que NAO Faz (e porque isso e bom) -- listar pelo menos 5 coisas que deixas de fora de proposito (ex: 'nao faz projecao estocastica, nao cobre IFRS 17, nao suporta multiplos paises'), (6) Argumento de Foco -- em 2-3 frases, explicar porque fazer menos e melhor do que tentar fazer tudo. Dica: no Dia 0 ex0.5 geraste ideias de produto a partir da tabua de mortalidade. Revê essas ideias antes de escrever o memo -- podem ser o ponto de partida para a tua wedge. Usar o OpenCode para rever e melhorar a clareza do memo antes de entregar."},
            {"id": "ex1.6", "titulo": "Quiz de Conceitos do Dia 1", "pontos": 10,
             "descricao": "Responder a estas 12 perguntas por escrito (2-3 frases cada). Podes consultar os modulos e o teu glossario, mas nao uses o OpenCode para responder -- o objetivo e verificar se interiorizaste os conceitos. (1) Qual a diferenca entre vender horas e vender um produto de software? (2) O que significa SaaS e porque e diferente de instalar software no computador? (3) O que e um MVP e porque nao deve ter todas as funcionalidades desde o inicio? (4) Explica o que e uma 'wedge' como se estivesses a explicar a um colega atuario. (5) Porque e que uma equipa pequena pode ter vantagem sobre o Prophet em certos segmentos? (6) O que significa 'posicionamento' de um produto? Da um exemplo. (7) O que e UX e porque importa num produto para atuarios? (8) O que e um 'workflow' no contexto de software? Da um exemplo atuarial. (9) Quem e o 'incumbent' no mercado de software atuarial e quais sao os seus pontos fracos? (10) Porque e que dizer 'nao' a muitas funcionalidades e considerado uma boa estrategia de produto? (11) No Dia 0 usaste prompts precisos e prompts exploradores. Qual dos dois estilos e mais util para descobrir oportunidades de produto? E para validar numeros? (12) Olhando para o mapa de stack que construiste no Dia 0 (mapa_stack.md), que camada dessa stack e visivel para o teu futuro cliente e qual e invisivel? Porque e que isso importa para decisoes de produto?"},
            {"id": "ex1.7", "titulo": "Lab Streamlit -- Explicar Variacoes de Reporting com AI", "pontos": 10,
             "descricao": "Abrir a pagina Exercicios > Dia 1 e usar o novo lab interativo com os ficheiros reporting_vida_q4_2025.csv, reporting_vida_q1_2026.csv e manual_reporting_tasks.csv. Primeiro, explora os dados no proprio Streamlit: usa os filtros, observa os metric cards e identifica onde o lucro piorou e onde a reserva subiu mais. Depois usa o OpenCode para responder a 4 perguntas: (1) Que 3 segmentos explicam a maior parte da deterioracao do lucro tecnico entre Q4 2025 e Q1 2026? (2) O aumento da reserva parece vir mais de sinistralidade, lapse ou mix de carteira? Justifica com numeros. (3) Se fosses Head of Actuarial, que nota de 5 linhas enviarias ao CFO para explicar a variacao trimestral? (4) Onde esta o trabalho manual repetitivo neste processo e como o Prophet Lite poderia automatiza-lo? Entrega: um ficheiro markdown chamado analise_variacao_trimestral.md com respostas curtas e uma proposta de feature AI para reduzir este trabalho."},
        ],
        "desafio": {"id": "des1", "titulo": "Tese de Produto -- Convencer o Primeiro Cliente", "pontos": 25,
                    "descricao": "Entregar um documento de 2 paginas escrito como se fosse para convencer o teu primeiro cliente potencial (nao um investidor -- uma pessoa real que usaria o produto). Deve incluir: (1) Para Quem E -- descrever o tipo de equipa e empresa que seria o teu primeiro cliente, quantas existem no mercado (basta uma estimativa com logica), (2) O Problema Hoje -- descrever o processo (workflow) que estas equipas seguem atualmente e o que o torna lento, caro ou arriscado, (3) O Que o Prophet Lite Faz -- qual parte do Prophet vais replicar primeiro e como (projecao deterministica? upload de assumptions? painel de resultados?), (4) O Que o Prophet Lite Faz Que o Prophet Nao Faz -- a tua vantagem: explicacao automatica dos resultados via inteligencia artificial (copiloto AI), interface web moderna e acessivel (UX), e ligacao de documentos ao calculo (document drop = arrastar PDFs para a app e o sistema liga-os ao trabalho), (5) Prova de Conceito com Dados Reais -- usando os ficheiros do Dia 0 (carteira_vida_sample.csv e tabua_mortalidade_CSO2017.csv), mostra um exemplo concreto do que o produto faria com estes dados. Inclui numeros reais da tua analise do Dia 0 (ex: numero de apolices, capital total, distribuicao por idade) para dar credibilidade a tese, (6) Como Encontras o Primeiro Cliente -- um plano concreto em 3 passos para chegar a essa pessoa (ex: contactar no LinkedIn, pedir uma reuniao de 15 minutos, mostrar um prototipo), (7) 3 Riscos e Respostas -- tres coisas que podem correr mal (ex: 'ninguem quer pagar', 'o produto e demasiado simples', 'um concorrente copia-nos') e o que farias em cada caso. Esta tese vai alem do memo do ex1.5: o memo descreve o que fazes; a tese argumenta porque funciona, mostra dados reais, e explica como encontras quem o usa."},
        "conteudo": {
            "modulo_1": {
                "titulo": "Vocabulario Novo: Do Mundo Atuarial ao Mundo de Produto",
                "topicos": [
                    {"titulo": "Do Tecnico ao Produto -- Uma Camada Nova", "conteudo": "No Dia 0 aprendeste o vocabulario tecnico do builder: terminal, API, CLI, tokens, temperatura, prompt. Hoje adicionas uma camada nova -- o vocabulario de produto. Nao substitui o que ja sabes: acrescenta. Um SaaS usa uma stack (que ja conheces) para resolver um problema que um cliente paga para resolver. Este modulo liga os dois mundos."},
                    {"titulo": "SaaS, MVP e Feature", "conteudo": "SaaS (Software as a Service) e software que o cliente acede pela internet e paga por subscricao mensal ou anual, em vez de instalar no computador. MVP (Minimum Viable Product) e a versao mais simples do produto que ja e util o suficiente para alguem querer usa-la. Feature e uma capacidade especifica do software (ex: 'carregar uma tabua de mortalidade' e uma feature). Nota: no Dia 0 aprendeste que o OpenCode e um CLI e o DeepSeek e o LLM. No teu produto, o LLM e uma feature -- e o copiloto AI que explica resultados. O CLI nao e visivel para o cliente."},
                    {"titulo": "Wedge, Incumbent e Posicionamento", "conteudo": "Wedge e o ponto de entrada no mercado -- o problema pequeno e concreto que resolves primeiro, antes de expandir. Pensa como a ponta fina de uma cunha que abre caminho. Incumbent e o produto dominante que ja existe no mercado (neste caso, o FIS Prophet). Posicionamento e como descreves o teu produto em relacao ao incumbent: o que fazes melhor, para quem, e porque."},
                    {"titulo": "Workflow, UX, Deploy e Stack -- Com Olhos de Produto", "conteudo": "Ja conheces Stack e Deploy do mapa_stack.md que fizeste no Dia 0 (Terminal -> OpenCode -> API -> LLM -> Resposta). Agora ve esses mesmos conceitos com olhos de produto: a tua Stack e o que constroies; o Deploy e o momento em que o cliente passa a poder usar o que construiste; o Workflow e a sequencia de tarefas que o cliente faz dentro da tua app; o UX e o quao facil ou frustrante e para ele percorrer esse workflow. Um atuario que sabe o que e uma stack mas nao pensa em UX constroi ferramentas que so ele proprio consegue usar."},
                ]
            },
            "modulo_2": {
                "titulo": "Porque Criar um Produto em vez de Vender Horas",
                "topicos": [
                    {"titulo": "Ja Provaste a Alavanca no Dia 0", "conteudo": "No ex0.4 do Dia 0 analisaste uma carteira de apolices -- numero de apolices, capital total segurado, idade media, percentagem de fumadores -- em cerca de 25 minutos usando o OpenCode. Faz as contas: um analista a fazer o mesmo trabalho manualmente em Excel demoraria provavelmente meio dia. Isso e alavanca em acao. Agora imagina que essa analise fosse um produto que 50 equipas atuariais usassem todos os trimestres. Nao precisarias de fazer o trabalho 50 vezes -- o produto fazia-o por ti, enquanto dormes."},
                    {"titulo": "O Que as Seguradoras Realmente Compram", "conteudo": "As seguradoras nao compram formulas atuariais -- ja as tem. Compram velocidade (fazer em horas o que demorava dias), controlo (saber quem fez o que e quando), rastreabilidade (poder explicar cada numero ao regulador), e menos dependencia de folhas de calculo que so uma pessoa entende. No Dia 0 viste isso em primeira mao: o OpenCode nao so calculou -- explicou os resultados em linguagem clara. Essa capacidade de explicar e um dos maiores buracos no Prophet atual."},
                    {"titulo": "Horas vs Produto -- A Aritmetica", "conteudo": "Um atuario consultor vende horas: 500 EUR/dia, limitado a ~220 dias uteis por ano = maximo ~110.000 EUR. Um atuario com um produto de software (SaaS) cobra por subscricao: 200 EUR/mes a 50 clientes = 120.000 EUR/ano, sem limite de horas e com margem crescente. A diferenca chama-se alavanca -- a capacidade de ganhar mais sem trabalhar proporcionalmente mais. Os 3 prompts reutilizaveis que criaste no des0 do Dia 0 sao um embriao dessa alavanca: escreveste uma vez, podes usar centenas de vezes."},
                    {"titulo": "Mentalidade de Quem Cria Produto", "conteudo": "Pensar como criador de produto significa escolher resolver um problema pequeno muito bem, em vez de tentar resolver tudo razoavelmente. Significa pedir a pessoas reais que experimentem o que construiste e ouvir o que dizem. E significa aceitar que a primeira versao vai ser imperfeita -- e isso e normal e esperado. No Dia 0 usaste o OpenCode para analisar dados reais e geraste ideias de produto no ex0.5. Esse momento -- 'isto podia ser um produto' -- e o instinto que vais agora aprender a disciplinar."},
                ]
            },
            "modulo_3": {
                "titulo": "Escolher o Ponto de Entrada no Mercado",
                "topicos": [
                    {"titulo": "O Que e uma Wedge (Cunha de Mercado)", "conteudo": "Wedge e o primeiro problema que o teu produto resolve. Em vez de competir com o Prophet inteiro (que tem centenas de funcionalidades construidas ao longo de 20+ anos), escolhes uma fracao do problema e fazes melhor do que qualquer alternativa. Exemplo: em vez de cobrir todos os tipos de seguro, cobres apenas temporario (term life) com uma interface web clara e uma explicacao automatica dos resultados. No ex0.5 do Dia 0 fizeste exatamente isto sem saber: pediste ao OpenCode para interpretar dados de mortalidade e sugerir 3 ideias de produto. Cada uma dessas ideias e um candidato a wedge."},
                    {"titulo": "Analisar o Prophet para Decidir o Que Replicar", "conteudo": "O document prophet_reference_vida.md (na pagina de Recursos) descreve as 5 areas centrais do Prophet: model points, assumptions, motor de projecao, relatorios e governance. O teu MVP (versao minima util) deve escolher uma fracao pequena destas e faze-la funcionar muito bem. A referencia ajuda-te a decidir o que vale a pena incluir e o que deves deixar para depois. Repara: os dados que analisaste no Dia 0 (carteira_vida_sample.csv) sao precisamente model points -- a primeira area do Prophet. Ja tens experiencia pratica com o conceito."},
                    {"titulo": "O Que Deixar de Fora (e Porque Isso e Bom)", "conteudo": "Cobertura regulatoria total (ex: IFRS 17, Solvencia II completo), projecao estocastica, multiplos paises e bibliotecas gigantes de produtos sao distracoes para quem esta a comecar. Cada capacidade que adias e tempo que ganhas para entregar algo util ao primeiro cliente. No mundo de produto, dizer 'nao' a muita coisa e uma decisao estrategica, nao uma fraqueza. No Dia 0 aprendeste uma regra parecida para prompts: nao pedir tudo ao mesmo tempo. Um prompt focado da melhores resultados do que um prompt que tenta resolver dez coisas de uma vez. O mesmo principio aplica-se ao produto."},
                    {"titulo": "A Wedge Sugerida e o Primeiro Cliente", "conteudo": "A wedge sugerida para este bootcamp: permitir carregar tabuas de mortalidade e lapse, carregar dados de apolices, correr uma projecao deterministica para seguros de Vida, mostrar resultados num painel web, e ter um assistente AI que explica o que o motor calculou. Repara que ja usaste duas destas pecas no Dia 0 -- a tabua_mortalidade_CSO2017.csv e a carteira_vida_sample.csv. O produto que vais construir vai transformar essa experiencia manual do Dia 0 num workflow automatizado para o teu cliente. O primeiro cliente pode ser uma equipa atuarial pequena (3-10 pessoas), uma consultora, ou uma seguradora que ainda usa Excel para tudo. Amanha (Dia 2) vais transformar estas ideias em especificacoes tecnicas detalhadas."},
                ]
            }
        }
    },
    {
        "dia": 2,
        "titulo": "Specs com Speckit -- Diz ao LLM o Que Construir",
        "semana": 1,
        "objetivo": "Aprender a trabalhar por especificacao. Usar Speckit, spec.md e constitution.md para transformar ideias vagas em instrucoes claras que o LLM consegue implementar e que o fundador consegue validar.",
        "modulos": ["Spec-Driven Development com Speckit", "Acceptance Criteria, Git & Iteracao"],
        "exercicios": [
            {"id": "ex2.1", "titulo": "Spec para Upload de Assumptions", "pontos": 10,
             "descricao": "Usar template_spec.md para descrever uma feature de upload e validacao de tabuas de mortalidade, lapse e discount. Incluir inputs, erros esperados, validacoes e output esperado."},
            {"id": "ex2.2", "titulo": "Spec para Document Drop", "pontos": 10,
             "descricao": "Especificar a feature onde o utilizador arrasta PDFs ou imagens e a app classifica, extrai metadados e guarda informacao para pesquisa posterior."},
            {"id": "ex2.3", "titulo": "Auditar uma Spec com GLM-5 e OpenCode", "pontos": 10,
             "descricao": "Pedir a GLM-5 para criar um coding plan a partir da spec e ao OpenCode para encontrar ambiguidades, edge cases e criterios de aceite em falta."},
        ],
        "desafio": {"id": "des2", "titulo": "Pacote de Especificacao MVP", "pontos": 25,
                    "descricao": "Entregar spec.md, constitution.md e checklist de aceite para o teu Prophet Lite. O pacote deve ser claro o suficiente para um LLM comecar a gerar o projeto sem te fazer perguntas essenciais."},
        "conteudo": {
            "modulo_1": {
                "titulo": "Spec-Driven Development com Speckit",
                "topicos": [
                    {"titulo": "A Skill Central", "conteudo": "A grande vantagem de um founder com LLMs nao e velocidade a programar. E a capacidade de descrever com clareza o comportamento que quer."},
                    {"titulo": "Speckit como Estrutura", "conteudo": "Speckit ajuda a transformar requisitos dispersos em blocos claros: objetivo, fluxos, validacoes, edge cases, criterios de aceite e entregaveis."},
                    {"titulo": "Boa Spec, Mau Codigo Evitado", "conteudo": "Muitos erros atribuimos ao modelo quando, na verdade, a instrucao estava vaga. Uma boa spec reduz retrabalho e melhora a qualidade do output."},
                    {"titulo": "Escrever para Maquina e para Equipa", "conteudo": "A spec serve o LLM hoje e uma equipa humana amanha. E documentacao operacional, nao papel burocratico."},
                ]
            },
            "modulo_2": {
                "titulo": "Acceptance Criteria, Git & Iteracao",
                "topicos": [
                    {"titulo": "Constitution.md", "conteudo": "O constitution define regras globais: convencoes de arredondamento, assumptions de referencia, politicas de validacao e principios de interface. Evita inconsistencias entre modulos."},
                    {"titulo": "Acceptance Criteria", "conteudo": "Cada feature deve responder a uma pergunta simples: como sei que isto esta feito? Sem essa resposta, o LLM vai produzir algo plausivel mas dificil de aprovar."},
                    {"titulo": "Git como Memoria de Decisao", "conteudo": "Nao precisas de dominar Git em profundidade, mas precisas de o usar para guardar versoes de specs, prompts e iteracoes relevantes."},
                    {"titulo": "Iterar sem Perder o Norte", "conteudo": "O ciclo ideal e curto: escrever spec, gerar, rever, corrigir, documentar. A velocidade vem da clareza, nao da pressa."},
                ]
            }
        }
    },
    {
        "dia": 3,
        "titulo": "Dados, JSON & APIs -- A Linguagem do Produto",
        "semana": 1,
        "objetivo": "Dar ao atuario literacy suficiente para operar software moderno: perceber CSV, JSON e YAML, fazer uma API call, ler uma resposta, e mapear o fluxo de dados do produto sem precisar de ser programador tradicional.",
        "modulos": ["Dados Estruturados sem Drama", "APIs, Docs & Contratos de Integracao"],
        "exercicios": [
            {"id": "ex3.1", "titulo": "Inspecionar Inputs Reais do Produto", "pontos": 10,
             "descricao": "Abrir carteira_apolices_vida.csv, tabua_mortalidade_CSO2017.csv, taxas_resgate.csv e yield_curve_ECB.csv. Identificar o papel de cada ficheiro no MVP e registar 5 regras de validacao para cada um."},
            {"id": "ex3.2", "titulo": "Primeira API Call com Proposito", "pontos": 10,
             "descricao": "Executar uma chamada de API a um modelo LLM ou a um servico simples, documentando endpoint, payload JSON, resposta e erros mais comuns."},
            {"id": "ex3.3", "titulo": "Definir o Contrato de Dados", "pontos": 10,
             "descricao": "Criar um schema simples para model points, assumptions e run results. O objetivo e saber que dados entram, que dados saem e como isso liga ao frontend."},
        ],
        "desafio": {"id": "des3", "titulo": "Mapa de Integracao do MVP", "pontos": 25,
                    "descricao": "Entregar um integration-pack com 3 contratos: model_points.json, assumptions_schema.json e run_result.json, mais uma nota a explicar como um utilizador nao-tecnico os alimenta via interface."},
        "conteudo": {
            "modulo_1": {
                "titulo": "Dados Estruturados sem Drama",
                "topicos": [
                    {"titulo": "CSV, JSON e YAML", "conteudo": "Estas estruturas sao a lingua do produto. Um fundador AI-native nao precisa de saber programar tudo, mas precisa de reconhecer formatos, campos obrigatorios e erros tipicos."},
                    {"titulo": "Model Points como Produto", "conteudo": "Uma tabela de apolices nao e apenas um dataset. E uma interface de entrada para o motor. Isso muda a forma como defines colunas, validacoes e feedback ao utilizador."},
                    {"titulo": "Assumptions como Ativo", "conteudo": "Mortality, lapse e discount tables sao inputs criticos do negocio. Devem ser versionados, validados e apresentados com cuidado na app."},
                    {"titulo": "Schemas como Guardrails", "conteudo": "O schema e uma das melhores formas de tornar um produto com LLMs mais robusto: limita ambiguidades e facilita automacao."},
                ]
            },
            "modulo_2": {
                "titulo": "APIs, Docs & Contratos de Integracao",
                "topicos": [
                    {"titulo": "Como Ler Docs sem Perder Tempo", "conteudo": "Nao e preciso ler tudo. Procurar auth, endpoint, exemplo de request, exemplo de response, erros, limites e preco costuma bastar para comecar."},
                    {"titulo": "HTTP em Linguagem Clara", "conteudo": "Uma API call e um pedido com estrutura. Saber ler um request e uma response e o suficiente para conversar com ferramentas e integrar servicos."},
                    {"titulo": "Registar o Que Funcionou", "conteudo": "Cada chamada que funciona deve virar nota reutilizavel. Isto reduz friccao e cria uma biblioteca interna de operacao para o fundador."},
                    {"titulo": "A Ponte para a App", "conteudo": "Os dados nao existem em abstrato. Eles ligam uploads, calculos, dashboards, copiloto e integrações futuras. Pensar por contratos ajuda a escalar melhor."},
                ]
            }
        }
    },
    {
        "dia": 4,
        "titulo": "Escolher o Melhor LLM para Cada Tarefa",
        "semana": 1,
        "objetivo": "Comparar DeepSeek, GLM-5 e o workflow com OpenCode de forma pragmatica. Aprender a avaliar modelos por tarefa, custo, clareza, consistencia e utilidade para construir um produto real.",
        "modulos": ["Ler Model Cards e Documentacao", "Benchmarking e Avaliacao de Modelos"],
        "exercicios": [
            {"id": "ex4.1", "titulo": "Mesma Tarefa, Modelos Diferentes", "pontos": 10,
             "descricao": "Dar o mesmo prompt a GLM-5 e DeepSeek: rever uma spec de assumptions upload, sugerir validacoes e simplificar o texto para um utilizador nao tecnico. Comparar outputs com uma rubrica."},
            {"id": "ex4.2", "titulo": "Ler Docs com Intencao", "pontos": 10,
             "descricao": "Ler uma pagina de docs de um modelo ou API e extrair: janela de contexto, custos, structured output, tool use, limites, latencia e exemplos."},
            {"id": "ex4.3", "titulo": "Mini Scorecard LLM", "pontos": 10,
             "descricao": "Criar uma tabela de comparacao para 3 tarefas do bootcamp: planear uma feature, resumir um memo atuarial e sugerir uma API call. Avaliar acao, clareza, fiabilidade e custo."},
        ],
        "desafio": {"id": "des4", "titulo": "Playbook de Model Selection", "pontos": 25,
                    "descricao": "Entregar um playbook com: qual modelo usas para planear, qual usas para construir, qual usas para segunda opiniao e qual usas para explicacao ao cliente ou equipa."},
        "conteudo": {
            "modulo_1": {
                "titulo": "Ler Model Cards e Documentacao",
                "topicos": [
                    {"titulo": "Modelos Nao Sao Todos Iguais", "conteudo": "Uns planeiam melhor, outros escrevem melhor, outros sao mais baratos ou mais previsiveis. O founder precisa de escolher, nao de adivinhar."},
                    {"titulo": "O Que Importa nas Docs", "conteudo": "Structured output, custos, janela de contexto, tool use, limites de rate e exemplos contam mais no dia a dia do que benchmarks abstratos."},
                    {"titulo": "Evitar Fe no Primeiro Output", "conteudo": "A competencia chave e comparar respostas e perceber qual serve melhor o trabalho que tens em maos."},
                    {"titulo": "OpenCode como Orquestrador", "conteudo": "OpenCode pode ser o cockpit enquanto GLM-5 e DeepSeek funcionam como raciocinadores, revisores ou simplificadores conforme a tarefa."},
                ]
            },
            "modulo_2": {
                "titulo": "Benchmarking e Avaliacao de Modelos",
                "topicos": [
                    {"titulo": "Benchmark por Workflow", "conteudo": "Comparar modelos faz mais sentido quando usas tarefas reais: rever specs, explicar resultados, validar documentos e propor proximos passos."},
                    {"titulo": "Rubrica Repetivel", "conteudo": "Uma boa rubrica mede utilidade, acao, fiabilidade, custo e consistencia. Isto ajuda a construir um stack sustentavel e nao dependente de hype."},
                    {"titulo": "Escolha por Papel", "conteudo": "Podes usar um modelo para planeamento, outro para execucao e outro para explicacao. O stack ideal e combinado, nao monolitico."},
                    {"titulo": "Registo de Decisao", "conteudo": "Guardar porque escolheste um modelo hoje ajuda a rever custos e qualidade quando o produto comecar a ser usado em serio."},
                ]
            }
        }
    },
    {
        "dia": 5,
        "titulo": "Prophet Lite -- O Que Replicar e O Que Ignorar",
        "semana": 1,
        "objetivo": "Transformar a referencia do Prophet numa arquitetura pequena e credivel. Perceber que o MVP nao vende por ter tudo: vende por resolver bem um workflow central com controlo e clareza.",
        "modulos": ["Anatomia do Prophet", "Definir o MVP com Governanca"],
        "exercicios": [
            {"id": "ex5.1", "titulo": "Mapa de Modulos Prophet -> MVP", "pontos": 10,
             "descricao": "Com base em prophet_reference_vida.md, mapear modulos core do Prophet para uma versao simplificada: inputs, assumptions, projection, results, governance, docs."},
            {"id": "ex5.2", "titulo": "Definir User Roles e Audit Trail", "pontos": 10,
             "descricao": "Escolher os utilizadores do MVP (ex: admin, actuary, reviewer, viewer) e listar o que deve ficar auditado: uploads, versoes, runs, erros e overrides."},
            {"id": "ex5.3", "titulo": "Escolher o Escopo Certo", "pontos": 10,
             "descricao": "Escrever uma lista explicita do que fica fora do MVP: estocastico, multiplas geografias, health completo, accounting, ML profundo ou outra tentacao de scope creep."},
        ],
        "desafio": {"id": "des5", "titulo": "Blueprint do Prophet Lite", "pontos": 25,
                    "descricao": "Entregar um blueprint com: modulos MVP, user roles, fluxos principais, itens fora de scope, e explicacao de porque esta versao pequena pode ser vendida ou demonstrada com credibilidade."},
        "conteudo": {
            "modulo_1": {
                "titulo": "Anatomia do Prophet",
                "topicos": [
                    {"titulo": "Core Jobs", "conteudo": "Prophet existe para organizar model points, assumptions, runs, outputs e governance. Essa e a espinha que importa compreender."},
                    {"titulo": "Porque o Mercado Confia", "conteudo": "A forca do incumbent nao e apenas calculo. E repetibilidade, audit trail, approvals, run management e integracao com reporting."},
                    {"titulo": "Onde um MVP Ganha", "conteudo": "Um produto novo ganha quando e mais simples, mais claro, mais rapido a usar e mais facil de explicar do que uma suite pesada."},
                    {"titulo": "Prophet Lite", "conteudo": "A proposta deste bootcamp e um workspace pequeno para Vida: assumptions, model points, run deterministic, resultados, copiloto AI e memos/documentos ligados ao trabalho."},
                ]
            },
            "modulo_2": {
                "titulo": "Definir o MVP com Governanca",
                "topicos": [
                    {"titulo": "Governanca desde o Dia 1", "conteudo": "Mesmo um MVP precisa de versionamento, validacao, logs e no minimo um rasto claro do que foi usado em cada run."},
                    {"titulo": "User Roles", "conteudo": "O produto nao e so um motor. E tambem uma experiencia para quem sobe ficheiros, revê assumptions, consulta resultados e faz auditoria."},
                    {"titulo": "Scope como Vantagem", "conteudo": "Dizer nao a muita coisa faz parte do design. O MVP deve caber em 3 dias de build local mais deploy, nao numa aspiracao indefinida."},
                    {"titulo": "Modulos Essenciais", "conteudo": "Upload de assumptions, upload de model points, projection deterministic, dashboard de resultados, document drop, AI copilot e audit basics."},
                ]
            }
        }
    },
    {
        "dia": 6,
        "titulo": "Document Drop, OCR & Memoria do Produto",
        "semana": 2,
        "objetivo": "Transformar documentos em vantagem competitiva. Desenhar e prototipar o fluxo onde PDFs, imagens e memos sao classificados, extraidos, guardados e pesquisados como memoria operacional do produto.",
        "modulos": ["OCR, Extracao & Metadados", "RAG, Pesquisa e Review Humano"],
        "exercicios": [
            {"id": "ex6.1", "titulo": "Classificar Documentos do Bootcamp", "pontos": 10,
             "descricao": "Pegar em 5 documentos do conjunto existente (PDFs, imagens, memos ou clausulados) e definir para cada um: tipo, entidade de negocio, campos chave e risco de erro."},
            {"id": "ex6.2", "titulo": "Schema de Extracao", "pontos": 10,
             "descricao": "Desenhar um schema JSON para o document drop com metadata minima: doc_type, product, policy_id opcional, effective_date, extracted_fields, confidence e reviewer_status."},
            {"id": "ex6.3", "titulo": "Primeiro RAG Util", "pontos": 10,
             "descricao": "Criar um mini fluxo com ChromaDB ou equivalente para guardar texto de documentos e permitir perguntas como: 'qual a versao mais recente do memo?' ou 'o que mudou nesta assumption?'"},
        ],
        "desafio": {"id": "des6", "titulo": "Knowledge Workspace", "pontos": 25,
                    "descricao": "Entregar o desenho do modulo de document drop com pipeline, schema, regras de review humana, e 5 queries de negocio que o utilizador deve conseguir fazer depois do upload."},
        "conteudo": {
            "modulo_1": {
                "titulo": "OCR, Extracao & Metadados",
                "topicos": [
                    {"titulo": "Documentos como Input de Produto", "conteudo": "Memos, clausulados, especificacoes e PDFs nao sao anexo morto. Podem virar estrutura reutilizavel dentro do produto."},
                    {"titulo": "Template-First, AI-Second", "conteudo": "Quando houver formato repetivel, usa regras e templates. Usa LLM para lidar com variacao, texto livre e sumarizacao."},
                    {"titulo": "Metadata que Vale Ouro", "conteudo": "Tipo, data efetiva, produto, versao, owner e confidence sao mais importantes do que tentar extrair tudo de uma vez."},
                    {"titulo": "Extrair para Usar Depois", "conteudo": "O valor nao esta so em ler um PDF hoje. Esta em encontra-lo, relaciona-lo e reutiliza-lo meses depois num workflow real."},
                ]
            },
            "modulo_2": {
                "titulo": "RAG, Pesquisa e Review Humano",
                "topicos": [
                    {"titulo": "RAG como Memoria", "conteudo": "RAG ajuda a recuperar contexto de documentos sem fingir que o modelo sabe tudo. E especialmente util para clausulados, memos e docs internos."},
                    {"titulo": "Review Humano e Obrigatorio", "conteudo": "Em seguros, um bom fluxo de review vale mais do que promessas de automacao total. O objetivo e acelerar verificacao, nao eliminar controlo."},
                    {"titulo": "Busca que Faz Sentido", "conteudo": "O utilizador quer encontrar rapido por produto, data, versao, keyword ou pergunta em linguagem natural. Esse e o UX target do modulo."},
                    {"titulo": "Diferenciador do Produto", "conteudo": "Muita gente tenta construir calculadoras. Menos gente transforma o caos documental em memoria operacional pesquisavel. Aqui ha vantagem competitiva."},
                ]
            }
        }
    },
    {
        "dia": 7,
        "titulo": "UX Mobile-First, Pricing & Plano de Build",
        "semana": 2,
        "objetivo": "Fechar o lado fundador antes de programar: jornada do utilizador, experiencia mobile-first, posicionamento, pricing e checklist de build local. O objetivo e chegar ao Dia 8 com um plano executavel.",
        "modulos": ["UX, Jornadas & Interface do MVP", "Pricing, Landing Page & Build Pack"],
        "exercicios": [
            {"id": "ex7.1", "titulo": "Desenhar 3 Fluxos Core", "pontos": 10,
             "descricao": "Desenhar os fluxos mobile-first para: upload de assumptions, correr projection e fazer document drop. Cada fluxo deve caber em poucos passos e ter mensagens de erro claras."},
            {"id": "ex7.2", "titulo": "Landing Copy e Posicionamento", "pontos": 10,
             "descricao": "Escrever hero, proposta de valor, 3 bullets de resultados e 1 CTA para a tua landing page. Usar LLM para gerar variantes e escolher a mais clara."},
            {"id": "ex7.3", "titulo": "Pricing Hipotetico", "pontos": 10,
             "descricao": "Definir 3 tiers simples para o teu SaaS e explicar o que muda entre eles: volume de runs, numero de utilizadores, document storage, copiloto AI ou exportacoes."},
        ],
        "desafio": {"id": "des7", "titulo": "Founder Launch Pack", "pontos": 25,
                    "descricao": "Entregar o build pack final com: spec consolidada, mapa de ecras mobile-first, landing copy, pricing, checklist de validacao e plano de build dos Dias 8-10."},
        "conteudo": {
            "modulo_1": {
                "titulo": "UX, Jornadas & Interface do MVP",
                "topicos": [
                    {"titulo": "Mobile-First por Disciplina", "conteudo": "Se o produto for claro no telemovel, normalmente tambem sera claro no desktop. Mobile-first obriga a foco, pouco texto e acao evidente."},
                    {"titulo": "3 Ecras que Importam", "conteudo": "Input, resultado e detalhe/documento. Quase todo o MVP pode ser pensado a partir destes tres momentos."},
                    {"titulo": "UX para Utilizador Nao Tecnico", "conteudo": "Upload simples, labels claras, validacoes visiveis, explicacoes curtas e chamadas para acao sem jargao tecnico."},
                    {"titulo": "Design como Credibilidade", "conteudo": "No software B2B, boa UX nao e vaidade. E sinal de cuidado, reduz erro operacional e aumenta confianca no produto."},
                ]
            },
            "modulo_2": {
                "titulo": "Pricing, Landing Page & Build Pack",
                "topicos": [
                    {"titulo": "Vender Antes de Sofisticar", "conteudo": "Um produto simples mas bem posicionado vale mais do que um sistema complexo sem narrativa clara."},
                    {"titulo": "Landing Page como Teste", "conteudo": "A landing page obriga-te a responder: quem serve, que problema resolve e porque a tua abordagem AI-native e melhor."},
                    {"titulo": "Pricing como Escolha de Cliente", "conteudo": "O preco tambem define para quem o produto e feito. Nao e apenas uma conta financeira; e posicionamento."},
                    {"titulo": "Fechar o Plano de Build", "conteudo": "No final do Dia 7 deves saber o que vai existir localmente, o que sera adiado e o que tens de validar antes do deploy."},
                ]
            }
        }
    },
    {
        "dia": 8,
        "titulo": "Build Local -- Motor Deterministico Prophet Lite",
        "semana": 2,
        "objetivo": "Construir localmente o nucleo matematico do MVP: carregar assumptions, ler model points, projetar cash flows e devolver resultados verificaveis. O foco e um motor pequeno, testavel e explicavel.",
        "modulos": ["Assumptions, Model Points & Projection", "Validacao, Testes & Explicabilidade"],
        "exercicios": [
            {"id": "ex8.1", "titulo": "Carregar Inputs do Motor", "pontos": 10,
             "descricao": "Implementar com ajuda do LLM o carregamento de tabua_mortalidade_CSO2017.csv, taxas_resgate.csv, yield_curve_ECB.csv e model points. Validar colunas obrigatorias e erros de formato."},
            {"id": "ex8.2", "titulo": "Projecao Base de Vida", "pontos": 10,
             "descricao": "Gerar a projecao deterministica de um temporario simples com premio, beneficio e desconto. Comparar um caso com o excel_validacao_cashflow.md e documentar diferencas."},
            {"id": "ex8.3", "titulo": "Testes e Output Legivel", "pontos": 10,
             "descricao": "Criar testes minimos para o motor e garantir que o output e legivel por humano e por app: cash flows, reserve proxy, profit metricas simples e mensagens de erro claras."},
        ],
        "desafio": {"id": "des8", "titulo": "Motor Local v0.1", "pontos": 25,
                    "descricao": "Entregar um motor local funcional que aceita inputs simples, corre a projecao base, devolve resultados estruturados e passa num conjunto minimo de testes de confianca."},
        "conteudo": {
            "modulo_1": {
                "titulo": "Assumptions, Model Points & Projection",
                "topicos": [
                    {"titulo": "O Motor Nao Tem de Fazer Tudo", "conteudo": "O objetivo do bootcamp e um motor deterministic simples para 1-2 produtos. Credibilidade vem de foco e validacao, nao de complexidade."},
                    {"titulo": "Inputs com Regras", "conteudo": "Um bom produto falha bem: informa o que falta, que coluna esta errada e como corrigir. Isso faz parte do build, nao e detalhe."},
                    {"titulo": "Cash Flows Primeiro", "conteudo": "Antes de pensar em features sofisticadas, o motor tem de conseguir produzir cash flows coerentes e consistentes com a spec."},
                    {"titulo": "Assumptions como Camada Separada", "conteudo": "Separar assumptions da logica de projection torna o produto mais governavel e mais perto do mindset Prophet."},
                ]
            },
            "modulo_2": {
                "titulo": "Validacao, Testes & Explicabilidade",
                "topicos": [
                    {"titulo": "Trust but Verify", "conteudo": "Mesmo quando o LLM gera o codigo, o fundador valida com casos de referencia, testes e outputs transparentes."},
                    {"titulo": "Testes Minimos que Salvam Projetos", "conteudo": "Casos simples, valores esperados e erros bem tratados evitam demos bonitas com logica fraca por baixo."},
                    {"titulo": "Output para App", "conteudo": "O resultado do motor deve ser um objeto estruturado que o frontend consiga consumir sem improvisacao."},
                    {"titulo": "Explicar o que o Motor Fez", "conteudo": "Se nao conseguires explicar ao utilizador que assumptions foram usadas e como o run correu, o produto perde valor rapidamente."},
                ]
            }
        }
    },
    {
        "dia": 9,
        "titulo": "Build Local -- App, Copiloto AI & Documentos",
        "semana": 2,
        "objetivo": "Envolver o motor numa experiencia de produto: Streamlit local, uploads, dashboard de resultados, copiloto AI e document drop ligado a memoria do sistema.",
        "modulos": ["Frontend Local e Fluxo End-to-End", "Copiloto AI, Busca e Diferenciacao"],
        "exercicios": [
            {"id": "ex9.1", "titulo": "Construir a Shell da App", "pontos": 10,
             "descricao": "Ligar num app local os 3 fluxos core: upload assumptions, upload model points e correr projection. Mostrar estados de carregamento, validacao e resultados."},
            {"id": "ex9.2", "titulo": "Adicionar Copiloto AI", "pontos": 10,
             "descricao": "Criar um copiloto simples que explica outputs, indica assumptions em falta e responde a perguntas sobre o run. O copiloto deve apoiar o utilizador, nao esconder a logica."},
            {"id": "ex9.3", "titulo": "Ligar Document Drop", "pontos": 10,
             "descricao": "Adicionar o fluxo de document drop com OCR/extracao basica, armazenamento de metadata e pesquisa ou recuperacao minima no contexto da app local."},
        ],
        "desafio": {"id": "des9", "titulo": "Prophet Lite Local", "pontos": 25,
                    "descricao": "Entregar uma app local navegavel onde um utilizador sobe inputs, corre um run, consulta resultados, faz upload de um documento e usa o copiloto AI para entender o que aconteceu."},
        "conteudo": {
            "modulo_1": {
                "titulo": "Frontend Local e Fluxo End-to-End",
                "topicos": [
                    {"titulo": "Do Motor ao Produto", "conteudo": "O valor aumenta quando o motor fica embrulhado numa experiencia simples: upload, run, resultado, explicacao e historico."},
                    {"titulo": "Streamlit como Veiculo", "conteudo": "Streamlit e suficiente para um MVP founder-first: rapido para testar, simples para iterar e bom para demonstracoes e pilotos iniciais."},
                    {"titulo": "Menos Ecras, Mais Clareza", "conteudo": "Em vez de muitos modulos, o MVP deve privilegiar poucos ecras com fluxo limpo e chamadas de acao evidentes."},
                    {"titulo": "Mobile-First na Pratica", "conteudo": "Cartoes compactos, uploads claros, copy curta e estados bem visiveis ajudam a app a funcionar bem em telemovel e em desktop."},
                ]
            },
            "modulo_2": {
                "titulo": "Copiloto AI, Busca e Diferenciacao",
                "topicos": [
                    {"titulo": "LLM no Lugar Certo", "conteudo": "O copiloto deve explicar, orientar, resumir e detetar lacunas. O calculo core continua deterministic e validavel."},
                    {"titulo": "Documento + Resultado + Copiloto", "conteudo": "A combinacao de motor, docs e IA cria uma experiencia mais util do que uma simples calculadora."},
                    {"titulo": "Diferenciacao via UX", "conteudo": "Num mercado pesado e legacy, explicabilidade, simplicidade e rapidez de onboarding podem ser a tua grande vantagem."},
                    {"titulo": "Demo-Readiness", "conteudo": "No fim do dia a app tem de aguentar uma demo real. Isso significa percursos curtos, mensagens claras e menos dependencias fragis."},
                ]
            }
        }
    },
    {
        "dia": 10,
        "titulo": "Deploy, LinkedIn Launch & Demo",
        "semana": 2,
        "objetivo": "Levar o MVP para fora do computador local. Fazer deploy, organizar secrets e auth, preparar a narrativa publica do produto e transformar o projeto num ativo de mercado via LinkedIn e demo final.",
        "modulos": ["Deploy, Auth & Preparacao para Uso", "LinkedIn, Demo e Ativacao de Mercado"],
        "exercicios": [
            {"id": "ex10.1", "titulo": "Deploy Seguro do MVP", "pontos": 10,
             "descricao": "Preparar requirements, secrets, README e fazer deploy da app. Confirmar que o fluxo principal funciona fora da maquina local."},
            {"id": "ex10.2", "titulo": "Polir a Narrativa do Produto", "pontos": 10,
             "descricao": "Escrever a descricao do produto, 3 screenshots ou gifs, e um resumo curto sobre o problema, a wedge e o valor do teu Prophet Lite com AI Copilot."},
            {"id": "ex10.3", "titulo": "Publicar no LinkedIn", "pontos": 10,
             "descricao": "Criar um post de lancamento no LinkedIn com imagem, URL, problema resolvido, stack usada, aprendizagem e convite para feedback ou pilotos. O objetivo e aprender a distribuir, nao so a construir."},
        ],
        "desafio": {"id": "des10", "titulo": "Lancamento Publico do Produto", "pontos": 25,
                    "descricao": "Entregar a app deployada, README final, demo curta e o post de lancamento no LinkedIn. O projeto deixa de ser exercicio interno e passa a ativo publico de carreira e mercado."},
        "conteudo": {
            "modulo_1": {
                "titulo": "Deploy, Auth & Preparacao para Uso",
                "topicos": [
                    {"titulo": "Local Primeiro, Cloud Depois", "conteudo": "Esta ordem reduz stress e acelera aprendizagem. So faz sentido deployar depois de o fluxo principal funcionar localmente."},
                    {"titulo": "Secrets e Higiene", "conteudo": "Separar credentials do codigo, organizar dependencias e preparar README sao sinais minimos de profissionalismo."},
                    {"titulo": "Auth Basica e Credibilidade", "conteudo": "Mesmo um MVP ganha seriedade quando tens no minimo uma nocao clara de quem entra, o que ve e o que pode fazer."},
                    {"titulo": "Deploy como Skill de Fundador", "conteudo": "Conseguir por um produto online e uma alavanca enorme. O mercado responde muito melhor a demos reais do que a PDFs e ideias."},
                ]
            },
            "modulo_2": {
                "titulo": "LinkedIn, Demo e Ativacao de Mercado",
                "topicos": [
                    {"titulo": "Distribuicao Tambem e Produto", "conteudo": "Se ninguem ve o que construiste, perdes metade do valor. LinkedIn e uma extensao do lancamento, nao um extra cosmico."},
                    {"titulo": "Narrativa que Gera Interesse", "conteudo": "O post ideal mostra problema, construcao, stack, resultado e convite a conversa. Fala da transformacao de conhecimento em produto."},
                    {"titulo": "Demo de Fundador", "conteudo": "A demo deve mostrar um fluxo completo e dar vontade de ver mais. Comeca pelo problema, mostra o produto a resolver e fecha com a visao de negocio."},
                    {"titulo": "Do Bootcamp para o Mercado", "conteudo": "O objetivo final nao e so aprender. E sair com um ativo publico que abre portas a clientes, parceiros, entrevistas e futuras iteracoes."},
                ]
            }
        }
    },
]


def get_all_exercises() -> list:
    items = []
    for day in DAYS:
        for ex in day["exercicios"]:
            items.append({**ex, "dia": day["dia"], "tipo": "exercicio"})
        d = day["desafio"]
        items.append({**d, "dia": day["dia"], "tipo": "desafio"})
    return items


def get_max_points() -> int:
    return sum(ex["pontos"] for ex in get_all_exercises())


def get_day_exercises(dia: int) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    for day in DAYS:
        if day["dia"] == dia:
            return day["exercicios"], day["desafio"]
    return [], {}
