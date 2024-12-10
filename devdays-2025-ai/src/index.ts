import { database } from "./database";
import { embed, summarizeIssue } from "./openai";

const args = process.argv.slice(2);
if (args.length === 0) {
  throw new Error("Please provide a search query");
}

const searchQuery = args.join(" ");

const queryEmbed = await embed(searchQuery);
const result =
  await database.execute(`SELECT errors.id as id, errors.message as errorMessage, errors.created_at as createdAt, comments.message as comment, comments.created_at as commentCreatedAt, comments.sender as commentSender, vector_distance_cos(errors.embedding, vector32('[${queryEmbed.join(
    ", "
  )}]')) as distance
FROM errors
LEFT JOIN comments ON errors.id = comments.errors_id
WHERE
        vector_distance_cos(errors.embedding, vector32('[${queryEmbed.join(
          ", "
        )}]')) < 0.1
ORDER BY
       vector_distance_cos(errors.embedding, vector32('[${queryEmbed.join(
         ", "
       )}]'))
ASC;`);
// FIXME: Better handle the search limit

const groups = Object.groupBy(result.rows, (row) => row.id as number);
const data = Object.values(groups).map((group) => ({
  message: group![0].errorMessage,
  comments: group!
    .filter((row) => row.comment)
    .map((row) => ({
      message: row.comment,
      sender: row.commentSender,
      createdAt: row.commentCreatedAt,
    })),
}));

console.log(await summarizeIssue(data));
