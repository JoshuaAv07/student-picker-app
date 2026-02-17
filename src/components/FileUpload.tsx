import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import '../styles/FileUpload.css';

interface FileUploadProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploadedFileName: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, uploadedFileName }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="file-upload-container slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="file-upload-header">
        <div className="upload-icon-wrapper">
          <Upload className="upload-icon" size={28} />
        </div>
        <h2 className="file-upload-title">Upload Student List</h2>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.txt"
        onChange={(e) => {
          onFileUpload(e);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }}
        className="file-input"
        id="file-upload"
      />
      
      <label htmlFor="file-upload" className="file-upload-label">
        <div className="file-upload-button-content">
          <Upload size={24} />
          Choose CSV or TXT File
        </div>
      </label>

      {uploadedFileName && (
        <div className="uploaded-file-badge bounce-in">
          <span className="uploaded-file-text">
            ✓ {uploadedFileName}
          </span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
