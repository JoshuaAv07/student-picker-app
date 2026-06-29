import { AppData, AnswerResult, GradeGroup, ParsedStudentRow, Student } from '../types';

const STORAGE_KEY = 'student-picker-data-v2';

export const BASE_LIVES = 10;
export const BONUS_LIVES = BASE_LIVES + 1;
const DEFAULT_LIVES = 0;

const NAME_HEADERS = ['name', 'student', 'student name', 'nombre', 'full name'];
const LIVES_HEADERS = ['lives', 'life', 'vidas', 'vida', 'hearts', 'heart'];
const FRIDAY_POINTS_HEADERS = [
  'friday points',
  'friday_points',
  'fridaypoints',
  'friday pts',
  'friday pt',
  'points',
  'point',
  'score',
  'grade',
  'pts',
  'pt',
];

const normalizeHeader = (header: string): string =>
  header.toLowerCase().replace(/^\ufeff/, '').replace(/[_-]+/g, ' ').trim();

const matchesHeader = (header: string, aliases: string[]): boolean =>
  aliases.includes(normalizeHeader(header));

const isLivesHeader = (header: string): boolean => {
  const normalized = normalizeHeader(header);
  return LIVES_HEADERS.includes(normalized)
    || /\blives?\b/.test(normalized)
    || normalized.includes('vida')
    || normalized.includes('heart');
};

const isFridayHeader = (header: string): boolean => {
  const normalized = normalizeHeader(header);
  return FRIDAY_POINTS_HEADERS.includes(normalized)
    || normalized.includes('friday')
    || /\bpoints?\b/.test(normalized)
    || normalized.includes('score')
    || normalized.includes('grade')
    || normalized === 'pts'
    || normalized === 'pt';
};

const findNameColumn = (headers: string[]): number => {
  const exact = headers.findIndex(h => matchesHeader(h, NAME_HEADERS));
  if (exact >= 0) return exact;
  return headers.findIndex(h => normalizeHeader(h).includes('name'));
};

const resolveCsvColumns = (headers: string[], nameIndex: number) => {
  let fridayCol = -1;
  let livesCol = -1;

  headers.forEach((header, index) => {
    if (index === nameIndex) return;
    if (isLivesHeader(header)) livesCol = index;
    else if (isFridayHeader(header)) fridayCol = index;
  });

  const unmatched = headers
    .map((_, index) => index)
    .filter(index => index !== nameIndex && index !== fridayCol && index !== livesCol);

  if (fridayCol < 0 && unmatched.length > 0) {
    fridayCol = unmatched.shift()!;
  }
  if (livesCol < 0 && unmatched.length > 0) {
    livesCol = unmatched.shift()!;
  }

  return { fridayCol, livesCol };
};

export const createId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const createStudent = (
  name: string,
  fridayPoints = 0,
  lives = DEFAULT_LIVES
): Student => ({
  id: createId(),
  name: name.trim(),
  lives,
  fridayPoints,
  fridayPointsBaseline: fridayPoints,
});

export const buildUploadedFridayPoints = (rows: ParsedStudentRow[]): Record<string, number> =>
  Object.fromEntries(rows.map(row => [row.name.toLowerCase(), row.fridayPoints]));

export const getStudentFridayBaseline = (grade: GradeGroup, student: Student): number => {
  if (!grade.fridayPointsSnapshottedAtUpload) return 0;
  return grade.uploadedFridayPoints?.[student.name.toLowerCase()] ?? 0;
};

export const shuffleIds = (ids: string[]): string[] => {
  const next = [...ids];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
};

export const applyFridayPointsChange = (
  fridayPoints: number,
  lives: number,
  result: AnswerResult
): number => {
  switch (result) {
    case 'correct':
      return fridayPoints >= BASE_LIVES ? BASE_LIVES : fridayPoints + 1;
    case 'wrong':
      if (fridayPoints >= BASE_LIVES && lives > 0) return BASE_LIVES;
      return fridayPoints - 1;
    case 'neutral':
      return fridayPoints;
  }
};

