import { Context } from './index.js';

/**
 * Query argument types
 */
export interface PokemonByIdArgs {
  id?: number;
  name?: string;
}

export interface RandomPokemonArgs {
  generationId?: number;
}

export interface PokemonListArgs {
  limit?: number;
  offset?: number;
}

export interface HighScoresArgs {
  limit?: number;
}

/**
 * Mutation argument types
 */
export interface SaveScoreArgs {
  name: string;
  score: number;
}

/**
 * Resolver type definitions
 */
export type Resolver<TArgs = {}, TResult = any> = (
  parent: unknown,
  args: TArgs,
  context: Context,
) => Promise<TResult> | TResult;

export interface QueryResolvers {
  pokemon: Resolver<PokemonByIdArgs, any>;
  randomPokemon: Resolver<RandomPokemonArgs, any>;
  pokemonList: Resolver<PokemonListArgs, any>;
  generations: Resolver<{}, any>;
  highScores: Resolver<HighScoresArgs, any>;
}

export interface MutationResolvers {
  saveScore: Resolver<SaveScoreArgs, any>;
}

export interface Resolvers {
  Query: QueryResolvers;
  Mutation: MutationResolvers;
}
