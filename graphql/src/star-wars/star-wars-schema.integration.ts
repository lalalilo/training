import { expect } from "chai";
import { graphql } from "graphql";
import { describe, it } from "mocha";
import { StarWarsSchema } from "./star-wars-schema";

describe("Star Wars Query Tests", () => {
  describe("Basic Queries", () => {
    it("Correctly identifies R2-D2 as the hero of the Star Wars Saga", async () => {
      const source = `
        query HeroNameQuery {
          hero {
            name
          }
        } 
      `;
      const result = await graphql({ schema: StarWarsSchema, source });

      expect(result).to.deep.equal({
        data: {
          hero: {
            name: "R2-D2",
          },
        },
      });
    });
  });
});
