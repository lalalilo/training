import { AzureOpenAI } from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import {
  FUNCTION_NAME,
  getSlackName,
  slackNameTool,
} from "./tools/get-slack-name";

export const openai = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  apiVersion: "2024-08-01-preview",
});

enum AVAILABLE_MODELS {
  GPT4O = "gpt-4o-devdays",
  GPT4O_MINI = "gpt-4o-mini-devdays",
  TEXT_EMBEDDING = "text-embedding-3-small-devdays",
  DALL_E = "dall-e-3-devdays",
}

/*
 If you wish to create embeddings ->
*/
export const embed = async (text: string | string[]) => {
  const res = await openai.embeddings.create({
    input: text,
    model: AVAILABLE_MODELS.TEXT_EMBEDDING,
    dimensions: parseInt(process.env.EMBEDDING_DIMENSION!),
  });

  return res.data.map((item) => item.embedding);
};

const callFunction = async (name: string, args: any) => {
  if (name === FUNCTION_NAME) {
    if (args && args.userId !== undefined) {
      return getSlackName(args.userId);
    }
  }
};

export const generateMessage = async (system: string, user: string) => {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: "system" as const, // Instructions given by the system are given more importance.
      content: system,
    },
    {
      role: "user" as const, // You when you are asking a question to ChatGPT
      content: user,
    },
  ];

  const res = await openai.chat.completions.create({
    model: AVAILABLE_MODELS.GPT4O_MINI,
    // All messages that will be sent to the LLM
    // The LLM will answer with the next message in the chat
    messages,
    tool_choice: "auto",
    tools: slackNameTool,
  });

  messages.push(res.choices[0].message);

  if (res.choices[0].message.tool_calls !== undefined) {
    for (const toolCall of res.choices[0].message.tool_calls) {
      const name = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments);

      const result = await callFunction(name, args);
      if (result) {
        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: result.toString(),
        });
      }
    }

    const res2 = await openai.chat.completions.create({
      model: AVAILABLE_MODELS.GPT4O_MINI,
      // All messages that will be sent to the LLM
      // The LLM will answer with the next message in the chat
      messages,
      tool_choice: "auto",
      tools: slackNameTool,
    });
    return res2.choices[0].message.content;
  } else {
    console.log("No tool to run");
  }

  // res is a list of different answer possibilities
  // The first one is the preferred one (more relevant)
  return res.choices[0].message.content;
};
