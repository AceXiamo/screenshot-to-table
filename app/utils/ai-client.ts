import type { AIConfig, ChatRequest, ChatResponse, TableData } from "~/types/ai";

export class AIClient {
  constructor(private config: AIConfig) {}

  async analyzeImage(imageBase64: string): Promise<TableData> {
    const request: ChatRequest = {
      model: this.config.model,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please analyze this screenshot and extract any table data you see. Return the data in JSON format with 'headers' array and 'rows' array (array of arrays). If no table is found, return empty arrays.",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 4000,
      temperature: 0.1,
    };

    const response = await fetch(this.config.endpoint + "/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status} ${response.statusText}`);
    }

    const data: ChatResponse = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      
      const tableData = JSON.parse(jsonMatch[0]) as TableData;
      
      if (!Array.isArray(tableData.headers) || !Array.isArray(tableData.rows)) {
        throw new Error("Invalid table data format");
      }
      
      return tableData;
    } catch (error) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse table data from AI response");
    }
  }
}

export function createAIClient(config: AIConfig): AIClient {
  return new AIClient(config);
}