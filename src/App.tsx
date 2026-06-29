import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import GroupUpload from './components/GroupUpload';
import GradeManager from './components/GradeManager';
import Stats from './components/Stats';
import ProgressBar from './components/ProgressBar';
import WinnerDisplay, { ParticipationPhase } from './components/WinnerDisplay';
import ActionButtons from './components/ActionButtons';
import Instructions from './components/Instructions';
import { AnswerResult, AppData, GradeGroup, ParsedStudentRow } from './types';
import {
  applyFridayPointsChange,
  applyLivesChange,
  createGradeGroup,
  createStudent,
  formatAnswerFeedback,
  getActiveGrade,
  getStudentById,
  groupNameFromFile,
  loadAppData,
  parseCSV,
  parseTXT,
  buildUploadedFridayPoints,
  shuffleIds,
  saveAppData,
} from './utils/helpers';
import './styles/global.css';
import './styles/animations.css';
import './styles/App.css';

const updateGradeInData = (
  data: AppData,
  gradeId: string,
  updater: (grade: GradeGroup) => GradeGroup
): AppData => ({
  ...data,
  gradeGroups: data.gradeGroups.map(g =>
    g.id === gradeId ? updater(g) : g
  ),
});

const App: React.FC = () => {
  const [appData, setAppData] = useState<AppData>(() => loadAppData());
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [gradeInput, setGradeInput] = useState('');
  const [fridayPointsAtPick, setFridayPointsAtPick] = useState<number | null>(null);
  const [livesAtPick, setLivesAtPick] = useState<number | null>(null);
  const [participationPhase, setParticipationPhase] = useState<ParticipationPhase | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);

  const activeGrade = getActiveGrade(appData);

  useEffect(() => {
    saveAppData(appData);
  }, [appData]);

  const clearPickState = () => {
    setSelectedStudentId(null);
    setGradeInput('');
    setFridayPointsAtPick(null);
    setLivesAtPick(null);
    setParticipationPhase(null);
    setIsSpinning(false);
    setLastFeedback(null);
  };

  const setActiveGradeId = (gradeId: string) => {
    setAppData(prev => ({ ...prev, activeGradeId: gradeId }));
    clearPickState();
  };

  const handleGroupUpload = async (file: File, groupName: string) => {
    clearPickState();

    try {
      const text = await file.text();
      let rows: ParsedStudentRow[];

      if (file.name.endsWith('.csv')) {
        rows = parseCSV(text);
      } else if (file.name.endsWith('.txt')) {
        rows = parseTXT(text);
      } else {
        throw new Error('Unsupported file format. Use CSV or TXT.');
      }

      if (rows.length === 0) {
        throw new Error('No students found in file');
      }

      const name = groupName.trim() || groupNameFromFile(file.name);
      const uploadedFridayPoints = buildUploadedFridayPoints(rows);

      setAppData(prev => {
        const existing = prev.gradeGroups.find(
          g => g.name.toLowerCase() === name.toLowerCase()
        );

        const students = rows.map(row => {
          const existingStudent = existing?.students.find(
            s => s.name.toLowerCase() === row.name.toLowerCase()
          );
          if (existingStudent) {
            return {
              ...existingStudent,
              name: row.name.trim(),
              fridayPoints: row.fridayPoints,
              fridayPointsBaseline: row.fridayPoints,
            };
          }
          return createStudent(row.name, row.fridayPoints, row.lives);
        });
        const studentIds = students.map(s => s.id);

        if (existing) {
          return {
            ...prev,
            activeGradeId: existing.id,
            gradeGroups: prev.gradeGroups.map(g =>
              g.id === existing.id
                ? {
                    ...g,
                    name,
                    students,
                    remainingStudentIds: studentIds,
                    sourceFileName: file.name,
                    uploadedFridayPoints,
                    fridayPointsSnapshottedAtUpload: true,
                    requireFridayEntry: true,
                  }
                : g
            ),
          };
        }

        const grade = createGradeGroup(name);
        grade.students = students;
        grade.remainingStudentIds = studentIds;
        grade.sourceFileName = file.name;
        grade.uploadedFridayPoints = uploadedFridayPoints;
        grade.fridayPointsSnapshottedAtUpload = true;
        grade.requireFridayEntry = true;

        return {
          gradeGroups: [...prev.gradeGroups, grade],
          activeGradeId: grade.id,
        };
      });
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to read file'}`);
    }
  };

  const pickStudent = () => {
    if (!activeGrade || activeGrade.students.length === 0) {
      alert('Upload a group list first!');
      return;
    }

    if (activeGrade.remainingStudentIds.length === 0) {
      return;
    }

    const poolIds = activeGrade.remainingStudentIds;
    const poolStudents = poolIds
      .map(id => getStudentById(activeGrade, id))
      .filter((s): s is NonNullable<typeof s> => s !== undefined);

    if (poolStudents.length === 0) return;

    setIsSpinning(true);
    setParticipationPhase(null);
    setLastFeedback(null);

    const spinInterval = setInterval(() => {
      const random = poolStudents[Math.floor(Math.random() * poolStudents.length)];
      setSelectedStudentId(random.id);
    }, 100);

    setTimeout(() => {
      clearInterval(spinInterval);

      const chosen = poolStudents[Math.floor(Math.random() * poolStudents.length)];
      setSelectedStudentId(chosen.id);

      const needsFridayEntry = activeGrade.requireFridayEntry !== false;
      if (needsFridayEntry) {
        setGradeInput(String(chosen.fridayPoints));
        setFridayPointsAtPick(null);
        setLivesAtPick(null);
        setParticipationPhase('asking');
      } else {
        setGradeInput(String(chosen.fridayPoints));
        setFridayPointsAtPick(chosen.fridayPoints);
        setLivesAtPick(chosen.lives);
        setParticipationPhase('grading');
      }
      setIsSpinning(false);
    }, 1000);
  };

  const handleStartGrading = () => {
    if (!activeGrade || !selectedStudentId) return;

    const trimmed = gradeInput.trim();
    if (trimmed === '') {
      alert('Enter the starting Friday pts before continuing.');
      return;
    }

    const assigned = Number.parseInt(trimmed, 10);
    if (Number.isNaN(assigned)) {
      alert('Enter a valid whole number for Friday pts.');
      return;
    }

    const student = getStudentById(activeGrade, selectedStudentId);
    if (!student) return;

    setFridayPointsAtPick(assigned);
    setLivesAtPick(student.lives);
    setAppData(prev =>
      updateGradeInData(prev, activeGrade.id, grade => ({
        ...grade,
        students: grade.students.map(s =>
          s.id === selectedStudentId ? { ...s, fridayPoints: assigned } : s
        ),
      }))
    );
    setParticipationPhase('grading');
  };

  const handleAnswer = useCallback((result: AnswerResult) => {
    if (!activeGrade || !selectedStudentId || participationPhase !== 'grading' || fridayPointsAtPick === null) {
      return;
    }

    const student = getStudentById(activeGrade, selectedStudentId);
    if (!student) return;

    const livesBefore = student.lives;
    const fridayBefore = fridayPointsAtPick;
    const newFridayPoints = applyFridayPointsChange(fridayBefore, livesBefore, result);
    const newLives = applyLivesChange(livesBefore, fridayBefore, result);
    const newRemaining = activeGrade.remainingStudentIds.filter(id => id !== selectedStudentId);
    let feedback = formatAnswerFeedback(
      student.name,
      result,
      livesBefore,
      newLives,
      fridayBefore,
      newFridayPoints
    );
    if (newRemaining.length === 0) {
      feedback += ' — All students have participated this round!';
    }

    setAppData(prev =>
      updateGradeInData(prev, activeGrade.id, grade => ({
        ...grade,
        students: grade.students.map(s =>
          s.id === selectedStudentId
            ? { ...s, lives: newLives, fridayPoints: newFridayPoints }
            : s
        ),
        remainingStudentIds: newRemaining,
      }))
    );

    setLastFeedback(feedback);
    setParticipationPhase('done');
  }, [activeGrade, selectedStudentId, participationPhase, fridayPointsAtPick]);

  const resetRound = () => {
    if (!activeGrade || activeGrade.students.length === 0) return;

    setAppData(prev =>
      updateGradeInData(prev, activeGrade.id, grade => ({
        ...grade,
        remainingStudentIds: shuffleIds(grade.students.map(s => s.id)),
        requireFridayEntry: false,
      }))
    );
    clearPickState();
    setLastFeedback('New round started — Friday pts and lives unchanged.');
  };

  const resetFridayPoints = () => {
    if (!activeGrade || activeGrade.students.length === 0) return;

    setAppData(prev =>
      updateGradeInData(prev, activeGrade.id, grade => ({
        ...grade,
        students: grade.students.map(s => ({ ...s, fridayPoints: 0 })),
        remainingStudentIds: shuffleIds(grade.students.map(s => s.id)),
        requireFridayEntry: true,
      }))
    );
    clearPickState();
    setLastFeedback('Friday points reset to 0. Lives unchanged.');
  };

  const handleUpdateLives = (studentId: string, lives: number) => {
    if (!activeGrade) return;

    setAppData(prev =>
      updateGradeInData(prev, activeGrade.id, grade => ({
        ...grade,
        students: grade.students.map(s =>
          s.id === studentId ? { ...s, lives } : s
        ),
      }))
    );
  };

  const selectedStudent = selectedStudentId && activeGrade
    ? getStudentById(activeGrade, selectedStudentId)
    : undefined;

  const students = activeGrade?.students ?? [];
  const remainingCount = activeGrade?.remainingStudentIds.length ?? 0;
  const totalCount = students.length;
  const participatedCount = totalCount - remainingCount;
  const progress = totalCount > 0 ? (participatedCount / totalCount) * 100 : 0;
  const roundComplete = totalCount > 0 && remainingCount === 0;
  const hasGroups = appData.gradeGroups.length > 0;
  const participationInProgress = participationPhase === 'asking' || participationPhase === 'grading';

  return (
    <div className="app-container">
      <div className="app-content">
        <Header />

        <GroupUpload
          gradeGroups={appData.gradeGroups}
          activeGradeId={appData.activeGradeId}
          onSelectGroup={setActiveGradeId}
          onUpload={handleGroupUpload}
        />

        <GradeManager
          gradeGroups={appData.gradeGroups}
          activeGradeId={appData.activeGradeId}
          onSelectGroup={setActiveGradeId}
          onUpdateLives={handleUpdateLives}
        />

        {activeGrade && totalCount > 0 && (
          <>
            <Stats
              totalStudents={totalCount}
              remainingStudents={remainingCount}
              selectedCount={participatedCount}
            />
            <ProgressBar progress={progress} />
          </>
        )}

        {selectedStudent && participationPhase && (
          <WinnerDisplay
            studentName={selectedStudent.name}
            gradeInput={gradeInput}
            fridayPointsAtPick={fridayPointsAtPick}
            livesAtPick={livesAtPick}
            currentFridayPoints={selectedStudent.fridayPoints}
            currentLives={selectedStudent.lives}
            isSpinning={isSpinning}
            phase={participationPhase}
            onGradeInputChange={setGradeInput}
            onStartGrading={handleStartGrading}
            onAnswer={handleAnswer}
          />
        )}

        {lastFeedback && (
          <div className="feedback-banner slide-up">{lastFeedback}</div>
        )}

        <ActionButtons
          onPickStudent={pickStudent}
          onResetRound={resetRound}
          onResetFridayPoints={resetFridayPoints}
          isSpinning={isSpinning}
          hasStudents={totalCount > 0}
          roundComplete={roundComplete}
          disabled={participationInProgress}
        />

        {!hasGroups && <Instructions />}
      </div>

      <footer className="app-footer">
        <strong>Student Picker</strong> · Classroom participation tool
      </footer>
    </div>
  );
};

export default App;