export const applyLivesChange = (lives: number, fridayPoints: number, result: AnswerResult): number => {
  switch (result) {
    case 'correct':
      return fridayPoints >= BASE_LIVES ? lives + 1 : lives;
    case 'wrong':
      if (fridayPoints >= BASE_LIVES && lives > 0) return lives - 1;
      return lives;
    case 'neutral':
      return lives;
  }
};

export const formatAnswerFeedback = (
  name: string,
  result: AnswerResult,
  livesBefore: number,
  livesAfter: number,
  fridayBefore: number,
  fridayAfter: number
): string => {
  const label = result === 'correct' ? 'Correct' : result === 'wrong' ? 'Wrong' : 'Neutral';
  const changes: string[] = [];

  if (livesAfter !== livesBefore) {
    changes.push(`lives ${livesBefore} → ${livesAfter}`);
  }
  if (fridayAfter !== fridayBefore) {
    changes.push(`Friday pts ${fridayBefore} → ${fridayAfter}`);
  }

  return `${name}: ${label} — ${changes.length > 0 ? changes.join(', ') : 'no change'}`;
};

export const createGradeGroup = (name: string): GradeGroup => ({
  id: createId(),
  name: name.trim(),
  students: [],
  remainingStudentIds: [],
  requireFridayEntry: true,
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

/**
 * Parse CSV with required name column and flexible mapping for other columns.
 * Only "name" must match exactly (or a known alias). Any other columns are
 * mapped to Friday pts / lives by header hint, otherwise by column order.
 */
export const parseCSV = (text: string): ParsedStudentRow[] => {
  const lines = text.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',').map(h => normalizeHeader(h));
  const nameIndex = findNameColumn(headers);

  if (nameIndex === -1) {
    throw new Error('CSV must contain a "name" column');
  }

  const { fridayCol, livesCol } = resolveCsvColumns(headers, nameIndex);

  return lines.slice(1)
    .map(line => {
      const values = line.split(',');
      const name = values[nameIndex]?.trim();
      if (!name) return null;
      return {
        name,
        fridayPoints: fridayCol >= 0 ? parsePoints(values[fridayCol]) : 0,
        lives: livesCol >= 0 ? parsePoints(values[livesCol]) : DEFAULT_LIVES,
      };
    })
    .filter((row): row is ParsedStudentRow => row !== null);
};

/**
 * Parse TXT: one name per line, or "Name,fridayPoints" / "Name:fridayPoints",
 * or "Name,fridayPoints,lives".
 */
export const parseTXT = (text: string): ParsedStudentRow[] => {
  return text
    .split('\n')
    .filter(line => line.trim())
    .map(line => {
      const trimmed = line.trim();
      const commaSplit = trimmed.split(',').map(s => s.trim());
      const colonSplit = trimmed.split(':');

      if (commaSplit.length >= 3) {
        return {
          name: commaSplit[0],
          fridayPoints: parsePoints(commaSplit[1]),
          lives: parsePoints(commaSplit[2]),
        };
      }
      if (commaSplit.length >= 2) {
        return {
          name: commaSplit[0],
          fridayPoints: parsePoints(commaSplit[1]),
          lives: DEFAULT_LIVES,
        };
      }
      if (colonSplit.length >= 2) {
        return {
          name: colonSplit[0].trim(),
          fridayPoints: parsePoints(colonSplit[1]),
          lives: DEFAULT_LIVES,
        };
      }
      return { name: trimmed, fridayPoints: 0, lives: DEFAULT_LIVES };
    })
    .filter(row => row.name.length > 0);
};

const normalizeStudent = (student: Student & { points?: number }): Student => {
  const fridayPoints = student.fridayPoints ?? student.points ?? 0;
  return {
    id: student.id,
    name: student.name,
    lives: student.lives ?? DEFAULT_LIVES,
    fridayPoints,
    fridayPointsBaseline: typeof student.fridayPointsBaseline === 'number'
      ? student.fridayPointsBaseline
      : 0,
  };
};

const normalizeGradeGroup = (grade: GradeGroup): GradeGroup => ({
  ...grade,
  students: grade.students.map(normalizeStudent),
  requireFridayEntry: grade.requireFridayEntry !== false,
});

const normalizeAppData = (data: AppData): AppData => ({
  ...data,
  gradeGroups: data.gradeGroups.map(normalizeGradeGroup),
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
