// Pokemon types matching our GraphQL schema
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

// Game state types
export type GameMode = 'visual' | 'audio';

export type Difficulty = 1 | 2 | 3; // Generation IDs

export interface GameSettings {
  mode: GameMode;
  difficulty: Difficulty;
  numberOfChoices: number; // 4, 6, etc.
  questionCount: number; // Total questions per game
}

export interface GameState {
  currentQuestion: number;
  score: number;
  streak: number;
  hintsRemaining: number;
  hintsUsed: number;
  isGameOver: boolean;
  correctAnswers: number;
  wrongAnswers: number;
}

export interface QuizQuestion {
  correctPokemon: Pokemon;
  choices: Pokemon[];
}

export type HintType = 'type' | 'firstLetter' | 'evolution';

export interface Hint {
  type: HintType;
  revealed: boolean;
}
