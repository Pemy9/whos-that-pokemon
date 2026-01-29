import { gql } from '@apollo/client';

// Save a score
export const SAVE_SCORE = gql`
  mutation SaveScore($name: String!, $score: Int!) {
    saveScore(name: $name, score: $score) {
      id
      name
      score
      date
    }
  }
`;
