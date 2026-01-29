/**
 * Frontend game configuration constants
 */
export const GAME_CONFIG = {
  // Scoring
  BASE_POINTS: 100,

  // Timer
  DEFAULT_TIME_PER_QUESTION: 30, // seconds

  // UI Timing
  ANSWER_REVEAL_DELAY: 2000, // ms - delay before moving to next question

  // Hints
  DEFAULT_HINTS: 3,

  // Choices
  DEFAULT_NUMBER_OF_CHOICES: 4,

  // Questions
  DEFAULT_QUESTION_COUNT: 10,
};

/**
 * Animation durations
 */
export const ANIMATIONS = {
  FADE_IN: 300,
  FADE_OUT: 200,
  SCORE_POPUP: 1000,
  STREAK_ANIMATION: 500,
};

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  GRAPHQL: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4000/graphql',
};

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  LAST_SETTINGS: 'pokemon_quiz_last_settings',
  PLAYER_NAME: 'pokemon_quiz_player_name',
  VOLUME: 'pokemon_quiz_volume',
};
