import React from 'react';
import { Check, Minus, MinusCircle } from 'lucide-react';
import { AnswerResult } from '../types';
import '../styles/AnswerButtons.css';

interface AnswerButtonsProps {
  onAnswer: (result: AnswerResult) => void;
  disabled: boolean;
}

const AnswerButtons: React.FC<AnswerButtonsProps> = ({ onAnswer, disabled }) => {
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
          Correct (+1)
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
          Wrong (−1)
        </button>
      </div>
    </div>
  );
};

export default AnswerButtons;
