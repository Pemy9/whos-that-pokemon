import type { HintType } from '../../types';
import './HintPanel.css';

interface HintPanelProps {
  hintsRemaining: number;
  onHintRequest: (hintType: HintType) => void;
  getHintValue: (hintType: HintType) => string | null;
  isHintRevealed: (hintType: HintType) => boolean;
  disabled?: boolean;
}

const HINT_CONFIG: Record<
  HintType,
  { label: string; icon: string; description: string }
> = {
  type: {
    label: 'Type',
    icon: '🔥',
    description: 'Reveal Pokemon type(s)',
  },
  firstLetter: {
    label: 'First Letter',
    icon: '🔤',
    description: 'Reveal first letter of name',
  },
  evolution: {
    label: 'Evolution',
    icon: '⭐',
    description: 'Reveal evolution stage',
  },
};

function HintPanel({
  hintsRemaining,
  onHintRequest,
  getHintValue,
  isHintRevealed,
  disabled = false,
}: HintPanelProps) {
  const handleHintClick = (hintType: HintType) => {
    if (disabled || hintsRemaining <= 0 || isHintRevealed(hintType)) {
      return;
    }
    onHintRequest(hintType);
  };

  const getButtonClass = (hintType: HintType): string => {
    let className = 'hint-button';

    if (isHintRevealed(hintType)) {
      className += ' revealed';
    }

    if (disabled || hintsRemaining <= 0) {
      className += ' disabled';
    }

    return className;
  };

  return (
    <div className="hint-panel">
      <div className="hint-panel-header">
        <h3>Hints</h3>
        <div className="hints-remaining">💡 {hintsRemaining} left</div>
      </div>

      <div className="hint-buttons">
        {(Object.keys(HINT_CONFIG) as HintType[]).map((hintType) => {
          const config = HINT_CONFIG[hintType];
          const value = getHintValue(hintType);
          const revealed = isHintRevealed(hintType);

          return (
            <div key={hintType} className="hint-item">
              <button
                className={getButtonClass(hintType)}
                onClick={() => handleHintClick(hintType)}
                disabled={disabled || hintsRemaining <= 0 || revealed}
                title={config.description}
              >
                <span className="hint-icon">{config.icon}</span>
                <span className="hint-label">{config.label}</span>
              </button>

              {revealed && value && <div className="hint-value">{value}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HintPanel;
