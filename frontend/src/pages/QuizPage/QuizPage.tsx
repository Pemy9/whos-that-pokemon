import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GameScreen from '../../components/GameScreen/GameScreen';
import type { GameSettings, Difficulty } from '../../types';
import './QuizPage.css';

function QuizPage() {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [settings, setSettings] = useState<GameSettings>({
    mode: 'visual',
    difficulty: 1,
    numberOfChoices: 4,
    questionCount: 10,
  });

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleExit = () => {
    setGameStarted(false);
    navigate('/');
  };

  const handleViewHighScores = () => {

    setGameStarted(false);
    navigate('/highscores');
  }

  if (gameStarted) {
    return <GameScreen settings={settings} onExit={handleExit} onViewHighScores={handleViewHighScores} />;
  }

  return (
    <>
    <h1 className="quiz-title">Who's that PoKéMoN ?</h1>
    <div className="quiz-container">

      <div className="settings-panel">
        <h2 className="settings-title">Game Settings</h2>

        <div className="form-group">
          <label className="form-label">
            Difficulty
          </label>
          <select
            className="form-select"
            value={settings.difficulty}
            onChange={(e) =>
              setSettings({
                ...settings,
                difficulty: Number(e.target.value) as Difficulty,
              })
            }
          >
            <option value={1}>Generation I (1-151)</option>
            <option value={2}>Generation I-III (1-386)</option>
            <option value={3}>All Generations (1-1025)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            Number of Questions
          </label>
          <select
            className="form-select"
            value={settings.questionCount}
            onChange={(e) =>
              setSettings({
                ...settings,
                questionCount: Number(e.target.value),
              })
            }
          >
            <option value={5}>5 Questions</option>
            <option value={10}>10 Questions</option>
            <option value={15}>15 Questions</option>
            <option value={20}>20 Questions</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            Answer Choices
          </label>
          <select
            className="form-select"
            value={settings.numberOfChoices}
            onChange={(e) =>
              setSettings({
                ...settings,
                numberOfChoices: Number(e.target.value),
              })
            }
          >
            <option value={4}>4 Choices</option>
            <option value={6}>6 Choices</option>
          </select>
        </div>
      </div>

      <button
        className="primary-button start-button"
        onClick={handleStartGame}
      >
        Start Game
      </button>

      <button
        className="secondary-button back-button"
        onClick={() => navigate('/')}
      >
        Back to Home
      </button>
    </div>
    </>
  );
}

export default QuizPage;
