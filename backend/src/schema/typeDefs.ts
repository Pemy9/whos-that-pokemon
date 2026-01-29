export const typeDefs = `#graphql
  type Pokemon {
    id: Int!
    name: String!
    sprite: String!
    cryUrl: String!
    types: [String!]!
    stats: [Stat!]!
  }

  type Stat {
    name: String!
    value: Int!
  }

  type UserScore {
    id: ID!
    name: String!
    score: Int!
    date: String!
  }

  type Generation {
    id: Int!
    name: String!
    pokemonRange: PokemonRange!
  }

  type PokemonRange {
    start: Int!
    end: Int!
  }

  type Query {
    # Get a specific Pokemon by ID or name
    pokemon(id: Int, name: String): Pokemon
    
    # Get a random Pokemon (optionally filtered by generation)
    randomPokemon(generationId: Int): Pokemon
    
    # Get a list of Pokemon with pagination
    pokemonList(limit: Int, offset: Int): [Pokemon!]!
    
    # Get all generations for difficulty selection
    generations: [Generation!]!
    
    # Get high scores (optionally limited)
    highScores(limit: Int): [UserScore!]!
  }

  type Mutation {
    # Save a user's score
    saveScore(name: String!, score: Int!): UserScore!
  }
`;
