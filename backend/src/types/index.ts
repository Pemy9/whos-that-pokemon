import { ConfigurablePokeAPIDataSource } from '../datasources/ConfigurablePokeAPI.js';

export interface Pokemon {
  id: number;
  name: string;
  sprite: string;
  cryUrl: string;
  types: string[];
  stats: Stat[];
}

export interface Stat {
  name: string;
  value: number;
}

export interface UserScore {
  id: string;
  name: string;
  score: number;
  date: string;
}

export interface Generation {
  id: number;
  name: string;
  pokemonRange: {
    start: number;
    end: number;
  };
}

export interface Context {
  dataSources: {
    pokeAPI: ConfigurablePokeAPIDataSource;
  };
}
