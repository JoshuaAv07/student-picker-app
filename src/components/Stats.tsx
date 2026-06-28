import React from 'react';
import '../styles/Stats.css';

interface StatsProps {
  totalStudents: number;
  remainingStudents: number;
  selectedCount: number;
  averagePoints: number;
}

const Stats: React.FC<StatsProps> = ({
  totalStudents,
  remainingStudents,
  selectedCount,
  averagePoints,
}) => {
  return (
    <div className="stats-container slide-up" style={{ animationDelay: '0.2s' }}>
      <div className="stat-card">
        <div className="stat-value">{totalStudents}</div>
        <div className="stat-label">Total Students</div>
      </div>

      <div className="stat-card">
        <div className="stat-value">{remainingStudents}</div>
        <div className="stat-label">Remaining</div>
      </div>

      <div className="stat-card">
        <div className="stat-value">{selectedCount}</div>
        <div className="stat-label">Participated</div>
      </div>

      <div className="stat-card">
        <div className="stat-value">{averagePoints}</div>
        <div className="stat-label">Avg Points</div>
      </div>
    </div>
  );
};

export default Stats;
