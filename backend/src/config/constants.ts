/**
 * Game configuration constants
 */
export const GAME_CONSTANTS = {
  // Scoring
  BASE_POINTS: 100,
  MAX_STREAK_MULTIPLIER: 10,

  // Hints
  DEFAULT_HINTS: 3,
  HINT_COST_POINTS: 0, // Could implement point deduction for hints

  // Timer
  DEFAULT_TIME_PER_QUESTION: 30, // seconds

  // High Scores
  MAX_HIGH_SCORES: 100,
  DEFAULT_HIGH_SCORES_DISPLAY: 10,
  MAX_PLAYER_NAME_LENGTH: 50,

  // Pokemon
  GENERATION_RANGES: {
    1: { min: 1, max: 151 },
    2: { min: 1, max: 386 },
    3: { min: 1, max: 1025 },
  } as Record<number, { min: number; max: number }>,

  // API
  API_TIMEOUT: 10000, // ms
  MAX_RETRIES: 3,

  // Rate Limiting
  MAX_SCORE_SUBMISSIONS_PER_HOUR: 10,
};

/**
 * Validation constants
 */
export const VALIDATION = {
  MIN_SCORE: 0,
  MAX_SCORE: 1000000,
  MIN_NAME_LENGTH: 1,
  MAX_NAME_LENGTH: 50,
};

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  INVALID_NAME: 'Name is required and must be between 1-50 characters',
  INVALID_SCORE: 'Score must be a positive number',
  POKEMON_NOT_FOUND: 'Pokemon not found',
  NETWORK_ERROR: 'Network error occurred',
  SAVE_FAILED: 'Failed to save score',
};
