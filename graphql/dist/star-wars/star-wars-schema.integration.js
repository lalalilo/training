"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const graphql_1 = require("graphql");
const mocha_1 = require("mocha");
const star_wars_schema_1 = require("./star-wars-schema");
(0, mocha_1.describe)("Star Wars Query Tests", () => {
    (0, mocha_1.describe)("Basic Queries", () => {
        (0, mocha_1.it)("Correctly identifies R2-D2 as the hero of the Star Wars Saga", async () => {
            const source = `
        query HeroNameQuery {
          hero {
            name
          }
        } 
      `;
            const result = await (0, graphql_1.graphql)({ schema: star_wars_schema_1.StarWarsSchema, source });
            (0, chai_1.expect)(result).to.deep.equal({
                data: {
                    hero: {
                        name: "R2-D2",
                    },
                },
            });
        });
    });
});
//# sourceMappingURL=star-wars-schema.integration.js.map