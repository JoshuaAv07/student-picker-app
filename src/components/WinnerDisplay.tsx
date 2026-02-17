import React from 'react';
import '../styles/WinnerDisplay.css';

interface WinnerDisplayProps {
  selectedStudent: string;
  isSpinning: boolean;
  allPicked: boolean;
}

const WinnerDisplay: React.FC<WinnerDisplayProps> = ({ 
  selectedStudent, 
  isSpinning, 
  allPicked 
}) => {
  return (
    <div className={`winner-display bounce-in ${!isSpinning ? 'winner-card' : ''}`}>
      <div className="winner-header">📚 SELECTED STUDENT 📚</div>
      <div className="winner-name">
        {selectedStudent}
      </div>
      {!isSpinning && allPicked && (
        <div className="winner-complete-message">
          🎓 All students have participated! 🎓
        </div>
      )}
    </div>
  );
};

export default WinnerDisplay;
