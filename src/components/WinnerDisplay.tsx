import React from 'react';
import AnswerButtons from './AnswerButtons';
import { AnswerResult } from '../types';
import '../styles/WinnerDisplay.css';

export type ParticipationPhase = 'asking' | 'grading' | 'done';

interface WinnerDisplayProps {
  studentName: string;
  pointsAtPick: number;
  currentPoints: number;
  isSpinning: boolean;
  phase: ParticipationPhase;
  onStartGrading: () => void;
  onAnswer: (result: AnswerResult) => void;
}

const WinnerDisplay: React.FC<WinnerDisplayProps> = ({
  studentName,
  pointsAtPick,
  currentPoints,
  isSpinning,
  phase,
  onStartGrading,
  onAnswer,
}) => {
  const gradeChanged = phase === 'done' && currentPoints !== pointsAtPick;

  return (
    <div className={`winner-display bounce-in ${!isSpinning ? 'winner-card' : ''}`}>
      <div className="winner-header">Selected student</div>
      <div className="winner-name">{studentName}</div>

      {!isSpinning && (
        <>
          <div className="winner-points">
            Assigned grade: <strong>{pointsAtPick}</strong> {pointsAtPick === 1 ? 'point' : 'points'}
          </div>

          {phase === 'asking' && (
            <div className="winner-question-phase">
              <p className="winner-question-prompt">Ask your question now.</p>
              <button type="button" className="ready-to-grade-btn" onClick={onStartGrading}>
                Ready to grade
              </button>
            </div>
          )}

          {phase === 'grading' && (
            <AnswerButtons onAnswer={onAnswer} disabled={false} />
          )}

          {gradeChanged && (
            <div className="winner-points-updated">
              Updated grade: <strong>{currentPoints}</strong> {currentPoints === 1 ? 'point' : 'points'}
            </div>
          )}

          {phase === 'done' && (
            <p className="winner-scored-hint">
              Grade recorded. Pick again for the next student.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default WinnerDisplay;
