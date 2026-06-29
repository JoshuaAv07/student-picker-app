import { AppData, AnswerResult, GradeGroup, ParsedStudentRow, Student } from '../types';

const STORAGE_KEY = 'student-picker-data-v2';

export const BASE_LIVES = 10;
export const MAX_LIVES = BASE_LIVES + 1;

export const createId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const createStudent = (name: string, lives = BASE_LIVES): Student => ({
  id: createId(),
  name: name.trim(),
  lives,
});

export const applyLivesChange = (lives: number, result: AnswerResult): number => {
  switch (result) {
    case 'correct':
      return Math.min(lives + 1, MAX_LIVES);
    case 'wrong':
      if (lives >= MAX_LIVES) return BASE_LIVES;
      return lives - 1;
    case 'neutral':
      return lives;
  }
};

export const formatLivesFeedback = (
  name: string,
  result: AnswerResult,
  before: number,
  after: number
): string => {
  if (result === 'correct') {
    if (after === before) {
      return `${name}: Correct — already at max lives (${after})`;
    }
    return `${name}: Correct — +1 life (${before} → ${after})`;
  }
  if (result === 'wrong') {
    if (before >= MAX_LIVES && after === BASE_LIVES) {
      return `${name}: Wrong — back to base (${before} → ${after})`;
    }
    return `${name}: Wrong — −1 life (${before} → ${after})`;
  }
  return `${name}: Neutral — no change (${after} lives)`;
};

export const createGradeGroup = (name: string): GradeGroup => ({
  id: createId(),
  name: name.trim(),
  students: [],
  remainingStudentIds: [],
});

export const groupNameFromFile = (filename: string): string => {
  const base = filename.replace(/\.(csv|txt)$/i, '').trim();
  return base || 'My Class';
};

const parsePoints = (value: string | undefined): number => {
  if (value === undefined || value.trim() === '') return 0;
  const parsed = Number.parseInt(value.trim(), 10);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const LIVES_HEADERS = ['lives', 'life'];
const FRIDAY_POINTS_HEADERS = ['friday points', 'friday_points', 'fridaypoints', 'friday pts'];

const findLivesColumn = (headers: string[]): number => {
  const livesIndex = headers.findIndex(h => LIVES_HEADERS.includes(h));
  if (livesIndex >= 0) return livesIndex;
  const fridayIndex = headers.findIndex(h => FRIDAY_POINTS_HEADERS.includes(h));
  if (fridayIndex >= 0) return fridayIndex;
  return headers.indexOf('points');
};

/**
 * Parse CSV with required "name" column and optional "lives" / "points" column.
 */
export const parseCSV = (text: string): ParsedStudentRow[] => {
  const lines = text.split('\n').filter(line => line.trim());
  const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
  const nameIndex = headers.indexOf('name');
  const livesIndex = findLivesColumn(headers);

  if (nameIndex === -1) {
    throw new Error('CSV must contain a "name" column');
  }

  return lines.slice(1)
    .map(line => {
      const values = line.split(',');
      const name = values[nameIndex]?.trim();
      if (!name) return null;
      return {
        name,
        lives: livesIndex >= 0 ? parsePoints(values[livesIndex]) : BASE_LIVES,
      };
    })
    .filter((row): row is ParsedStudentRow => row !== null);
};

/**
 * Parse TXT: one name per line, or "Name,lives" / "Name:lives".
 */
export const parseTXT = (text: string): ParsedStudentRow[] => {
  return text
    .split('\n')
    .filter(line => line.trim())
    .map(line => {
      const trimmed = line.trim();
      const commaSplit = trimmed.split(',');
      const colonSplit = trimmed.split(':');

      if (commaSplit.length >= 2) {
        return { name: commaSplit[0].trim(), lives: parsePoints(commaSplit[1]) };
      }
      if (colonSplit.length >= 2) {
        return { name: colonSplit[0].trim(), lives: parsePoints(colonSplit[1]) };
      }
      return { name: trimmed, lives: BASE_LIVES };
    })
    .filter(row => row.name.length > 0);
};

const normalizeStudent = (student: Student & { points?: number; fridayPoints?: number }): Student => ({
  id: student.id,
  name: student.name,
  lives: student.lives ?? student.points ?? student.fridayPoints ?? BASE_LIVES,
});

const normalizeAppData = (data: AppData): AppData => ({
  ...data,
  gradeGroups: data.gradeGroups.map(grade => ({
    ...grade,
    students: grade.students.map(normalizeStudent),
  })),
});

export const loadAppData = (): AppData => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return normalizeAppData(JSON.parse(saved) as AppData);
    }
  } catch {
    /* fall through to migration */
  }

  return migrateLegacyStorage();
};

const migrateLegacyStorage = (): AppData => {
  try {
    const legacyAll = localStorage.getItem('allStudents');
    const legacyRemaining = localStorage.getItem('remainingStudents');

    if (legacyAll) {
      const names: string[] = JSON.parse(legacyAll);
      const remainingNames: string[] = legacyRemaining ? JSON.parse(legacyRemaining) : names;
      const students = names.map(name => createStudent(name));
      const remainingStudentIds = students
        .filter(s => remainingNames.includes(s.name))
        .map(s => s.id);

      const grade = createGradeGroup('Imported Class');
      grade.students = students;
      grade.remainingStudentIds = remainingStudentIds.length > 0
        ? remainingStudentIds
        : students.map(s => s.id);

      localStorage.removeItem('allStudents');
      localStorage.removeItem('remainingStudents');

      return { gradeGroups: [grade], activeGradeId: grade.id };
    }
  } catch {
    /* ignore */
  }

  return { gradeGroups: [], activeGradeId: null };
};

export const saveAppData = (data: AppData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getActiveGrade = (data: AppData): GradeGroup | null =>
  data.gradeGroups.find(g => g.id === data.activeGradeId) ?? null;

export const getStudentById = (grade: GradeGroup, studentId: string): Student | undefined =>
  grade.students.find(s => s.id === studentId);

export const averageLives = (students: Student[]): number => {
  if (students.length === 0) return 0;
  const total = students.reduce((sum, s) => sum + s.lives, 0);
  return Math.round((total / students.length) * 10) / 10;
};
