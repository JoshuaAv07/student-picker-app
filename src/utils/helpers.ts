import { AppData, GradeGroup, ParsedStudentRow, Student } from '../types';

const STORAGE_KEY = 'student-picker-data-v2';

export const createId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const createStudent = (name: string, fridayPoints = 0): Student => ({
  id: createId(),
  name: name.trim(),
  fridayPoints,
  points: fridayPoints,
});

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

const FRIDAY_POINTS_HEADERS = ['friday points', 'friday_points', 'fridaypoints'];

const findFridayPointsColumn = (headers: string[]): number => {
  const fridayIndex = headers.findIndex(h => FRIDAY_POINTS_HEADERS.includes(h));
  if (fridayIndex >= 0) return fridayIndex;
  return headers.indexOf('points');
};

/**
 * Parse CSV with required "name" column and optional "friday points" / "points" column.
 */
export const parseCSV = (text: string): ParsedStudentRow[] => {
  const lines = text.split('\n').filter(line => line.trim());
  const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
  const nameIndex = headers.indexOf('name');
  const pointsIndex = findFridayPointsColumn(headers);

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
        points: pointsIndex >= 0 ? parsePoints(values[pointsIndex]) : 0,
      };
    })
    .filter((row): row is ParsedStudentRow => row !== null);
};

/**
 * Parse TXT: one name per line, or "Name,points" / "Name:points".
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
        return { name: commaSplit[0].trim(), points: parsePoints(commaSplit[1]) };
      }
      if (colonSplit.length >= 2) {
        return { name: colonSplit[0].trim(), points: parsePoints(colonSplit[1]) };
      }
      return { name: trimmed, points: 0 };
    })
    .filter(row => row.name.length > 0);
};

const normalizeStudent = (student: Student): Student => ({
  ...student,
  fridayPoints: student.fridayPoints ?? student.points ?? 0,
  points: student.points ?? student.fridayPoints ?? 0,
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
      const students = names.map(name => createStudent(name, 0));
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

export const averagePoints = (students: Student[]): number => {
  if (students.length === 0) return 0;
  const total = students.reduce((sum, s) => sum + s.points, 0);
  return Math.round((total / students.length) * 10) / 10;
};
