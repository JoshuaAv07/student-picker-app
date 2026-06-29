import React from 'react';
import { PickMode } from '../types';
import '../styles/PickModeToggle.css';

interface PickModeToggleProps {
  mode: PickMode;
  onChange: (mode: PickMode) => void;
  disabled?: boolean;
}

const PickModeToggle: React.FC<PickModeToggleProps> = ({ mode, onChange, disabled = false }) => {
  return (
    <div className="pick-mode-toggle slide-up" style={{ animationDelay: '0.35s' }}>
      <span className="pick-mode-label">Mode</span>
      <div className="pick-mode-options" role="group" aria-label="Pick mode">
        <button
          type="button"
          className={`pick-mode-option ${mode === 'easy' ? 'active' : ''}`}
          onClick={() => onChange('easy')}
          disabled={disabled}
          aria-pressed={mode === 'easy'}
        >
          Easy
        </button>
        <button
          type="button"
          className={`pick-mode-option ${mode === 'hard' ? 'active' : ''}`}
          onClick={() => onChange('hard')}
          disabled={disabled}
          aria-pressed={mode === 'hard'}
        >
          Hard
        </button>
      </div>
      <p className="pick-mode-hint">
        {mode === 'easy'
          ? 'Each student is picked once per round.'
          : 'Anyone can be picked again at any time.'}
      </p>
    </div>
  );
};

export default PickModeToggle;
