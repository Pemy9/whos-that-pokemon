import './InlineError.css';

interface InlineErrorProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

function InlineError({ message, onRetry, onDismiss }: InlineErrorProps) {
  return (
    <div className="inline-error">
      <div className="inline-error__icon">⚠️</div>
      <div className="inline-error__content">
        <p className="inline-error__message">{message}</p>
        <div className="inline-error__actions">
          {onRetry && (
            <button className="inline-error__button" onClick={onRetry}>
              🔄 Retry
            </button>
          )}
          {onDismiss && (
            <button className="inline-error__button inline-error__button--dismiss" onClick={onDismiss}>
              ✕ Dismiss
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default InlineError;
