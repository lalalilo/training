import express from "express";
import { graphqlHTTP } from "express-graphql";
import { StarWarsSchema, queryType } from "./star-wars/star-wars-schema";

const app = express();

app.use(
  "/graphql",
  graphqlHTTP({
    schema: StarWarsSchema,
    rootValue: queryType,
    graphiql: true,
  })
);

app.get("/", (_req, res, next) => {
  res.send(
    "<h3>👋 Up and running</h3>" +
      "<br>Running a GraphQL API server at <a href=http://localhost:4000/graphql>/graphql</a></br>"
  );
  next();
});

app.listen(4000, () => console.log("🚀 Server ready"));
