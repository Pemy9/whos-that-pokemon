import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import QuizPage from './pages/QuizPage/QuizPage';
import HighScoresPage from './pages/HighScoresPage/HighScoresPage';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/highscores" element={<HighScoresPage />} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

export default App;
