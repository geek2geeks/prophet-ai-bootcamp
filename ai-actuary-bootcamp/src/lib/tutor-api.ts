import { auth } from "@/lib/firebase";

export type TutorApiMessage = {
  role: string;
  content: string;
};

export type TutorAction = {
  href: string;
  label: string;
  why: string;
};

const FUNCTION_BASE = "https://us-central1-ai-actuary-bootcamp-dev-260308.cloudfunctions.net";

async function getAuthToken() {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Não estás autenticado.");
  return currentUser.getIdToken();
}

export async function streamTutorChat(
  input: {
    messages: TutorApiMessage[];
    model?: string;
    maxTokens?: number;
    temperature?: number;
  },
  onChunk: (text: string) => void,
  signal?: AbortSignal
) {
  const token = await getAuthToken();

  const response = await fetch(`${FUNCTION_BASE}/tutorChat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(input),
    signal,
  });

  if (!response.ok) {
    let errorText = "Erro ao contactar o tutor server-side.";
    try {
      const payload = await response.json();
      errorText = payload.error || errorText;
    } catch {
      // Ignore
    }
    throw new Error(errorText);
  }

  if (!response.body) {
    throw new Error("Stream indisponível.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let accumulated = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n");

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const dataStr = line.slice(6);
        if (dataStr === "[DONE]") {
          return accumulated;
        }
        try {
          const data = JSON.parse(dataStr);
          if (data.error) throw new Error(data.error);
          if (data.text) {
            accumulated += data.text;
            onChunk(data.text);
          }
        } catch (e) {
          // If JSON parse fails, it might be a partial chunk, though SSE typically avoids this
          // in simple implementations if split by \n.
        }
      }
    }
  }

  return accumulated;
}

export async function recommendTutorActions(input: {
  latestUserPrompt: string;
  latestAssistantReply: string;
  pageContext: string;
  includeAdmin: boolean;
}): Promise<TutorAction[]> {
  const token = await getAuthToken();

  const response = await fetch(`${FUNCTION_BASE}/tutorRecommendAction`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    return [];
  }

  try {
    const payload = await response.json();
    return payload.actions || [];
  } catch {
    return [];
  }
}
