import React from 'react';
import { Check, Minus, MinusCircle } from 'lucide-react';
import { AnswerResult } from '../types';
import { BASE_LIVES } from '../utils/helpers';
import '../styles/AnswerButtons.css';

interface AnswerButtonsProps {
  onAnswer: (result: AnswerResult) => void;
  disabled: boolean;
  fridayPointsAtPick: number;
  currentLives: number;
}

const AnswerButtons: React.FC<AnswerButtonsProps> = ({
  onAnswer,
  disabled,
  fridayPointsAtPick,
  currentLives,
}) => {
  const correctLabel = fridayPointsAtPick >= BASE_LIVES
    ? 'Correct (+1 life)'
    : 'Correct (+1 pt)';

  const wrongLabel = fridayPointsAtPick >= BASE_LIVES && currentLives > 0
    ? 'Wrong (lose 1 life)'
    : 'Wrong (−1 pt)';

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
          {correctLabel}
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
