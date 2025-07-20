export interface AIConfig {
  endpoint: string;
  apiKey: string;
  model: string;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: Array<{
    type: "text" | "image_url";
    text?: string;
    image_url?: {
      url: string;
    };
  }>;
}

export interface ChatRequest {
  model: string;
  messages: ChatMessage[];
  max_tokens?: number;
  temperature?: number;
}

export interface ChatResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export interface TableData {
  headers: string[];
  rows: string[][];
}