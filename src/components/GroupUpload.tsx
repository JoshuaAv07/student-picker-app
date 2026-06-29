import React, { useRef, useState, useEffect } from 'react';
import { Upload, Users } from 'lucide-react';
import { GradeGroup } from '../types';
import '../styles/FileUpload.css';

interface GroupUploadProps {
  gradeGroups: GradeGroup[];
  activeGradeId: string | null;
  onSelectGroup: (gradeId: string) => void;
  onUpload: (file: File, groupName: string) => void;
}

const NEW_GROUP = '__new__';

const GroupUpload: React.FC<GroupUploadProps> = ({
  gradeGroups,
  activeGradeId,
  onSelectGroup,
  onUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevGroupCountRef = useRef(gradeGroups.length);
  const prevActiveGradeIdRef = useRef(activeGradeId);
  const hasSavedGroups = gradeGroups.length > 0;

  const [selection, setSelection] = useState<string>(activeGradeId ?? NEW_GROUP);
  const [groupName, setGroupName] = useState('');

  const isNewGroup = selection === NEW_GROUP;

  useEffect(() => {
    if (gradeGroups.length === 0) {
      setSelection(NEW_GROUP);
      setGroupName('');
      return;
    }

    if (activeGradeId && selection !== NEW_GROUP) {
      setSelection(activeGradeId);
    }
  }, [activeGradeId, gradeGroups.length, selection]);

  useEffect(() => {
    const groupAdded = gradeGroups.length > prevGroupCountRef.current;
    if (isNewGroup && groupAdded && activeGradeId) {
      setSelection(activeGradeId);
      setGroupName('');
    }
    prevGroupCountRef.current = gradeGroups.length;
  }, [gradeGroups.length, activeGradeId, isNewGroup]);

  useEffect(() => {
    const activeGradeChanged = activeGradeId !== prevActiveGradeIdRef.current;
    const groupCountUnchanged = gradeGroups.length === prevGroupCountRef.current;

    if (
      isNewGroup
      && activeGradeChanged
      && groupCountUnchanged
      && activeGradeId
      && prevActiveGradeIdRef.current !== null
    ) {
      setSelection(activeGradeId);
      setGroupName('');
    }

    prevActiveGradeIdRef.current = activeGradeId;
  }, [activeGradeId, gradeGroups.length, isNewGroup]);

  const handleSelectionChange = (value: string) => {
    setSelection(value);
    if (value !== NEW_GROUP) {
      onSelectGroup(value);
      setGroupName('');
    } else {
      setGroupName('');
    }
  };

  const resolveGroupName = (file: File): string | null => {
    if (hasSavedGroups && !isNewGroup) {
      return gradeGroups.find(g => g.id === selection)?.name ?? null;
    }
    const name = groupName.trim() || file.name.replace(/\.(csv|txt)$/i, '').trim();
    return name || null;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const name = resolveGroupName(file);
    if (!name) {
      alert('Enter a group name before uploading.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    onUpload(file, name);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const selectedGroup = gradeGroups.find(g => g.id === selection);

  const uploadLabel = isNewGroup
    ? 'Upload new group'
    : hasSavedGroups && selectedGroup
      ? `Upload to ${selectedGroup.name}`
      : 'Choose CSV or TXT File';

  return (
    <div className="file-upload-container slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="file-upload-header">
        <div className="upload-icon-wrapper">
          <Users className="upload-icon" size={28} />
        </div>
        <h2 className="file-upload-title">Upload Group List</h2>
      </div>

      {hasSavedGroups ? (
        <>
          <label className="field-label" htmlFor="group-select">Saved groups</label>
          <select
            id="group-select"
            value={selection}
            onChange={e => handleSelectionChange(e.target.value)}
            className="group-select"
          >
            {gradeGroups.map(grade => (
              <option key={grade.id} value={grade.id}>
                {grade.name} ({grade.students.length} students)
              </option>
            ))}
            <option value={NEW_GROUP}>+ Add new group</option>
          </select>

          {isNewGroup ? (
            <>
              <label className="field-label" htmlFor="new-group-name">New group name</label>
              <input
                id="new-group-name"
                type="text"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                placeholder="e.g. Web Design, Big Data"
                className="group-name-input"
              />
            </>
          ) : selectedGroup?.sourceFileName && (
            <p className="saved-group-file">
              Saved from: {selectedGroup.sourceFileName}
            </p>
          )}
        </>
      ) : (
        <>
          <label className="field-label" htmlFor="group-name">Group name</label>
          <input
            id="group-name"
            type="text"
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
            placeholder="e.g. Web Design, Big Data"
            className="group-name-input"
          />
        </>
      )}

      <p className="upload-hint">
        Groups are saved automatically. Upload each class once, then switch between them above.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.txt"
        onChange={handleFileChange}
        className="file-input"
        id="group-file-upload"
      />

      <button
        type="button"
        className="file-upload-label"
        onClick={openFilePicker}
      >
        <div className="file-upload-button-content">
          <Upload size={24} />
          {uploadLabel}
        </div>
      </button>
    </div>
  );
};

export default GroupUpload;
