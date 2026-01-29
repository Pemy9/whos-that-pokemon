/**
 * Custom error classes for better error handling
 */

export class PokemonNotFoundError extends Error {
  constructor(identifier: string | number) {
    super(`Pokemon not found: ${identifier}`);
    this.name = 'PokemonNotFoundError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}
