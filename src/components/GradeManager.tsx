import React, { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { GradeGroup } from '../types';
import '../styles/GradeManager.css';

interface RosterNumericInputProps {
  value: number;
  onCommit: (value: number) => void;
  ariaLabel: string;
  inputClassName: string;
}

const RosterNumericInput: React.FC<RosterNumericInputProps> = ({
  value,
  onCommit,
  ariaLabel,
  inputClassName,
}) => {
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed === '' || trimmed === '-') {
      setDraft(String(value));
      return;
    }
    const parsed = Number.parseInt(trimmed, 10);
    if (Number.isNaN(parsed)) {
      setDraft(String(value));
      return;
    }
    onCommit(parsed);
  };

  const handleChange = (next: string) => {
    if (next === '' || next === '-' || /^-?\d+$/.test(next)) {
      setDraft(next);
    }
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      autoComplete="off"
      className={inputClassName}
      value={draft}
      onChange={e => handleChange(e.target.value)}
      onBlur={commit}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          e.currentTarget.blur();
        }
      }}
      aria-label={ariaLabel}
    />
  );
};

interface GradeManagerProps {
  gradeGroups: GradeGroup[];
  activeGradeId: string | null;
  onSelectGroup: (gradeId: string) => void;
  onUpdateLives: (studentId: string, lives: number) => void;
  onUpdateAttendancePoints: (studentId: string, attendancePoints: number) => void;
}

const GradeManager: React.FC<GradeManagerProps> = ({
  gradeGroups,
  activeGradeId,
  onSelectGroup,
  onUpdateLives,
  onUpdateAttendancePoints,
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
          <div className="roster-header roster-header-scores">
            <span>Student</span>
            <span>Friday pts</span>
            <span>Lives</span>
            <span className="roster-header-attendance" title="Attendance points">Att pts</span>
          </div>
          <ul className="roster-list">
            {[...activeGrade.students]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(student => (
                <li key={student.id} className="roster-item roster-item-scores">
                  <span className="roster-name">{student.name}</span>
                  <span className="roster-points">{student.fridayPoints}</span>
                  <RosterNumericInput
                    value={student.lives}
                    onCommit={value => onUpdateLives(student.id, value)}
                    ariaLabel={`Edit lives for ${student.name}`}
                    inputClassName="roster-value-input roster-lives-input"
                  />
                  <RosterNumericInput
                    value={student.attendancePoints}
                    onCommit={value => onUpdateAttendancePoints(student.id, value)}
                    ariaLabel={`Edit attendance points for ${student.name}`}
                    inputClassName="roster-value-input roster-attendance-input"
                  />
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GradeManager;
