import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import Stats from './components/Stats';
import ProgressBar from './components/ProgressBar';
import WinnerDisplay from './components/WinnerDisplay';
import ActionButtons from './components/ActionButtons';
import Instructions from './components/Instructions';
/* import Confetti from './components/Confetti'; */
import { parseCSV, parseTXT, loadFromStorage, saveToStorage, clearFromStorage } from './utils/helpers';
import './styles/global.css';
import './styles/animations.css';
import './styles/App.css';

const App: React.FC = () => {
  const [allStudents, setAllStudents] = useState<string[]>([]);
  const [remainingStudents, setRemainingStudents] = useState<string[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  /* const [showConfetti, setShowConfetti] = useState(false); */

  // Load state from localStorage on mount
  useEffect(() => {
    const savedAll = loadFromStorage('allStudents');
    const savedRemaining = loadFromStorage('remainingStudents');
    
    if (savedAll) setAllStudents(savedAll);
    if (savedRemaining) setRemainingStudents(savedRemaining);
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    if (allStudents.length > 0) {
      saveToStorage('allStudents', allStudents);
    }
  }, [allStudents]);

  useEffect(() => {
    if (remainingStudents.length > 0) {
      saveToStorage('remainingStudents', remainingStudents);
    }
  }, [remainingStudents]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);

    try {
      const text = await file.text();
      let students: string[] = [];

      if (file.name.endsWith('.csv')) {
        students = parseCSV(text);
      } else if (file.name.endsWith('.txt')) {
        students = parseTXT(text);
      } else {
        throw new Error('Unsupported file format. Use CSV or TXT.');
      }

      if (students.length === 0) {
        throw new Error('No students found in file');
      }

      setAllStudents(students);
      setRemainingStudents(students);
      setSelectedStudent('');
      clearFromStorage('remainingStudents');
      
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to read file'}`);
    }
  };

  const pickStudent = () => {
    if (allStudents.length === 0) {
      alert('Please upload a student list first!');
      return;
    }

    let studentsToPickFrom = remainingStudents;

    // Reset if all students have been picked
    if (studentsToPickFrom.length === 0) {
      studentsToPickFrom = [...allStudents];
      setRemainingStudents(studentsToPickFrom);
      clearFromStorage('remainingStudents');
    }

    setIsSpinning(true);

    // Simulate spinning animation
    let counter = 0;
    const spinInterval = setInterval(() => {
      const randomStudent = studentsToPickFrom[Math.floor(Math.random() * studentsToPickFrom.length)];
      setSelectedStudent(randomStudent);
      counter++;
    }, 100);

    // Stop after animation
    setTimeout(() => {
      clearInterval(spinInterval);
      
      const chosen = studentsToPickFrom[Math.floor(Math.random() * studentsToPickFrom.length)];
      const updated = studentsToPickFrom.filter(s => s !== chosen);
      
      setSelectedStudent(chosen);
      setRemainingStudents(updated);
      setIsSpinning(false);
      /* setShowConfetti(true);

      setTimeout(() => setShowConfetti(false), 3000); */
    }, 2000);
  };

  const resetList = () => {
    if (allStudents.length === 0) return;
    
    setRemainingStudents([...allStudents]);
    setSelectedStudent('');
    clearFromStorage('remainingStudents');
  };

  const progress = allStudents.length > 0 
    ? ((allStudents.length - remainingStudents.length) / allStudents.length) * 100 
    : 0;

  return (
    <div className="app-container">
      {/* <Confetti show={showConfetti} /> */}

      <div className="app-content">
        <Header />

        <FileUpload 
          onFileUpload={handleFileUpload}
          uploadedFileName={uploadedFileName}
        />

        {allStudents.length > 0 && (
          <>
            <Stats 
              totalStudents={allStudents.length}
              remainingStudents={remainingStudents.length}
              selectedCount={allStudents.length - remainingStudents.length}
            />

            <ProgressBar progress={progress} />
          </>
        )}

        {selectedStudent && (
          <WinnerDisplay 
            selectedStudent={selectedStudent}
            isSpinning={isSpinning}
            allPicked={remainingStudents.length === 0}
          />
        )}

        <ActionButtons 
          onPickStudent={pickStudent}
          onReset={resetList}
          isSpinning={isSpinning}
          hasStudents={allStudents.length > 0}
        />

        {allStudents.length === 0 && <Instructions />}
      </div>
    </div>
  );
};

export default App;
