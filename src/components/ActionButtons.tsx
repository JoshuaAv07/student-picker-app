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
        type="button"
        onClick={onPickStudent}
        disabled={isSpinning || !hasStudents}
        className="pick-button"
      >
        {isSpinning ? 'Selecting...' : 'Pick Student'}
      </button>

      <button
        type="button"
        onClick={onReset}
        disabled={!hasStudents}
        className="reset-button"
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
