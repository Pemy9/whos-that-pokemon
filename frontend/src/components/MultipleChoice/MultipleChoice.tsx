import type { Pokemon } from '../../types';
import './MultipleChoice.css';

interface MultipleChoiceProps {
  choices: Pokemon[];
  onSelect: (pokemon: Pokemon) => void;
  disabled?: boolean;
  correctPokemonId?: number;
  selectedPokemonId?: number;
}

function MultipleChoice({
  choices,
  onSelect,
  disabled = false,
  correctPokemonId,
  selectedPokemonId,
}: MultipleChoiceProps) {
  const handleClick = (pokemon: Pokemon) => {
    if (!disabled) {
      onSelect(pokemon);
    }
  };

  const getButtonClass = (pokemon: Pokemon): string => {
    const baseClass = 'choice-button';

    // If this pokemon was selected
    if (pokemon.id === selectedPokemonId) {
      // Was it correct?
      if (pokemon.id === correctPokemonId) {
        return `${baseClass} selected correct`;
      } else {
        return `${baseClass} selected wrong`;
      }
    }

    // If this is the correct answer (but not selected)
    if (pokemon.id === correctPokemonId) {
      return `${baseClass} correct`;
    }

    // Default state
    return baseClass;
  };

  return (
    <div className="multiple-choice">
      {choices.map((pokemon) => (
        <button
          key={pokemon.id}
          className={getButtonClass(pokemon)}
          onClick={() => handleClick(pokemon)}
          disabled={disabled}
        >
          {pokemon.name}
        </button>
      ))}
    </div>
  );
}

export default MultipleChoice;
