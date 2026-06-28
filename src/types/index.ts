export interface Student {
  id: string;
  name: string;
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
