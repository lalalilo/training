/**
 * These are types which correspond to the schema.
 * They represent the shape of the data visited during field resolution.
 */
export interface Character {
    type: "Human" | "Droid";
    id: string;
    name: string;
    friends: ReadonlyArray<string>;
    appearsIn: ReadonlyArray<number>;
}
export interface Human extends Character {
    type: "Human";
    homePlanet?: string;
}
export interface Droid extends Character {
    type: "Droid";
    primaryFunction: string;
}
/**
 * Helper function to get a character by ID.
 */
export declare const getCharacter: (id: string) => Promise<Character | null>;
/**
 * Allows us to query for a character's friends.
 */
export declare const getFriends: (character: Character) => Array<Promise<Character | null>>;
/**
 * Allows us to fetch the undisputed hero of the Star Wars trilogy, R2-D2.
 */
export declare const getHero: (episode: number) => Character;
/**
 * Allows us to query for the human with the given id.
 */
export declare const getHuman: (id: string) => Human | null;
/**
 * Allows us to query for the droid with the given id.
 */
export declare const getDroid: (id: string) => Droid | null;
