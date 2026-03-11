const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const { GoogleGenAI } = require("@google/genai");
const admin = require("firebase-admin");

admin.initializeApp();

const SYSTEM_PROMPT = `
És o Peter, tutor AI do bootcamp de AI para atuários.
Sê claro, gentil, direto e encorajador.
Ajuda o aluno a avançar com um próximo passo concreto.
Não expliques coding em excesso; ajuda-o a trabalhar com agentes no terminal.
`;

function buildContents(messages) {
  return [
    {
      role: "user",
      parts: [{ text: SYSTEM_PROMPT }],
    },
    ...messages.map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    })),
  ];
}

async function authenticate(req, res) {
  // CORS Preflight - allow OPTIONS requests to pass through without auth
  if (req.method === 'OPTIONS') {
    return true;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: Missing or invalid Authorization header" });
    return null;
  }
  try {
    const idToken = authHeader.split("Bearer ")[1];
    const decoded = await admin.auth().verifyIdToken(idToken);
    return decoded;
  } catch (err) {
    logger.error("Auth error", err);
    res.status(401).json({ error: "Unauthorized: Invalid token" });
    return null;
  }
}

exports.tutorChat = onRequest({ cors: true, region: "us-central1" }, async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(204).send('');
    return;
  }

  const user = await authenticate(req, res);
  if (!user) return;

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { messages, model = "gemini-3-flash-preview", maxTokens = 1800, temperature = 0.4 } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "Missing messages" });
      return;
    }

    const ai = new GoogleGenAI({
      vertexai: true,
      project: process.env.GCLOUD_PROJECT,
      location: "us-central1",
    });

    const stream = await ai.models.generateContentStream({
      model,
      contents: buildContents(messages),
      config: {
        maxOutputTokens: maxTokens,
        temperature,
      },
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    for await (const chunk of stream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }
    }
    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (error) {
    logger.error("Chat Stream Error", error);
    if (!res.headersSent) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    } else {
      res.write(`data: ${JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" })}\n\n`);
      res.end();
    }
  }
});

// Tutor Tools for action recommendation
const TUTOR_TOOLS = [
  {
    functionDeclarations: [
      {
        name: "open_mission",
        description: "Sugere abrir uma missao especifica do bootcamp.",
        parameters: {
          type: "object",
          properties: {
            daySlug: { type: "string", description: "Slug do dia, ex: 01 ou 10" },
            why: { type: "string", description: "Porque esta missao e o proximo passo certo" },
          },
          required: ["daySlug", "why"],
        },
      },
      {
        name: "open_resource_hub",
        description: "Sugere abrir a pagina de recursos quando faltam docs, ficheiros ou referencias.",
        parameters: {
          type: "object",
          properties: {
            why: { type: "string", description: "Porque os recursos ajudam neste bloqueio" },
          },
          required: ["why"],
        },
      },
      {
        name: "open_portfolio",
        description: "Sugere abrir o portfolio para rever progresso, entregas ou proximos passos.",
        parameters: {
          type: "object",
          properties: {
            why: { type: "string", description: "Porque o portfolio ajuda neste momento" },
          },
          required: ["why"],
        },
      },
      {
        name: "open_admin",
        description: "Sugere abrir a area de administracao quando a questao e operacional ou de gestao do bootcamp.",
        parameters: {
          type: "object",
          properties: {
            why: { type: "string", description: "Porque a area admin e o proximo passo certo" },
          },
          required: ["why"],
        },
      }
    ]
  }
];

exports.tutorRecommendAction = onRequest({ cors: true, region: "us-central1" }, async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(204).send('');
    return;
  }

  const user = await authenticate(req, res);
  if (!user) return;

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { latestUserPrompt, latestAssistantReply, pageContext, includeAdmin } = req.body || {};

    const ai = new GoogleGenAI({
      vertexai: true,
      project: process.env.GCLOUD_PROJECT,
      location: "us-central1",
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            { text: "Es um planeador de navegacao dentro do AI Actuary Bootcamp. Escolhe no maximo UMA tool quando houver um proximo passo claro dentro do produto. Se nenhuma tool ajudar, nao chames tools e responde vazio." }
          ]
        },
        {
          role: "user",
          parts: [
            { text: `PERGUNTA DO ALUNO:\n${latestUserPrompt}\n\nRESPOSTA DO TUTOR:\n${latestAssistantReply}\n\nCONTEXTO DA PAGINA:\n${pageContext}\n\nSe fizer sentido navegar dentro do produto, chama uma tool. Caso contrario, nao faças nada.` }
          ]
        }
      ],
      config: {
        maxOutputTokens: 220,
        temperature: 0.1,
        tools: TUTOR_TOOLS,
      },
    });

    const functionCalls = response.functionCalls || [];

    // Convert to action format
    const actions = [];
    for (const call of functionCalls) {
      if (call.name === "open_mission" && call.args.daySlug) {
        actions.push({ href: `/missions/${call.args.daySlug}`, label: `Abrir Dia ${call.args.daySlug}`, why: call.args.why || "" });
      } else if (call.name === "open_resource_hub") {
        actions.push({ href: "/resources", label: "Abrir Recursos", why: call.args.why || "" });
      } else if (call.name === "open_portfolio") {
        actions.push({ href: "/portfolio", label: "Abrir Portfolio", why: call.args.why || "" });
      } else if (call.name === "open_admin" && includeAdmin) {
        actions.push({ href: "/admin", label: "Abrir Admin", why: call.args.why || "" });
      }
    }

    res.status(200).json({ actions });
  } catch (error) {
    logger.error("Recommend Action Error", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
  }
});
