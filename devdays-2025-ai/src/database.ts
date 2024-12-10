import { createClient, type Client } from "@libsql/client";
import { embed } from "./openai";

export const database = createClient({
  url: "file:local.db",
});

export const reset = async (database: Client) => {
  const baseErrorsData = await Promise.all(
    [
      {
        created_at: "2024-11-26 17:58:00",
        message: "Triggered: Invalid country code in RGP rostering",
      },
      {
        created_at: "2024-11-26 18:36:00",
        message:
          "Triggered: Job Failed: demo-districts-pipeline-28876500 on us-east-1-staging-purple-cluster",
      },
      {
        created_at: "2024-11-22 17:54:00",
        message: "Triggered: Invalid country code in RGP rostering",
      },
      {
        created_at: "2024-11-21 18:02:00",
        message:
          "Triggered: Job Failed: set-onboarding-notification-6 on us-east-1-production-purple-cluster",
      },
    ].map(async (item) => ({ ...item, embedding: await embed(item.message) }))
  );

  const insertErrors = `INSERT INTO errors (created_at, message, embedding) VALUES ${baseErrorsData
    .map(
      (item) =>
        `('${item.created_at}', '${item.message}', vector32('[${item.embedding}]'))`
    )
    .join(", ")}`;

  const baseMessagesData = await Promise.all(
    [
      {
        errors_id: 1,
        created_at: "2024-11-26 19:31:00",
        message: `I see we already made a request in #gatekeepers-ext for tenants: 7835607 & 8731389 now the failing tenant is 8619140 @Anaïs and @Marion you are talking about an email thread with Danita here; is there any infos to share before I make a new request to #gatekeepers-ext?`,
        sender: "Grégoire",
      },
      {
        errors_id: 1,
        created_at: "2024-11-26 19:59:00",
        message:
          "Not much info I think. Pascal advised that the next step was to set up a meeting with Danita to try to understand what happens when she provisions a new account, I was waiting to see if we had more errors like this but I guess we could do this now.",
        sender: "Marion",
      },
      {
        errors_id: 1,
        created_at: "2024-11-27 15:33:00",
        message: "Should I do it ? Or do you prefer to lead the topic ?",
        sender: "Grégoire",
      },
    ].map(async (item) => ({ ...item, embedding: await embed(item.message) }))
  );
  const insertComments = `INSERT INTO comments (created_at, message, sender, embedding, errors_id) VALUES ${baseMessagesData
    .map(
      (item) =>
        `('${item.created_at}', '${item.message}', '${item.sender}', vector32('[${item.embedding}]'), ${item.errors_id})`
    )
    .join(", ")};`;

  await database.batch(
    [
      "DROP TABLE IF EXISTS comments",
      "DROP TABLE IF EXISTS errors",
      `CREATE TABLE IF NOT EXISTS errors (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at DATETIME NOT NULL, message TEXT NOT NULL, embedding F32_BLOB(${process.env.EMBEDDING_DIMENSION}) NOT NULL)`,
      "CREATE INDEX errors_idx ON errors (libsql_vector_idx(embedding))",
      `CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at DATETIME NOT NULL, message TEXT NOT NULL, sender TEXT NOT NULL, embedding F32_BLOB(${process.env.EMBEDDING_DIMENSION}) NOT NULL, errors_id INTEGER NOT NULL REFERENCES errors(id))`,
      "CREATE INDEX comments_idx ON comments (libsql_vector_idx(embedding))",
      insertErrors,
      insertComments,
    ],
    "write"
  );
};
