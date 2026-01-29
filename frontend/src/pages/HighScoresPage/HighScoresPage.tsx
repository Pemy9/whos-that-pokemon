import { useQuery } from '@apollo/client/react';
import { Link } from 'react-router-dom';
import { GET_HIGH_SCORES } from '../../graphql/queries';
import type { UserScore } from '../../types';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import ErrorDisplay from '../../components/ErrorDisplay/ErrorDisplay';
import pokemonTrophy from '../../assets/pokemon_trophy.png';
import './HighScoresPage.css';

function HighScoresPage() {
  const { data, loading, error } = useQuery<{ highScores: UserScore[] }>(
    GET_HIGH_SCORES,
    {
      variables: { limit: 10 },
    },
  );

  if (loading) return <LoadingScreen message="Loading high scores..." />;

  if (error) {
    return (
      <div className="highscores-container">
        <ErrorDisplay
          title="Failed to Load High Scores"
          message={
            error.message ||
            'Unable to fetch high scores. Please check your connection and try again.'
          }
          type="error"
          onRetry={() => window.location.reload()}
          onGoBack={() => window.history.back()}
        />
      </div>
    );
  }

  return (
    <div className="highscores-container">
      <h1 className="highscores-title"><img src={pokemonTrophy} className='highscores-title__image'></img> High Scores</h1>

      {data?.highScores && data.highScores.length > 0 ? (
        <table className="scores-table">
          <thead>
            <tr className="table-header">
              <th className="table-header-cell">Rank</th>
              <th className="table-header-cell">Name</th>
              <th className="table-header-cell right">Score</th>
              <th className="table-header-cell right">Date</th>
            </tr>
          </thead>
          <tbody>
            {data.highScores.map((score, index) => (
              <tr key={score.id} className="table-row">
                <td className="table-cell rank">
                  #{index + 1}
                </td>
                <td className="table-cell">{score.name}</td>
                <td className="table-cell right">
                  {score.score}
                </td>
                <td className="table-cell right">
                  {new Date(score.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="empty-state">No high scores yet! Be the first to play!</p>
      )}

      <div className="button-group">
        <Link to="/">
          <button className="primary-button">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}

export default HighScoresPage;
