"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_graphql_1 = require("express-graphql");
const star_wars_schema_1 = require("./star-wars/star-wars-schema");
const app = (0, express_1.default)();
app.use("/graphql", (0, express_graphql_1.graphqlHTTP)({
    schema: star_wars_schema_1.StarWarsSchema,
    rootValue: star_wars_schema_1.queryType,
    graphiql: true,
}));
app.listen(4000, () => console.log("🚀 Server ready"));
console.log("Running a GraphQL API server at http://localhost:4000/graphql");
//# sourceMappingURL=index.js.map