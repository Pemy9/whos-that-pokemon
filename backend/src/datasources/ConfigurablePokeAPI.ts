import fetch from 'node-fetch';
import https from 'https';
import { Pokemon } from '../types/index.js';
import { GAME_CONSTANTS } from '../config/constants.js';
import { logger } from '../utils/logger.js';
import { PokemonNotFoundError, NetworkError } from '../utils/errors.js';

// HTTPS agent for real API
const httpsAgent = new https.Agent({
  keepAlive: true,
  timeout: GAME_CONSTANTS.API_TIMEOUT,
});

// Request headers
const headers = {
  'User-Agent': 'PokemonQuizGame/1.0 (Node.js)',
  Accept: 'application/json',
};

interface PokeAPIResponse {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other?: {
      'official-artwork'?: {
        front_default: string;
      };
    };
  };
  cries: {
    latest?: string;
    legacy?: string;
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  stats: Array<{
    stat: {
      name: string;
    };
    base_stat: number;
  }>;
}

export class ConfigurablePokeAPIDataSource {
  private baseURL: string;
  private useHttpsAgent: boolean;
  private mode: 'real' | 'mockoon';

  constructor(mode: 'real' | 'mockoon' = 'real') {
    this.mode = mode;
    // Configure base URL based on mode
    if (mode === 'mockoon') {
      this.baseURL = process.env.MOCKOON_API_URL || 'http://localhost:3001';
      this.useHttpsAgent = false;
    } else {
      this.baseURL = 'https://pokeapi.co/api/v2';
      this.useHttpsAgent = true;
    }
  }

  getMode(): string {
    return this.mode === 'mockoon'
      ? `🎭 Mockoon (${this.baseURL})`
      : `🌐 Real PokéAPI (${this.baseURL})`;
  }

  /**
   * Fetch a Pokemon by ID
   */
  async getPokemonById(id: number): Promise<Pokemon | null> {
    logger.debug(`Fetching Pokemon ID: ${id}`);
    try {
      const fetchOptions: any = { headers };
      if (this.useHttpsAgent) {
        fetchOptions.agent = httpsAgent;
      }

      const response = await fetch(
        `${this.baseURL}/pokemon/${id}`,
        fetchOptions,
      );

      logger.debug(`Response status: ${response.status}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new PokemonNotFoundError(id);
        }
        throw new NetworkError(
          `Failed to fetch Pokemon ${id}: ${response.statusText}`,
          response.status,
        );
      }

      const data = (await response.json()) as PokeAPIResponse;
      logger.debug(`Successfully fetched Pokemon: ${data.name}`);
      return this.transformPokemon(data);
    } catch (error) {
      if (
        error instanceof PokemonNotFoundError ||
        error instanceof NetworkError
      ) {
        throw error;
      }
      logger.error(`Error fetching Pokemon ${id}:`, error);
      return null;
    }
  }

  /**
   * Fetch a Pokemon by name
   */
  async getPokemonByName(name: string): Promise<Pokemon | null> {
    logger.debug(`Fetching Pokemon name: ${name}`);
    try {
      const fetchOptions: any = { headers };
      if (this.useHttpsAgent) {
        fetchOptions.agent = httpsAgent;
      }

      const response = await fetch(
        `${this.baseURL}/pokemon/${name.toLowerCase()}`,
        fetchOptions,
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new PokemonNotFoundError(name);
        }
        throw new NetworkError(
          `Failed to fetch Pokemon ${name}: ${response.statusText}`,
          response.status,
        );
      }

      const data = (await response.json()) as PokeAPIResponse;
      return this.transformPokemon(data);
    } catch (error) {
      if (
        error instanceof PokemonNotFoundError ||
        error instanceof NetworkError
      ) {
        throw error;
      }
      logger.error(`Error fetching Pokemon ${name}:`, error);
      return null;
    }
  }

  /**
   * Get random Pokemon ID within generation range
   */
  getRandomPokemonId(generationId?: number): number {
    const range =
      GAME_CONSTANTS.GENERATION_RANGES[generationId || 1] ||
      GAME_CONSTANTS.GENERATION_RANGES[1];
    return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
  }

  /**
   * Get a random Pokemon
   */
  async getRandomPokemon(generationId?: number): Promise<Pokemon | null> {
    const randomId = this.getRandomPokemonId(generationId);
    return this.getPokemonById(randomId);
  }

  /**
   * Get a list of Pokemon with pagination
   */
  async getPokemonList(
    limit: number = 20,
    offset: number = 0,
  ): Promise<Pokemon[]> {
    try {
      const fetchOptions: any = { headers };
      if (this.useHttpsAgent) {
        fetchOptions.agent = httpsAgent;
      }

      const response = await fetch(
        `${this.baseURL}/pokemon?limit=${limit}&offset=${offset}`,
        fetchOptions,
      );

      if (!response.ok) {
        logger.error(`Failed to fetch Pokemon list: ${response.statusText}`);
        return [];
      }

      const data = (await response.json()) as {
        results: Array<{ name: string; url: string }>;
      };

      // Fetch full data for each Pokemon in parallel
      const pokemonPromises = data.results.map(async (result) => {
        const id = parseInt(result.url.split('/').slice(-2, -1)[0]);
        return this.getPokemonById(id);
      });

      const pokemonList = await Promise.all(pokemonPromises);
      return pokemonList.filter((p): p is Pokemon => p !== null);
    } catch (error) {
      logger.error('Error fetching Pokemon list:', error);
      return [];
    }
  }

  /**
   * Transform raw API response into clean Pokemon type
   */
  private transformPokemon(data: PokeAPIResponse): Pokemon {
    return {
      id: data.id,
      name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      sprite:
        data.sprites.other?.['official-artwork']?.front_default ||
        data.sprites.front_default,
      cryUrl: data.cries.latest || data.cries.legacy || '',
      types: data.types.map((t) => t.type.name),
      stats: data.stats.map((s) => ({
        name: s.stat.name,
        value: s.base_stat,
      })),
    };
  }
}
