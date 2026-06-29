import React from 'react';
import '../styles/Instructions.css';

const Instructions: React.FC = () => {
  return (
    <div className="instructions-container slide-up" style={{ animationDelay: '0.5s' }}>
      <h3 className="instructions-title">How to use</h3>
      <ol className="instructions-list">
        <li>Enter a name like <strong>Web Design</strong> or <strong>Big Data</strong>, then upload — the group is saved automatically</li>
        <li>Upload your second class with <strong>+ Add new group</strong>; both stay saved in the browser</li>
        <li>Use the <strong>Saved groups</strong> dropdown to switch between classes</li>
        <li>Click <strong>Pick Student</strong>, set their <strong>assigned grade</strong>, then ask your question</li>
        <li>Click <strong>Ready to grade</strong>, then mark the answer: <strong>Correct (+1)</strong>, <strong>Wrong (−1)</strong>, or <strong>Neutral (0)</strong></li>
        <li>Pick again for the next student, or <strong>Reset Round</strong> when everyone has gone</li>
      </ol>
    </div>
  );
};

export default Instructions;
