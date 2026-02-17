import React from 'react';
import '../styles/Instructions.css';

const Instructions: React.FC = () => {
  return (
    <div className="instructions-container slide-up" style={{ animationDelay: '0.5s' }}>
      <h3 className="instructions-title">
        <span className="instructions-icon">📋</span>
        How to use:
      </h3>
      <ol className="instructions-list">
        <li>Upload a CSV or TXT file with student names</li>
        <li>CSV files should have a "name" column</li>
        <li>TXT files should have one name per line</li>
        <li>Click "Pick Student" to randomly select a student</li>
        <li>Each student is picked only once until everyone has participated</li>
        <li>The list automatically resets when all students have been picked</li>
      </ol>
    </div>
  );
};

export default Instructions;
