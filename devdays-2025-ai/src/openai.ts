import { AzureOpenAI } from "openai";

const openai = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  apiVersion: "2024-08-01-preview",
});

export const embed = async (text: string | string[]) => {
  const res = await openai.embeddings.create({
    input: text,
    model: "text-embedding-3-small",
    dimensions: parseInt(process.env.EMBEDDING_DIMENSION!),
  });

  return res.data.map((item) => item.embedding);
};

export const summarizeIssue = async (data: object) => {
  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a specialized AI that reads Lalilo error reports and the comments written about them by the team. From a given JSON containing an error message and its comments, create a clear, brief summary sentence that captures the essence of the issue and its resolution. Focus on what happened and how it was resolved if that information is present. Also highlight any team member that could have context about it and the dates it happened.",
      },
      {
        role: "user",
        content: JSON.stringify(data, null, 2),
      },
    ],
  });

  return res.choices[0].message.content;
};
