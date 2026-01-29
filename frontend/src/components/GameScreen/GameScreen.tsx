import { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import { useQuizGame } from '../../hooks/useQuizGame';
import { useTimer } from '../../hooks/useTimer';
import { useHints } from '../../hooks/useHints';
import type { GameSettings, Pokemon, HintType } from '../../types';
import { GAME_CONFIG } from '../../config/constants';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import ErrorDisplay from '../ErrorDisplay/ErrorDisplay';
import QuestionDisplay from '../QuestionDisplay/QuestionDisplay';
import ScoreBoard from '../ScoreBoard/ScoreBoard';
import SilhouetteImage from '../SilhouetteImage/SilhouetteImage';
import MultipleChoice from '../MultipleChoice/MultipleChoice';
import Timer from '../Timer/Timer';
import HintPanel from '../HintPanel/HintPanel';
import EndScreen from '../EndScreen/EndScreen';
import './GameScreen.css';

interface GameScreenProps {
  settings: GameSettings;
  onExit: () => void;
  onViewHighScores: () => void;
}

function GameScreen({ settings, onExit, onViewHighScores }: GameScreenProps) {
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const {
    gameState,
    currentQuestion,
    isLoading,
    error: quizError,
    startGame,
    checkAnswer,
    nextQuestion,
    progress,
  } = useQuizGame(settings);
  
  // Derive error from both local and quiz errors
  const error = localError || quizError;

  // Use ref to avoid recreating the timer callback - declare before useTimer
  const handleAnswerSubmitRef = useRef<((pokemon: Pokemon | null) => void) | null>(null);

  const {
    timeRemaining,
    isRunning: timerRunning,
    startTimer,
    pauseTimer,
    resetTimer,
  } = useTimer(GAME_CONFIG.DEFAULT_TIME_PER_QUESTION, () => {
    handleAnswerSubmitRef.current?.(null);
  });

  const { revealHint, getHintValue, resetHints, isHintRevealed } = useHints(
    currentQuestion?.correctPokemon || null,
    gameState.hintsRemaining,
  );

  const handleNextQuestion = useCallback(() => {
    setSelectedPokemon(null);
    setIsAnswerCorrect(null);
    setIsRevealed(false);

    resetHints();

    resetTimer();
    startTimer();

    nextQuestion();
  }, [resetHints, resetTimer, startTimer, nextQuestion]);

  const handleAnswerSubmit = useCallback(
    (pokemon: Pokemon | null) => {
      if (!currentQuestion) return;

    pauseTimer();

    const isCorrect = pokemon ? checkAnswer(pokemon) : false;

      setSelectedPokemon(pokemon);
      setIsAnswerCorrect(isCorrect);
      setIsRevealed(true);

      setTimeout(() => {
        handleNextQuestion();
      }, GAME_CONFIG.ANSWER_REVEAL_DELAY);
    },
    [currentQuestion, pauseTimer, checkAnswer, handleNextQuestion]
  );

  // Keep ref updated synchronously before paint
  useLayoutEffect(() => {
    handleAnswerSubmitRef.current = handleAnswerSubmit;
  });

  const handleHintRequest = (hintType: HintType) => {
    if (gameState.hintsRemaining <= 0) return;

    revealHint(hintType);
  };

  const handlePlayAgain = () => {
    setSelectedPokemon(null);
    setIsAnswerCorrect(null);
    setIsRevealed(false);
    setLocalError(null);
    resetHints();
    resetTimer();

    startGame();
    startTimer();
  };

  const handleRetry = () => {
    setLocalError(null);
    startGame();
    startTimer();
  };

  useEffect(() => {
    let isMounted = true;

    const initializeGame = async () => {
      try {
        await startGame();
        if (isMounted) {
          startTimer();
        }
      } catch (err) {
        if (isMounted) {
          setLocalError(err instanceof Error ? err.message : 'Failed to start game');
        }
      }
    };

    initializeGame();

    // Cleanup function
    return () => {
      isMounted = false;
      pauseTimer();
    };
  }, [startGame, startTimer, pauseTimer]);

  // Pause timer when there's an error
  useEffect(() => {
    if (quizError) {
      pauseTimer();
    }
  }, [quizError, pauseTimer]);

  if (isLoading && !currentQuestion) {
    return <LoadingScreen message="Loading Pokemon..." />;
  }

  if (gameState.isGameOver) {
    return (
      <EndScreen
        gameState={gameState}
        onPlayAgain={handlePlayAgain}
        onViewHighScores={onViewHighScores}
        onMainMenu={onExit}
      />
    );
  }

  // Error state
  if (error) {
    return (
      <div className="game-screen">
        <div className="game-header">
          <button onClick={onExit} className="exit-button">
            ← Exit
          </button>
        </div>
        <ErrorDisplay
          title="Game Error"
          message={error}
          type="error"
          onRetry={handleRetry}
          onGoBack={onExit}
        />
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="game-screen">
        <div className="game-header">
          <button onClick={onExit} className="exit-button">
            ← Exit
          </button>
        </div>
        <ErrorDisplay
          title="No Question Available"
          message="Unable to load the question. Please try again."
          type="warning"
          onRetry={handleRetry}
          onGoBack={onExit}
        />
      </div>
    );
  }

  return (
    <div className="game-screen">
      <div className="game-header">
        <button onClick={onExit} className="exit-button">
          ← Exit
        </button>
        <Timer timeRemaining={timeRemaining} isRunning={timerRunning} />
      </div>

      <QuestionDisplay
        current={progress.current}
        total={progress.total}
        percentage={progress.percentage}
      />

      <ScoreBoard
        score={gameState.score}
        streak={gameState.streak}
        correctAnswers={gameState.correctAnswers}
        wrongAnswers={gameState.wrongAnswers}
        hintsRemaining={gameState.hintsRemaining}
      />

      <SilhouetteImage
        imageUrl={currentQuestion.correctPokemon.sprite}
        pokemonName={currentQuestion.correctPokemon.name}
        isRevealed={isRevealed}
      />

      <MultipleChoice
        choices={currentQuestion.choices}
        onSelect={handleAnswerSubmit}
        disabled={isRevealed}
        correctPokemonId={
          isRevealed ? currentQuestion.correctPokemon.id : undefined
        }
        selectedPokemonId={selectedPokemon?.id}
      />

      <HintPanel
        hintsRemaining={gameState.hintsRemaining}
        onHintRequest={handleHintRequest}
        getHintValue={getHintValue}
        isHintRevealed={isHintRevealed}
        disabled={isRevealed}
      />
    </div>
  );
}

export default GameScreen;
