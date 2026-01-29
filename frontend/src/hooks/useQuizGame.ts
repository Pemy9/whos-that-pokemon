import { useLazyQuery } from '@apollo/client/react';
import { useState, useCallback, useRef } from 'react';
import { GET_RANDOM_POKEMON } from '../graphql/queries';
import type { GameSettings, GameState, QuizQuestion, Pokemon } from '../types';
import { GAME_CONFIG } from '../config/constants';

// Utility function to shuffle an array (Fisher-Yates algorithm)
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const useQuizGame = (settings: GameSettings) => {
  // State
  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: 0,
    score: 0,
    streak: 0,
    hintsRemaining: 3,
    hintsUsed: 0,
    isGameOver: false,
    correctAnswers: 0,
    wrongAnswers: 0,
  });

  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Apollo queries - Add TypeScript type for the query result
  const [fetchRandomPokemon] = useLazyQuery<{ randomPokemon: Pokemon }>(
    GET_RANDOM_POKEMON,
    {
      fetchPolicy: 'no-cache', // Always fetch fresh data, never use cache
    },
  );

  // Ref to track if we're currently loading to prevent multiple simultaneous loads
  const isLoadingRef = useRef(false);

  // Functions

  const startGame = useCallback(async () => {
    try {
      setError(null);
      // Reset game state
      setGameState({
        currentQuestion: 0,
        score: 0,
        streak: 0,
        hintsRemaining: 3,
        hintsUsed: 0,
        isGameOver: false,
        correctAnswers: 0,
        wrongAnswers: 0,
      });

      // Load first question
      await loadQuestion();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to start game';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const endGame = () => {
    setGameState((prev) => ({
      ...prev,
      isGameOver: true,
    }));
    setCurrentQuestion(null);
  };

  const loadQuestion = useCallback(
    async (abortSignal?: AbortSignal) => {
      // Prevent multiple simultaneous loads
      if (isLoadingRef.current) {
        console.log('Load already in progress, skipping');
        return;
      }

      isLoadingRef.current = true;
      setIsLoading(true);
      setError(null);

      try {
        // Check if aborted before starting
        if (abortSignal?.aborted) {
          isLoadingRef.current = false;
          return;
        }

        const totalNeeded = settings.numberOfChoices;
        const uniquePokemon: Pokemon[] = [];
        const usedIds = new Set<number>();
        const maxRetries = 50; // Maximum total attempts to prevent infinite loops
        let attempts = 0;

        // Fetch Pokemon in batches until we have enough unique ones
        while (uniquePokemon.length < totalNeeded && attempts < maxRetries) {
          // Check abort signal
          if (abortSignal?.aborted) {
            return;
          }

          // Calculate how many more we need
          const remaining = totalNeeded - uniquePokemon.length;
          // Fetch 2x what we need to account for duplicates
          const batchSize = Math.min(remaining * 2, 10);

          // Fetch a batch in parallel
          const fetchPromises = Array(batchSize)
            .fill(null)
            .map(() =>
              fetchRandomPokemon({
                variables: { generationId: settings.difficulty },
              }),
            );

          const results = await Promise.allSettled(fetchPromises);
          attempts += batchSize;

          // Process results and collect unique Pokemon
          for (const result of results) {
            if (
              result.status === 'fulfilled' &&
              result.value.data?.randomPokemon
            ) {
              const pokemon = result.value.data.randomPokemon;
              if (!usedIds.has(pokemon.id)) {
                uniquePokemon.push(pokemon);
                usedIds.add(pokemon.id);

                // Stop if we have enough
                if (uniquePokemon.length >= totalNeeded) {
                  break;
                }
              }
            }
          }
        }

        // Check if we have enough Pokemon
        if (uniquePokemon.length < totalNeeded) {
          throw new Error(
            `Failed to load enough unique Pokemon. Got ${uniquePokemon.length} out of ${totalNeeded} needed after ${attempts} attempts.`,
          );
        }

        // Check abort signal one more time before setting state
        if (abortSignal?.aborted) {
          return;
        }

        // First Pokemon is the correct answer, rest are wrong answers
        const correctPokemon = uniquePokemon[0];
        const allChoices = uniquePokemon.slice(0, totalNeeded);
        const shuffledChoices = shuffleArray(allChoices);

        // Set the current question
        setCurrentQuestion({
          correctPokemon,
          choices: shuffledChoices,
        });
      } catch (err) {
        // Don't set error if the operation was aborted
        if (abortSignal?.aborted) {
          console.log('Question loading was cancelled');
          isLoadingRef.current = false;
          return;
        }

        console.error('Error loading question:', err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to load Pokemon. Please check your internet connection and try again.';
        setError(errorMessage);
        isLoadingRef.current = false;
        throw new Error(errorMessage);
      } finally {
        // Only set loading to false if not aborted
        if (!abortSignal?.aborted) {
          setIsLoading(false);
          isLoadingRef.current = false;
        }
      }
    },
    [fetchRandomPokemon, settings.difficulty, settings.numberOfChoices],
  );

  const checkAnswer = (selectedPokemon: Pokemon): boolean => {
    if (!currentQuestion) return false;

    const isCorrect = selectedPokemon.id === currentQuestion.correctPokemon.id;

    setGameState((prev) => {
      if (isCorrect) {
        // Calculate score with streak bonus
        const basePoints = GAME_CONFIG.BASE_POINTS;
        const streakMultiplier = Math.max(1, prev.streak + 1);
        const pointsEarned = basePoints * streakMultiplier;

        return {
          ...prev,
          score: prev.score + pointsEarned,
          streak: prev.streak + 1,
          correctAnswers: prev.correctAnswers + 1,
        };
      } else {
        // Wrong answer - reset streak
        return {
          ...prev,
          streak: 0,
          wrongAnswers: prev.wrongAnswers + 1,
        };
      }
    });

    return isCorrect;
  };

  const nextQuestion = useCallback(async () => {
    try {
      setGameState((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
      }));

      // Check if game should end
      if (gameState.currentQuestion + 1 >= settings.questionCount) {
        endGame();
      } else {
        // Load next question
        await loadQuestion();
      }
    } catch (err) {
      // Error is already handled in loadQuestion
      console.error('Error moving to next question:', err);
    }
  }, [gameState.currentQuestion, settings.questionCount, loadQuestion]);

  const useHint = useCallback((): boolean => {
    if (gameState.hintsRemaining > 0) {
      setGameState((prev) => ({
        ...prev,
        hintsRemaining: prev.hintsRemaining - 1,
        hintsUsed: prev.hintsUsed + 1,
      }));
      return true;
    }
    return false;
  }, [gameState.hintsRemaining]);

  // Return
  return {
    // State
    gameState,
    currentQuestion,
    isLoading,
    error,

    // Functions
    startGame,
    loadQuestion,
    checkAnswer,
    nextQuestion,
    endGame,
    useHint,

    // Computed values
    progress: {
      current: gameState.currentQuestion + 1,
      total: settings.questionCount,
      percentage:
        ((gameState.currentQuestion + 1) / settings.questionCount) * 100,
    },
  };
};
