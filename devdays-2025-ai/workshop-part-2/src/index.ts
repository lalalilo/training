import { database } from "./database/database";
import { embed, generateMessage } from "./openai";

const args = process.argv.slice(2);
if (args.length === 0) {
  throw new Error("Please provide a search query");
}

const searchQuery = args.join(" ");

const queryEmbed = await embed(searchQuery);
// https://docs.turso.tech/features/ai-and-embeddings
const distanceComputation = `vector_distance_cos(errors.embedding, vector32('[${queryEmbed.join(
  ", "
)}]'))`;
const result =
  await database.execute(`SELECT errors.id as id, errors.message as errorMessage, errors.created_at as createdAt, comments.message as comment, comments.created_at as commentCreatedAt, comments.sender as commentSender, ${distanceComputation} as distance
FROM errors
LEFT JOIN comments ON errors.id = comments.errors_id
ORDER BY ${distanceComputation} ASC;`);

const groups = Object.groupBy(result.rows, (row) => row.id as number);
const orderedGroups = Object.values(groups).sort((a, b) => {
  return (a![0].distance as number) - (b![0].distance as number);
});

const data = Object.values(orderedGroups).map((group) => ({
  message: group![0].errorMessage,
  comments: group!
    .filter((row) => row.comment)
    .map((row) => ({
      message: row.comment,
      sender: row.commentSender,
      createdAt: row.commentCreatedAt,
    })),
}));

console.log(
  await generateMessage(
    "You are a specialized AI that reads Lalilo error reports and the comments written about them by the team. From a given JSON containing an error message and its comments, create a clear, brief summary sentence that captures the essence of the issue and its resolution. Focus on what happened and how it was resolved if that information is present. Also highlight any team member that could have context about it and the dates it happened.",
    JSON.stringify(data, null, 2)
  )
);
