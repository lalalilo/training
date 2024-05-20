import { GraphQLObjectType, GraphQLSchema } from "graphql";
/**
 * This is the type that will be the root of our query, and the
 * entry point into our schema. It gives us the ability to fetch
 * objects by their IDs, as well as to fetch the undisputed hero
 * of the Star Wars trilogy, R2-D2, directly.
 *
 * This implements the following type system shorthand:
 * ```graphql
 * type Query {
 *   hero(episode: Episode): Character
 *   human(id: String!): Human
 *   droid(id: String!): Droid
 * }
 * ```
 */
export declare const queryType: GraphQLObjectType<any, any>;
/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export declare const StarWarsSchema: GraphQLSchema;
