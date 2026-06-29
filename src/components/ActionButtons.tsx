import React from 'react';
import { RotateCw, RefreshCw } from 'lucide-react';
import '../styles/ActionButtons.css';

interface ActionButtonsProps {
  onPickStudent: () => void;
  onResetRound: () => void;
  onResetFridayPoints: () => void;
  isSpinning: boolean;
  hasStudents: boolean;
  roundComplete?: boolean;
  disabled?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onPickStudent,
  onResetRound,
  onResetFridayPoints,
  isSpinning,
  hasStudents,
  roundComplete = false,
  disabled = false,
}) => {
  const pickDisabled = disabled || isSpinning || !hasStudents || roundComplete;
  const secondaryDisabled = !hasStudents || isSpinning || disabled;

  const pickLabel = isSpinning
    ? 'Selecting...'
    : roundComplete
      ? 'Round complete'
      : disabled
        ? 'Finish current student first'
        : 'Pick Student';

  return (
    <div className="action-buttons-container slide-up" style={{ animationDelay: '0.4s' }}>
      <button
        type="button"
        onClick={onPickStudent}
        disabled={pickDisabled}
        className="pick-button"
      >
        {pickLabel}
      </button>

      <button
        type="button"
        onClick={onResetRound}
        disabled={secondaryDisabled}
        className="reset-button"
      >
        <div className="reset-button-content">
          <RotateCw size={24} />
          Reset Round
        </div>
      </button>

      <button
        type="button"
        onClick={onResetFridayPoints}
        disabled={secondaryDisabled}
        className="reset-friday-button"
      >
        <div className="reset-button-content">
          <RefreshCw size={24} />
          Reset Friday Points
        </div>
      </button>
    </div>
  );
};

export default ActionButtons;
