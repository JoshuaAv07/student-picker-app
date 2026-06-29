import React from 'react';
import AnswerButtons from './AnswerButtons';
import { AnswerResult } from '../types';
import '../styles/WinnerDisplay.css';

export type ParticipationPhase = 'asking' | 'grading' | 'done';

interface WinnerDisplayProps {
  studentName: string;
  gradeInput: string;
  livesAtPick: number | null;
  currentLives: number;
  isSpinning: boolean;
  phase: ParticipationPhase;
  onGradeInputChange: (value: string) => void;
  onStartGrading: () => void;
  onAnswer: (result: AnswerResult) => void;
}

const WinnerDisplay: React.FC<WinnerDisplayProps> = ({
  studentName,
  gradeInput,
  livesAtPick,
  currentLives,
  isSpinning,
  phase,
  onGradeInputChange,
  onStartGrading,
  onAnswer,
}) => {
  const handleGradeChange = (value: string) => {
    if (value === '' || value === '-' || /^-?\d+$/.test(value)) {
      onGradeInputChange(value);
    }
  };

  const adjustGrade = (delta: number) => {
    const current = gradeInput === '' || gradeInput === '-' ? 0 : Number.parseInt(gradeInput, 10);
    onGradeInputChange(String(Number.isNaN(current) ? delta : current + delta));
  };

  const livesChanged = phase === 'done' && livesAtPick !== null && currentLives !== livesAtPick;

  return (
    <div className={`winner-display bounce-in ${!isSpinning ? 'winner-card' : ''}`}>
      <div className="winner-header">Selected student</div>
      <div className="winner-name">{studentName}</div>

      {!isSpinning && (
        <>
          {phase === 'asking' && (
            <div className="winner-grade-input-wrap">
              <label className="winner-grade-label" htmlFor="assigned-grade">
                Lives
              </label>
              <div className="winner-grade-controls">
                <button
                  type="button"
                  className="grade-step-btn"
                  onClick={() => adjustGrade(-1)}
                  aria-label="Decrease lives by 1"
                >
                  −
                </button>
                <input
                  id="assigned-grade"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={gradeInput}
                  onChange={e => handleGradeChange(e.target.value)}
                  placeholder="10"
                  className="winner-grade-input"
                />
                <button
                  type="button"
                  className="grade-step-btn"
                  onClick={() => adjustGrade(1)}
                  aria-label="Increase lives by 1"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {(phase === 'grading' || phase === 'done') && livesAtPick !== null && (
            <div className="winner-points">
              Lives at pick: <strong>{livesAtPick}</strong>
            </div>
          )}

          {phase === 'asking' && (
            <div className="winner-question-phase">
              <p className="winner-question-prompt">Ask your question now.</p>
              <button type="button" className="ready-to-grade-btn" onClick={onStartGrading}>
                Ready to grade
              </button>
            </div>
          )}

          {phase === 'grading' && (
            <AnswerButtons onAnswer={onAnswer} disabled={false} currentLives={livesAtPick ?? currentLives} />
          )}

          {livesChanged && (
            <div className="winner-points-updated">
              Updated lives: <strong>{currentLives}</strong>
            </div>
          )}

          {phase === 'done' && (
            <p className="winner-scored-hint">
              Lives recorded. Pick again for the next student.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default WinnerDisplay;
