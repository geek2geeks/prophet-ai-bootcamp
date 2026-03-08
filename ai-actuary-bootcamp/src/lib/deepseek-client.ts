import { doc, getDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";

export type DeepSeekMessage = {
  role: string;
  content: string;
};

export type DeepSeekTool = {
  type: "function";
  function: {
    name: string;
    description?: string;
    strict?: boolean;
    parameters?: Record<string, unknown>;
  };
};

export type DeepSeekToolCall = {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
};

export type DeepSeekUsage = {
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
  prompt_cache_hit_tokens?: number;
  prompt_cache_miss_tokens?: number;
  completion_tokens_details?: {
    reasoning_tokens?: number;
  };
};

type ConfigKeysDoc = {
  deepseek?: string;
};

type RequestInput = {
  messages: DeepSeekMessage[];
  model?: "deepseek-chat" | "deepseek-reasoner";
  maxTokens?: number;
  temperature?: number;
  responseFormat?: { type: "json_object" | "text" };
  tools?: DeepSeekTool[];
  toolChoice?: "none" | "auto" | { type: "function"; function: { name: string } };
  stop?: string | string[];
  thinking?: { type: "enabled" | "disabled" };
};

type NonStreamingResponse = {
  content: string;
  reasoningContent?: string;
  toolCalls?: DeepSeekToolCall[];
  usage?: DeepSeekUsage;
};

type StreamingInput = RequestInput & {
  onToken?: (token: string, accumulated: string) => void;
  onReasoningToken?: (token: string, accumulated: string) => void;
  signal?: AbortSignal;
};

type StreamingResponse = {
  content: string;
  reasoningContent: string;
  usage?: DeepSeekUsage;
};

let cachedKey: string | null = null;
let pendingKeyPromise: Promise<string> | null = null;

async function loadSharedDeepSeekKey() {
  const snapshot = await getDoc(doc(db, "config", "keys"));

  if (!snapshot.exists()) {
    throw new Error("Chave DeepSeek nao encontrada em config/keys.");
  }

  const data = snapshot.data() as ConfigKeysDoc;
  const key = data.deepseek?.trim();

  if (!key) {
    throw new Error("Chave DeepSeek nao configurada pelo administrador.");
  }

  return key;
}

export async function getSharedDeepSeekKey() {
  if (cachedKey) {
    return cachedKey;
  }

  if (!pendingKeyPromise) {
    pendingKeyPromise = loadSharedDeepSeekKey()
      .then((key) => {
        cachedKey = key;
        return key;
      })
      .finally(() => {
        pendingKeyPromise = null;
      });
  }

  return pendingKeyPromise;
}

function buildRequestBody(input: RequestInput, stream: boolean) {
  const body: Record<string, unknown> = {
    model: input.model ?? "deepseek-chat",
    messages: input.messages,
    max_tokens: input.maxTokens ?? (input.model === "deepseek-reasoner" ? 2048 : 2048),
    stream,
  };

  if (input.temperature !== undefined && input.model !== "deepseek-reasoner") {
    body.temperature = input.temperature;
  }

  if (input.responseFormat) {
    body.response_format = input.responseFormat;
  }

  if (input.tools?.length) {
    body.tools = input.tools;
    body.tool_choice = input.toolChoice ?? "auto";
  }

  if (input.stop) {
    body.stop = input.stop;
  }

  if (input.thinking) {
    body.thinking = input.thinking;
  }

  if (stream) {
    body.stream_options = { include_usage: true };
  }

  return body;
}

async function createDeepSeekResponse(input: RequestInput, stream: boolean, signal?: AbortSignal) {
  const apiKey = await getSharedDeepSeekKey();
  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(buildRequestBody(input, stream)),
    signal,
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(
      errorBody?.trim()
        ? `DeepSeek API error: ${response.status} - ${errorBody.trim()}`
        : `DeepSeek API error: ${response.status}`,
    );
  }

  return response;
}

export async function requestDeepSeekChat(input: RequestInput): Promise<string> {
  const result = await requestDeepSeekChatDetailed(input);
  return result.content;
}

export async function requestDeepSeekChatDetailed(input: RequestInput): Promise<NonStreamingResponse> {
  const response = await createDeepSeekResponse(input, false);
  const payload = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string | null;
        reasoning_content?: string | null;
        tool_calls?: DeepSeekToolCall[] | null;
      };
    }>;
    usage?: DeepSeekUsage;
  };

  const message = payload.choices?.[0]?.message;

  return {
    content: message?.content?.trim() ?? "",
    reasoningContent: message?.reasoning_content?.trim() ?? "",
    toolCalls: message?.tool_calls ?? undefined,
    usage: payload.usage,
  };
}

export async function streamDeepSeekChat(input: StreamingInput): Promise<StreamingResponse> {
  const response = await createDeepSeekResponse(input, true, input.signal);
  const reader = response.body?.getReader();

  if (!reader) {
    throw new Error("DeepSeek stream indisponivel.");
  }

  const decoder = new TextDecoder();
  let buffer = "";
  let content = "";
  let reasoningContent = "";
  let usage: DeepSeekUsage | undefined;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? "";

    for (const part of parts) {
      const lines = part
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      for (const line of lines) {
        if (!line.startsWith("data:")) {
          continue;
        }

        const raw = line.slice(5).trim();
        if (!raw || raw === "[DONE]") {
          continue;
        }

        let chunk: {
          choices?: Array<{
            delta?: {
              content?: string;
              reasoning_content?: string;
            };
            finish_reason?: string | null;
          }>;
          usage?: DeepSeekUsage | null;
        };

        try {
          chunk = JSON.parse(raw) as typeof chunk;
        } catch {
          continue;
        }

        if (chunk.usage) {
          usage = chunk.usage;
        }

        const delta = chunk.choices?.[0]?.delta;
        if (delta?.reasoning_content) {
          reasoningContent += delta.reasoning_content;
          input.onReasoningToken?.(delta.reasoning_content, reasoningContent);
        }

        if (delta?.content) {
          content += delta.content;
          input.onToken?.(delta.content, content);
        }
      }
    }
  }

  return {
    content: content.trim(),
    reasoningContent: reasoningContent.trim(),
    usage,
  };
}
