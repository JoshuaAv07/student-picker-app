export interface Student {
  id: string;
  name: string;
  lives: number;
  fridayPoints: number;
  /** Value from CSV upload — restored by Reset Friday Points */
  fridayPointsBaseline: number;
}

export interface GradeGroup {
  id: string;
  name: string;
  students: Student[];
  remainingStudentIds: string[];
  sourceFileName?: string;
  /** Friday pts per student name from the last CSV/TXT upload */
  uploadedFridayPoints?: Record<string, number>;
  /** True only after a file upload — reset uses uploadedFridayPoints; otherwise resets to 0 */
  fridayPointsSnapshottedAtUpload?: boolean;
  /** When true, each pick asks for Friday pts. False after Reset Round — uses roster scores. */
  requireFridayEntry?: boolean;
}

export type AnswerResult = 'correct' | 'wrong' | 'neutral';

export interface AppData {
  gradeGroups: GradeGroup[];
  activeGradeId: string | null;
}

export interface ParsedStudentRow {
  name: string;
  lives: number;
  fridayPoints: number;
}
