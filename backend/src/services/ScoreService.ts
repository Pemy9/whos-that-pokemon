import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { UserScore } from '../types/index.js';
import { GAME_CONSTANTS } from '../config/constants.js';
import { logger } from '../utils/logger.js';
import { DatabaseError } from '../utils/errors.js';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the JSON file
const SCORES_FILE = path.join(__dirname, '../../data/highscores.json');

export class ScoreService {
  /**
   * Load scores from JSON file
   * @returns Array of user scores
   */
  private async loadScores(): Promise<UserScore[]> {
    try {
      const data = await fs.readFile(SCORES_FILE, 'utf-8');
      return JSON.parse(data) as UserScore[];
    } catch (error) {
      // If file doesn't exist or is empty, return empty array
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        logger.info('Scores file not found, creating new one');
        return [];
      }
      logger.error('Error loading scores:', error);
      return [];
    }
  }

  /**
   * Save scores to JSON file
   * @param scores - Array of scores to save
   */
  private async saveScores(scores: UserScore[]): Promise<void> {
    try {
      await fs.writeFile(SCORES_FILE, JSON.stringify(scores, null, 2), 'utf-8');
    } catch (error) {
      logger.error('Error saving scores:', error);
      throw new DatabaseError('Failed to save score');
    }
  }

  /**
   * Generate a unique ID for a score entry
   * @returns Unique ID string
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  /**
   * Save a new score
   * @param name - Player name
   * @param score - Player score
   * @returns The saved UserScore object
   */
  async saveScore(name: string, score: number): Promise<UserScore> {
    // Load existing scores
    const scores = await this.loadScores();

    // Create new score entry
    const newScore: UserScore = {
      id: this.generateId(),
      name: name.trim(),
      score: score,
      date: new Date().toISOString(),
    };

    // Add to array
    scores.push(newScore);

    // Sort by score (highest first)
    scores.sort((a, b) => b.score - a.score);

    // Keep only top scores (prevents file from growing forever)
    const topScores = scores.slice(0, GAME_CONSTANTS.MAX_HIGH_SCORES);

    // Save back to file
    await this.saveScores(topScores);

    logger.info(`Saved score: ${name} - ${score} points`);

    return newScore;
  }

  /**
   * Get high scores
   * @param limit - Maximum number of scores to return (default 10)
   * @returns Array of top scores
   */
  async getHighScores(
    limit: number = GAME_CONSTANTS.DEFAULT_HIGH_SCORES_DISPLAY,
  ): Promise<UserScore[]> {
    const scores = await this.loadScores();

    // Already sorted from saveScore, but sort again just in case
    scores.sort((a, b) => b.score - a.score);

    // Return limited number
    return scores.slice(0, limit);
  }

  /**
   * Get total number of scores
   * @returns Count of all scores
   */
  async getScoreCount(): Promise<number> {
    const scores = await this.loadScores();
    return scores.length;
  }

  /**
   * Clear all scores (useful for testing/reset)
   * @returns Success boolean
   */
  async clearScores(): Promise<boolean> {
    try {
      await this.saveScores([]);
      logger.info('All scores cleared');
      return true;
    } catch (error) {
      logger.error('Error clearing scores:', error);
      return false;
    }
  }
}
