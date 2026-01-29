import './ScoreBoard.css';

interface ScoreBoardProps {
  score: number;
  streak: number;
  correctAnswers: number;
  wrongAnswers: number;
  hintsRemaining: number;
}

function ScoreBoard({ 
  score, 
  streak, 
  correctAnswers, 
  wrongAnswers, 
  hintsRemaining 
}: ScoreBoardProps) {
  return (
  <div className="scoreboard">
    <div className="score-item main-score">
      <span className="label">Score</span>
      <span className="value">{score}</span>
    </div>
    
    <div className={`score-item streak ${streak > 0 ? 'active' : ''}`}>
      <span className="label">Streak</span>
      <span className="value">
        {streak > 0 ? `🔥 ${streak}x` : '0x'}
      </span>
    </div>
    
    <div className="score-item">
      <span className="label">Correct</span>
      <span className="value correct-count">✅ {correctAnswers}</span>
    </div>
    
    <div className="score-item">
      <span className="label">Wrong</span>
      <span className="value wrong-count">❌ {wrongAnswers}</span>
    </div>
    
    <div className="score-item">
      <span className="label">Hints</span>
      <span className="value hints-count">💡 {hintsRemaining}</span>
    </div>
  </div>
);
}

export default ScoreBoard;