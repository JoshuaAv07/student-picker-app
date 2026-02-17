import React from 'react';
import { Users, Sparkles, Trophy } from 'lucide-react';
import '../styles/Stats.css';

interface StatsProps {
  totalStudents: number;
  remainingStudents: number;
  selectedCount: number;
}

const Stats: React.FC<StatsProps> = ({ totalStudents, remainingStudents, selectedCount }) => {
  return (
    <div className="stats-container slide-up" style={{ animationDelay: '0.2s' }}>
      <div className="stat-card">
        <div className="stat-icon-wrapper">
          <Users className="stat-icon" size={32} />
        </div>
        <div className="stat-value">{totalStudents}</div>
        <div className="stat-label">Total Students</div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper">
          <Sparkles className="stat-icon" size={32} />
        </div>
        <div className="stat-value">{remainingStudents}</div>
        <div className="stat-label">Remaining</div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper">
          <Trophy className="stat-icon" size={32} />
        </div>
        <div className="stat-value">{selectedCount}</div>
        <div className="stat-label">Selected</div>
      </div>
    </div>
  );
};

export default Stats;
