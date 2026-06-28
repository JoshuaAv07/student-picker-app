import React from 'react';
import { RotateCw } from 'lucide-react';
import '../styles/ActionButtons.css';

interface ActionButtonsProps {
  onPickStudent: () => void;
  onReset: () => void;
  isSpinning: boolean;
  hasStudents: boolean;
  disabled?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onPickStudent,
  onReset,
  isSpinning,
  hasStudents,
  disabled = false,
}) => {
  const pickDisabled = disabled || isSpinning || !hasStudents;

  const pickLabel = isSpinning
    ? 'Selecting...'
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
        onClick={onReset}
        disabled={!hasStudents || isSpinning || disabled}
        className="reset-button"
      >
        <div className="reset-button-content">
          <RotateCw size={24} />
          Reset Round
        </div>
      </button>
    </div>
  );
};

export default ActionButtons;
