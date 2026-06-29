import React from 'react';
import '../styles/Instructions.css';

const Instructions: React.FC = () => {
  return (
    <div className="instructions-container slide-up" style={{ animationDelay: '0.5s' }}>
      <h3 className="instructions-title">How to use</h3>
      <ol className="instructions-list">
        <li>Enter a name like <strong>Web Design</strong> or <strong>Big Data</strong>, then upload — the group is saved automatically</li>
        <li>CSV needs a <strong>name</strong> column; other columns are matched by header or column order (1st → Friday pts, 2nd → lives)</li>
        <li>Lives default to <strong>0</strong> when not in the file; the base-10 bonus rule applies during grading</li>
        <li>Click <strong>Pick Student</strong>, set their <strong>Friday pts</strong> (first round only), ask your question, then click <strong>Ready to grade</strong></li>
        <li>At 10 Friday pts: correct adds +1 life; wrong with lives loses 1 life (stays at 10). Wrong with 0 lives drops to 9</li>
        <li><strong>Reset Round</strong> shuffles the pick order — keeps Friday pts and lives, skips re-entering Friday pts on each pick</li>
        <li><strong>Reset Friday Points</strong> sets everyone to <strong>0</strong> Friday pts and brings back the Friday pts entry step (lives kept)</li>
        <li>At <strong>100%</strong> progress, <strong>Pick Student</strong> is blocked — use one of the reset buttons to continue</li>
      </ol>
    </div>
  );
};

export default Instructions;
