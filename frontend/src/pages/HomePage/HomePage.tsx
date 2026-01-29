import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-container">
      <h1 className="pokemon-title">Who's that PoKéMoN ?</h1>
      <p className="subtitle">Test your <span className='pokemon-subtitle'>PoKéMoN</span> knowledge!</p>
      
      <div className="button-container">
        <Link to="/quiz">
          <button className="primary-button">Start Quiz</button>
        </Link>
      </div>

      <div className="button-container">
        <Link to="/highscores">
          <button className="secondary-button">View High Scores</button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
