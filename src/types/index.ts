export interface Student {
  id: string;
  name: string;
  /** Baseline from import — shown in roster, unchanged by participation */
  fridayPoints: number;
  /** Current session grade — updated during picks and reset to fridayPoints on round reset */
  points: number;
}

export interface GradeGroup {
  id: string;
  name: string;
  students: Student[];
  remainingStudentIds: string[];
  sourceFileName?: string;
}

export type AnswerResult = 'correct' | 'wrong' | 'neutral';

export interface AppData {
  gradeGroups: GradeGroup[];
  activeGradeId: string | null;
}

export interface ParsedStudentRow {
  name: string;
  points: number;
}
