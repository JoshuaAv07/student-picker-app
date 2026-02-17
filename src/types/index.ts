export interface Student {
  name: string;
}

export interface StudentPickerState {
  allStudents: string[];
  remainingStudents: string[];
  selectedStudent: string;
  isSpinning: boolean;
  uploadedFileName: string;
  showConfetti: boolean;
}
