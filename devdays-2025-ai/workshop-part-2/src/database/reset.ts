import { database, reset } from "./database";

await reset(database);
console.log("Database reset!");
