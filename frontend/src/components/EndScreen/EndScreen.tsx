import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { SAVE_SCORE } from '../../graphql/mutations';
import type { GameState } from '../../types';
import './EndScreen.css';

interface EndScreenProps {
  gameState: GameState;
  onPlayAgain: () => void;
  onViewHighScores: () => void;
  onMainMenu: () => void;
}

const getGrade = (correctAnswers: number, totalQuestions: number): string => {
  const percentage = (correctAnswers / totalQuestions) * 100;

  if (percentage >= 90) return 'S';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
};

function EndScreen({
  gameState,
  onPlayAgain,
  onViewHighScores,
  onMainMenu,
}: EndScreenProps) {
  const [playerName, setPlayerName] = useState('');
  const [scoreSaved, setScoreSaved] = useState(false);
  const [saveScore, { loading: savingScore, error: saveError }] =
    useMutation(SAVE_SCORE);

  const handleSaveScore = async () => {
    if (!playerName.trim()) {
      alert('Please enter your name!');
      return;
    }

    try {
      await saveScore({
        variables: {
          name: playerName.trim(),
          score: gameState.score,
        },
      });

      setScoreSaved(true);
    } catch (err) {
      console.error('Error saving score:', err);
    }
  };

  return (
    <div className="end-screen">
      <div className="end-screen-content">
        <h1 className="end-screen-title">Game Over!</h1>

        <div className="final-score">
          <div className="score-label">Final Score</div>
          <div className="score-value">{gameState.score}</div>
          <div className="grade-badge">
            Grade:{' '}
            {getGrade(
              gameState.correctAnswers,
              gameState.correctAnswers + gameState.wrongAnswers,
            )}
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-icon">✅</div>
            <div className="stat-label">Correct</div>
            <div className="stat-value">{gameState.correctAnswers}</div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">❌</div>
            <div className="stat-label">Wrong</div>
            <div className="stat-value">{gameState.wrongAnswers}</div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">🔥</div>
            <div className="stat-label">Best Streak</div>
            <div className="stat-value">{gameState.streak}</div>
          </div>

          <div className="stat-item">
            <div className="stat-icon">💡</div>
            <div className="stat-label">Hints Used</div>
            <div className="stat-value">{gameState.hintsUsed}</div>
          </div>
        </div>

        {!scoreSaved ? (
          <div className="save-score-section">
            <h3>Save Your Score</h3>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="name-input"
              maxLength={50}
            />
            <button
              onClick={handleSaveScore}
              disabled={savingScore || !playerName.trim()}
              className="save-button"
            >
              {savingScore ? 'Saving...' : 'Save Score'}
            </button>
            {saveError && (
              <div className="error-message">
                Failed to save score. Please try again.
              </div>
            )}
          </div>
        ) : (
          <div className="score-saved-message">
            ✅ Score saved successfully!
          </div>
        )}

        <div className="end-screen-actions">
          <button onClick={onPlayAgain} className="play-again-button">
            Play Again
          </button>
          <button onClick={onViewHighScores} className="highscores-button">
            View High Scores
          </button>
          <button onClick={onMainMenu} className="main-menu-button">
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
}

export default EndScreen;
