import { createClient, type Client } from "@libsql/client";
import { embed } from "../openai";
import data from "./data.json";

export const database = createClient({
  url: "file:local.db",
});

// In this sample codebase we rely on an libsql (sqlite with other stuff) database to store the errors and comments data and vectors that result from embeddings
// If you want to explore vector datases, you can have a look at:
// - Chroma: https://www.trychroma.com/
// - Pinecone: https://www.pinecone.io/

const sanitzedSQL = (message: string): string => {
  return message.replaceAll("'", "");
};

export const reset = async (database: Client) => {
  const dataWithEmbedding = await Promise.all(
    data.map(async (item) => {
      const threadsWithEmbeddings = await Promise.all(
        item.threads.map(async (thread) => ({
          ...thread,
          embedding: await embed(thread.message),
        }))
      );

      return {
        ...item,
        embedding: await embed(item.message),
        threads: threadsWithEmbeddings,
      };
    })
  );

  await database.batch(
    [
      "DROP TABLE IF EXISTS comments",
      "DROP TABLE IF EXISTS errors",
      `CREATE TABLE IF NOT EXISTS errors (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at DATETIME NOT NULL, title TEXT NOT NULL, message TEXT NOT NULL, embedding F32_BLOB(${process.env.EMBEDDING_DIMENSION}) NOT NULL)`,
      `CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at DATETIME NOT NULL, message TEXT NOT NULL, sender TEXT NOT NULL, embedding F32_BLOB(${process.env.EMBEDDING_DIMENSION}) NOT NULL, errors_id INTEGER NOT NULL REFERENCES errors(id))`,
      "CREATE INDEX errors_idx ON errors (libsql_vector_idx(embedding))",
      "CREATE INDEX comments_idx ON comments (libsql_vector_idx(embedding))",
    ],
    "write"
  );

  await database.execute("BEGIN TRANSACTION");

  try {
    for (const item of dataWithEmbedding) {
      const result = await database.execute(
        `INSERT INTO errors (created_at, title, message, embedding) VALUES ('${
          item.created_at
        }', '${sanitzedSQL(item.title)}', '${sanitzedSQL(
          item.message
        )}', vector32('[${item.embedding}]'))`
      );
      const errorId = result.lastInsertRowid;

      for (const thread of item.threads) {
        await database.execute(
          `INSERT INTO comments (errors_id, created_at, message, sender, embedding) VALUES ('${errorId}', '${
            thread.created_at
          }', '${sanitzedSQL(thread.message)}', '${
            thread.sender
          }', vector32('[${thread.embedding}]'))`
        );
      }
    }

    await database.execute("COMMIT");
  } catch (error) {
    await database.execute("ROLLBACK");
    throw error;
  }
};
