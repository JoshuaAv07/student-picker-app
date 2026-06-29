import React from 'react';
import { Check, Minus, MinusCircle } from 'lucide-react';
import { AnswerResult } from '../types';
import { BASE_LIVES, MAX_LIVES } from '../utils/helpers';
import '../styles/AnswerButtons.css';

interface AnswerButtonsProps {
  onAnswer: (result: AnswerResult) => void;
  disabled: boolean;
  currentLives: number;
}

const AnswerButtons: React.FC<AnswerButtonsProps> = ({ onAnswer, disabled, currentLives }) => {
  const wrongLabel = currentLives >= MAX_LIVES
    ? `Wrong (back to ${BASE_LIVES})`
    : 'Wrong (−1 life)';

  return (
    <div className="answer-buttons">
      <p className="answer-prompt">How did they answer?</p>
      <div className="answer-buttons-row">
        <button
          type="button"
          className="answer-btn answer-btn-correct"
          onClick={() => onAnswer('correct')}
          disabled={disabled}
        >
          <Check size={18} />
          {currentLives >= MAX_LIVES ? 'Correct (max lives)' : 'Correct (+1 life)'}
        </button>
        <button
          type="button"
          className="answer-btn answer-btn-neutral"
          onClick={() => onAnswer('neutral')}
          disabled={disabled}
        >
          <Minus size={18} />
          Neutral (0)
        </button>
        <button
          type="button"
          className="answer-btn answer-btn-wrong"
          onClick={() => onAnswer('wrong')}
          disabled={disabled}
        >
          <MinusCircle size={18} />
          {wrongLabel}
        </button>
      </div>
    </div>
  );
};

export default AnswerButtons;
