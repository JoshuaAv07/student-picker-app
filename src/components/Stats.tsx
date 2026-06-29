import React from 'react';
import '../styles/Stats.css';

interface StatsProps {
  totalStudents: number;
  remainingStudents: number;
  selectedCount: number;
  averageFridayPoints: number;
  averageLives: number;
}

const Stats: React.FC<StatsProps> = ({
  totalStudents,
  remainingStudents,
  selectedCount,
  averageFridayPoints,
  averageLives,
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
        <div className="stat-value">{averageFridayPoints}</div>
        <div className="stat-label">Avg Friday Pts</div>
      </div>

      <div className="stat-card">
        <div className="stat-value">{averageLives}</div>
        <div className="stat-label">Avg Lives</div>
      </div>
    </div>
  );
};

export default Stats;
