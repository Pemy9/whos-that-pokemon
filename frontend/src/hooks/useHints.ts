import { useState } from 'react';
import type { Pokemon, HintType } from '../types';

export const useHints = (pokemon: Pokemon | null, hintsAvailable: number) => {
  const [revealedHints, setRevealedHints] = useState<Set<HintType>>(new Set());

  const revealHint = (hintType: HintType): boolean => {
    if (hintsAvailable <= 0) {
      return false;
    }

    if (revealedHints.has(hintType)) {
      return false;
    }

    setRevealedHints((prev) => new Set(prev).add(hintType));
    return true;
  };

  const getHintValue = (hintType: HintType): string | null => {
    if (!pokemon || !revealedHints.has(hintType)) {
      return null;
    }

    switch (hintType) {
      case 'type':
        return pokemon.types.join(' / ');
      case 'firstLetter':
        return pokemon.name[0];
      case 'evolution':
        return 'Base Form'; // Simplified for now
      default:
        return null;
    }
  };

  const resetHints = () => {
    setRevealedHints(new Set());
  };

  const isHintRevealed = (hintType: HintType): boolean => {
    return revealedHints.has(hintType);
  };

  return {
    revealedHints: Array.from(revealedHints),
    revealHint,
    getHintValue,
    resetHints,
    isHintRevealed,
    canRevealMore: hintsAvailable > 0 && revealedHints.size < 3,
  };
};
