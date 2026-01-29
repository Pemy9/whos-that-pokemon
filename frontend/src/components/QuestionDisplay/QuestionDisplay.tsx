import './QuestionDisplay.css';

interface QuestionDisplayProps {
  current: number;
  total: number;
  percentage: number;
}

function QuestionDisplay({ current, total, percentage }: QuestionDisplayProps) {
  return (
  <div className="question-display">
    <h2 className="question-number">
      Question {current} of {total}
    </h2>
    
    <div className="progress-bar-container">
      <div 
        className="progress-bar-fill" 
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);
}

export default QuestionDisplay;