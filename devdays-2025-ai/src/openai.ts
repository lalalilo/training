import { AzureOpenAI } from "openai";

const openai = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  apiVersion: "2024-08-01-preview",
});

// TODO: Fabien clean-up of available models
enum AVAILABLE_MODELS {
  GPT4O = "gpt-4o-devdays",
  GPT4O_MINI = "gpt-4o-mini",
  TEXT_EMBEDDING = "text-embedding-3-small",
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

export const generateMessage = async (system: string, user: string) => {
  const res = await openai.chat.completions.create({
    model: AVAILABLE_MODELS.GPT4O,
    // All messages that will be sent to the LLM
    // The LLM will answer with the next message in the chat
    messages: [
      {
        role: "system", // Instructions given by the system are given more importance.
        content: system,
      },
      {
        role: "user", // You when you are asking a question to ChatGPT
        content: user,
      },
    ],
  });

  // res is a list of different answer possibilities
  // The first one is the preferred one (more relevant)
  return res.choices[0].message.content;
};
