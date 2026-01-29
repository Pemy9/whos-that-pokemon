import '../ErrorDisplay/ErrorDisplay.css';

// Network Error Component
export function NetworkError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="error-display">
      <div className="error-display__content">
        <div className="error-display__icon">🌐</div>
        <h2 className="error-display__title">Connection Lost</h2>
        <p className="error-display__message">
          Unable to connect to the server. Please check your internet connection
          and try again.
        </p>
        <div className="error-display__actions">
          <button
            className="error-display__button error-display__button--primary"
            onClick={onRetry}
          >
            🔄 Retry Connection
          </button>
        </div>
      </div>
    </div>
  );
}

// Timeout Error Component
export function TimeoutError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="error-display">
      <div className="error-display__content">
        <div className="error-display__icon">⏱️</div>
        <h2 className="error-display__title">Request Timeout</h2>
        <p className="error-display__message">
          The request took too long to complete. This might be due to slow
          network or server issues.
        </p>
        <div className="error-display__actions">
          <button
            className="error-display__button error-display__button--primary"
            onClick={onRetry}
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

// Not Found Error Component
export function NotFoundError({ onGoBack }: { onGoBack: () => void }) {
  return (
    <div className="error-display">
      <div className="error-display__content">
        <div className="error-display__icon">🔍</div>
        <h2 className="error-display__title">Not Found</h2>
        <p className="error-display__message">
          The requested Pokémon data could not be found. It might have been
          removed or never existed.
        </p>
        <div className="error-display__actions">
          <button
            className="error-display__button error-display__button--primary"
            onClick={onGoBack}
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

// Server Error Component
export function ServerError({
  onRetry,
  onGoBack,
}: {
  onRetry: () => void;
  onGoBack: () => void;
}) {
  return (
    <div className="error-display">
      <div className="error-display__content">
        <div className="error-display__icon">🔧</div>
        <h2 className="error-display__title">Server Error</h2>
        <p className="error-display__message">
          Something went wrong on our end. Our team has been notified and is
          working on a fix.
        </p>
        <div className="error-display__actions">
          <button
            className="error-display__button error-display__button--primary"
            onClick={onRetry}
          >
            🔄 Try Again
          </button>
          <button
            className="error-display__button error-display__button--secondary"
            onClick={onGoBack}
          >
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

// Generic Error Component
export function GenericError({
  message,
  onRetry,
  onGoBack,
}: {
  message: string;
  onRetry?: () => void;
  onGoBack?: () => void;
}) {
  return (
    <div className="error-display">
      <div className="error-display__content">
        <div className="error-display__icon">❌</div>
        <h2 className="error-display__title">Something Went Wrong</h2>
        <p className="error-display__message">{message}</p>
        <div className="error-display__actions">
          {onRetry && (
            <button
              className="error-display__button error-display__button--primary"
              onClick={onRetry}
            >
              🔄 Try Again
            </button>
          )}
          {onGoBack && (
            <button
              className="error-display__button error-display__button--secondary"
              onClick={onGoBack}
            >
              ← Go Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Loading Error (for when data fails to load)
export function LoadingError({
  resource = 'data',
  onRetry,
}: {
  resource?: string;
  onRetry: () => void;
}) {
  return (
    <div className="error-display">
      <div className="error-display__content">
        <div className="error-display__icon">⚠️</div>
        <h2 className="error-display__title">Failed to Load {resource}</h2>
        <p className="error-display__message">
          We couldn't load the {resource.toLowerCase()}. Please try again.
        </p>
        <div className="error-display__actions">
          <button
            className="error-display__button error-display__button--primary"
            onClick={onRetry}
          >
            🔄 Retry
          </button>
        </div>
      </div>
    </div>
  );
}
