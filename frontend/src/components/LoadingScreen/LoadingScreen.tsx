import './LoadingScreen.css';

interface LoadingScreenProps {
  message?: string;
}

function LoadingScreen({ message = 'Loading Pokémon...' }: LoadingScreenProps) {
  return (
    <div className="loading-screen">
      <div className="pokeball-spinner"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
}

export default LoadingScreen;