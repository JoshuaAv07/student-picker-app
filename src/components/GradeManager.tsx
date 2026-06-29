import React from 'react';
import { GraduationCap } from 'lucide-react';
import { GradeGroup } from '../types';
import '../styles/GradeManager.css';

interface GradeManagerProps {
  gradeGroups: GradeGroup[];
  activeGradeId: string | null;
  onSelectGroup: (gradeId: string) => void;
}

const GradeManager: React.FC<GradeManagerProps> = ({
  gradeGroups,
  activeGradeId,
  onSelectGroup,
}) => {
  const activeGrade = gradeGroups.find(g => g.id === activeGradeId) ?? null;

  if (gradeGroups.length === 0 || !activeGrade) return null;

  return (
    <div className="grade-manager slide-up" style={{ animationDelay: '0.15s' }}>
      <div className="grade-manager-header">
        <div className="grade-manager-icon-wrapper">
          <GraduationCap className="grade-manager-icon" size={28} />
        </div>
        <h2 className="grade-manager-title">Roster</h2>
      </div>

      {gradeGroups.length > 1 && (
        <div className="saved-groups-list">
          {gradeGroups.map(grade => (
            <button
              key={grade.id}
              type="button"
              className={`saved-group-chip ${grade.id === activeGradeId ? 'active' : ''}`}
              onClick={() => onSelectGroup(grade.id)}
            >
              {grade.name}
              <span className="saved-group-chip-count">{grade.students.length}</span>
            </button>
          ))}
        </div>
      )}

      <p className="active-group-label">{activeGrade.name}</p>

      {activeGrade.students.length > 0 && (
        <div className="roster">
          <div className="roster-header">
            <span>Student</span>
            <span>Friday pts</span>
          </div>
          <ul className="roster-list">
            {[...activeGrade.students]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(student => (
                <li key={student.id} className="roster-item">
                  <span className="roster-name">{student.name}</span>
                  <span className="roster-points">{student.points}</span>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GradeManager;
