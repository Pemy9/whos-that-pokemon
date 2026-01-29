import './ErrorDisplay.css';
import treeckoFainted from '../../assets/treecko_fainted.png';
import oshawottScared from '../../assets/oshawott_scared.png';
import officerJenny from '../../assets/officer_jenny.png';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  type?: 'error' | 'warning' | 'info';
  onRetry?: () => void;
  onGoBack?: () => void;
  showIcon?: boolean;
}

function ErrorDisplay({
  title = 'Oops!',
  message,
  type = 'error',
  onRetry,
  onGoBack,
  showIcon = true,
}: ErrorDisplayProps) {
  const getIcon = () => {
    switch (type) {
      case 'error':
        return <img src={treeckoFainted} alt="Treecko fainted error" className="error-display__image" />;
      case 'warning':
        return  <img src={oshawottScared} alt="Oshawott scared warning" className="error-display__image" />;
      case 'info':
        return  <img src={officerJenny} alt="Officer Jenny info" className="error-display__image" />;;
      default:
        return <img src={treeckoFainted} alt="Treecko fainted" className="error-display__image" />;
    }
  };

  return (
    <div className={`error-display error-display--${type}`}>
      <div className="error-display__content">
        {showIcon && <div className="error-display__icon">{getIcon()}</div>}
        <h2 className="error-display__title">{title}</h2>
        <p className="error-display__message">{message}</p>
        
        <div className="error-display__actions">
          {onRetry && (
            <button className="error-display__button error-display__button--primary" onClick={onRetry}>
              Try Again
            </button>
          )}
          {onGoBack && (
            <button className="error-display__button error-display__button--secondary" onClick={onGoBack}>
              Go Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ErrorDisplay;
