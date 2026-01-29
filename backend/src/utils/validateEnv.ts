/**
 * Validate required environment variables on startup
 */

import { logger } from './logger.js';

interface EnvConfig {
  PORT: number;
  API_MODE: 'real' | 'mockoon';
  MOCKOON_API_URL?: string;
  NODE_ENV: 'development' | 'production' | 'test';
}

export function validateEnv(): EnvConfig {
  const errors: string[] = [];

  // PORT validation
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
  if (isNaN(port) || port < 1 || port > 65535) {
    errors.push('PORT must be a valid port number (1-65535)');
  }

  // API_MODE validation
  const apiMode = (process.env.API_MODE || 'real') as 'real' | 'mockoon';
  if (!['real', 'mockoon'].includes(apiMode)) {
    errors.push('API_MODE must be either "real" or "mockoon"');
  }

  // MOCKOON_API_URL validation (only required if using mockoon)
  const mockoonUrl = process.env.MOCKOON_API_URL;
  if (apiMode === 'mockoon' && !mockoonUrl) {
    logger.warn('MOCKOON_API_URL not set, using default: http://localhost:3001');
  }

  // NODE_ENV validation
  const nodeEnv = (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test';
  if (!['development', 'production', 'test'].includes(nodeEnv)) {
    errors.push('NODE_ENV must be "development", "production", or "test"');
  }

  if (errors.length > 0) {
    logger.error('Environment validation failed:');
    errors.forEach((error) => logger.error(`  - ${error}`));
    throw new Error('Invalid environment configuration');
  }

  logger.info('Environment validation passed');

  return {
    PORT: port,
    API_MODE: apiMode,
    MOCKOON_API_URL: mockoonUrl,
    NODE_ENV: nodeEnv,
  };
}
