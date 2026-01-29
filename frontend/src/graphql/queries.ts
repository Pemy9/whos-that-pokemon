import { gql } from '@apollo/client';

// Fragment for Pokemon data (reusable)
export const POKEMON_FRAGMENT = gql`
  fragment PokemonData on Pokemon {
    id
    name
    sprite
    cryUrl
    types
    stats {
      name
      value
    }
  }
`;

// Get a specific Pokemon by ID
export const GET_POKEMON = gql`
  ${POKEMON_FRAGMENT}
  query GetPokemon($id: Int!) {
    pokemon(id: $id) {
      ...PokemonData
    }
  }
`;

// Get a random Pokemon
export const GET_RANDOM_POKEMON = gql`
  ${POKEMON_FRAGMENT}
  query GetRandomPokemon($generationId: Int) {
    randomPokemon(generationId: $generationId) {
      ...PokemonData
    }
  }
`;

// Get list of Pokemon
export const GET_POKEMON_LIST = gql`
  ${POKEMON_FRAGMENT}
  query GetPokemonList($limit: Int, $offset: Int) {
    pokemonList(limit: $limit, offset: $offset) {
      ...PokemonData
    }
  }
`;

// Get available generations
export const GET_GENERATIONS = gql`
  query GetGenerations {
    generations {
      id
      name
      pokemonRange {
        start
        end
      }
    }
  }
`;

// Get high scores
export const GET_HIGH_SCORES = gql`
  query GetHighScores($limit: Int) {
    highScores(limit: $limit) {
      id
      name
      score
      date
    }
  }
`;
