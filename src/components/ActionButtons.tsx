import React from 'react';
import { RotateCw } from 'lucide-react';
import '../styles/ActionButtons.css';

interface ActionButtonsProps {
  onPickStudent: () => void;
  onReset: () => void;
  isSpinning: boolean;
  hasStudents: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  onPickStudent, 
  onReset, 
  isSpinning, 
  hasStudents 
}) => {
  return (
    <div className="action-buttons-container slide-up" style={{ animationDelay: '0.4s' }}>
      <button
        onClick={onPickStudent}
        disabled={isSpinning || !hasStudents}
        className={`pick-button ${isSpinning || !hasStudents ? 'disabled' : ''}`}
      >
        {isSpinning ? '📖 Selecting...' : '✨ Pick Student'}
      </button>

      <button
        onClick={onReset}
        disabled={!hasStudents}
        className={`reset-button ${!hasStudents ? 'disabled' : ''}`}
      >
        <div className="reset-button-content">
          <RotateCw size={24} />
          Reset List
        </div>
      </button>
    </div>
  );
};

export default ActionButtons;
