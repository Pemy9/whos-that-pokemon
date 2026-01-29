/**
 * Simple logger utility to replace console.log
 * In production, this could be replaced with Winston, Pino, etc.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const isDevelopment = process.env.NODE_ENV !== 'production';

class Logger {
  private log(level: LogLevel, message: string, ...args: any[]) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    // In production, only log warnings and errors
    if (!isDevelopment && (level === 'info' || level === 'debug')) {
      return;
    }

    switch (level) {
      case 'error':
        console.error(prefix, message, ...args);
        break;
      case 'warn':
        console.warn(prefix, message, ...args);
        break;
      case 'debug':
        if (isDevelopment) {
          console.debug(prefix, message, ...args);
        }
        break;
      default:
        console.log(prefix, message, ...args);
    }
  }

  info(message: string, ...args: any[]) {
    this.log('info', message, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.log('warn', message, ...args);
  }

  error(message: string, ...args: any[]) {
    this.log('error', message, ...args);
  }

  debug(message: string, ...args: any[]) {
    this.log('debug', message, ...args);
  }
}

export const logger = new Logger();
