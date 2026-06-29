import React from 'react';
import AnswerButtons from './AnswerButtons';
import { AnswerResult } from '../types';
import '../styles/WinnerDisplay.css';

export type ParticipationPhase = 'asking' | 'grading' | 'done';

interface WinnerDisplayProps {
  studentName: string;
  gradeInput: string;
  fridayPointsAtPick: number | null;
  livesAtPick: number | null;
  currentFridayPoints: number;
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
  fridayPointsAtPick,
  livesAtPick,
  currentFridayPoints,
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

  const fridayChanged = fridayPointsAtPick !== null && currentFridayPoints !== fridayPointsAtPick;
  const livesChanged = livesAtPick !== null && currentLives !== livesAtPick;
  const scoresChanged = phase === 'done' && (fridayChanged || livesChanged);

  return (
    <div className={`winner-display bounce-in ${!isSpinning ? 'winner-card' : ''}`}>
      <div className="winner-header">Selected student</div>
      <div className="winner-name">{studentName}</div>

      {!isSpinning && (
        <>
          {phase === 'asking' && (
            <>
              <div className="winner-score-row">
                <span className="winner-score-label">Lives</span>
                <strong>{currentLives}</strong>
              </div>
              <div className="winner-grade-input-wrap">
                <label className="winner-grade-label" htmlFor="assigned-grade">
                  Friday pts
                </label>
                <div className="winner-grade-controls">
                  <button
                    type="button"
                    className="grade-step-btn"
                    onClick={() => adjustGrade(-1)}
                    aria-label="Decrease Friday points by 1"
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
                    placeholder="0"
                    className="winner-grade-input"
                  />
                  <button
                    type="button"
                    className="grade-step-btn"
                    onClick={() => adjustGrade(1)}
                    aria-label="Increase Friday points by 1"
                  >
                    +
                  </button>
                </div>
              </div>
            </>
          )}

          {(phase === 'grading' || phase === 'done') && fridayPointsAtPick !== null && livesAtPick !== null && (
            <div className="winner-score-summary">
              <div className="winner-points">
                Friday pts at pick: <strong>{fridayPointsAtPick}</strong>
              </div>
              <div className="winner-points">
                Lives at pick: <strong>{livesAtPick}</strong>
              </div>
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

          {phase === 'grading' && fridayPointsAtPick !== null && (
            <AnswerButtons
              onAnswer={onAnswer}
              disabled={false}
              fridayPointsAtPick={fridayPointsAtPick}
              currentLives={currentLives}
            />
          )}

          {scoresChanged && (
            <div className="winner-points-updated">
              Updated — Friday pts: <strong>{currentFridayPoints}</strong>, Lives: <strong>{currentLives}</strong>
            </div>
          )}

          {phase === 'done' && (
            <p className="winner-scored-hint">
              Scores recorded. Pick again for the next student.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default WinnerDisplay;
