import './Timer.css';

interface TimerProps {
  timeRemaining: number;
  isRunning: boolean;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

function Timer({ timeRemaining, isRunning }: TimerProps) {
  const getTimerClass = (): string => {
  let className = 'timer';
  
  if (!isRunning) {
    className += ' paused';
  } else if (timeRemaining <= 5) {
    className += ' critical';
  } else if (timeRemaining <= 10) {
    className += ' warning';
  }
  
  return className;
};

return (
  <div className={getTimerClass()}>
    <div className="timer-icon">⏱️</div>
    <div className="timer-display">
      {formatTime(timeRemaining)}
    </div>
  </div>
);
}

export default Timer;