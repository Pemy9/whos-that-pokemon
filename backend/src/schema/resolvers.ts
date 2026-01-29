import { Context } from '../types/index.js';
import { ScoreService } from '../services/ScoreService.js';
import type {
  PokemonByIdArgs,
  RandomPokemonArgs,
  PokemonListArgs,
  HighScoresArgs,
  SaveScoreArgs,
  Resolver,
} from '../types/resolvers.js';
import { VALIDATION, ERROR_MESSAGES } from '../config/constants.js';

// Create a single instance (singleton pattern)
const scoreService = new ScoreService();

export const resolvers = {
  Query: {
    pokemon: async (
      _parent: unknown,
      args: PokemonByIdArgs,
      context: Context,
    ) => {
      if (args.id) {
        return context.dataSources.pokeAPI.getPokemonById(args.id);
      }
      if (args.name) {
        return context.dataSources.pokeAPI.getPokemonByName(args.name);
      }
      return null;
    },

    randomPokemon: async (
      _parent: unknown,
      args: RandomPokemonArgs,
      context: Context,
    ) => {
      return context.dataSources.pokeAPI.getRandomPokemon(args.generationId);
    },

    pokemonList: async (
      _parent: unknown,
      args: PokemonListArgs,
      context: Context,
    ) => {
      return context.dataSources.pokeAPI.getPokemonList(
        args.limit,
        args.offset,
      );
    },

    generations: async (_parent: unknown, _args: {}, _context: Context) => {
      return [
        { id: 1, name: 'Generation I', pokemonRange: { start: 1, end: 151 } },
        {
          id: 2,
          name: 'Generation I-III',
          pokemonRange: { start: 1, end: 386 },
        },
        {
          id: 3,
          name: 'All Generations',
          pokemonRange: { start: 1, end: 1025 },
        },
      ];
    },

    highScores: async (
      _parent: unknown,
      args: HighScoresArgs,
      _context: Context,
    ) => {
      // Use the score service!
      return scoreService.getHighScores(args.limit);
    },
  },

  Mutation: {
    saveScore: async (
      _parent: unknown,
      args: SaveScoreArgs,
      _context: Context,
    ) => {
      // Validate inputs
      const trimmedName = args.name.trim();

      if (!trimmedName || trimmedName.length < VALIDATION.MIN_NAME_LENGTH) {
        throw new Error(ERROR_MESSAGES.INVALID_NAME);
      }

      if (trimmedName.length > VALIDATION.MAX_NAME_LENGTH) {
        throw new Error(ERROR_MESSAGES.INVALID_NAME);
      }

      if (
        args.score < VALIDATION.MIN_SCORE ||
        args.score > VALIDATION.MAX_SCORE
      ) {
        throw new Error(ERROR_MESSAGES.INVALID_SCORE);
      }

      // Save the score
      return scoreService.saveScore(trimmedName, args.score);
    },
  },
};
