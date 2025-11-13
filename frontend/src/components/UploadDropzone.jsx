// frontend/src/components/UploadDropzone.jsx
// Drag-and-drop file upload component

import React, { useState } from 'react';

const UploadDropzone = ({ onFilesSelected, accept = ['image/*'], maxFiles = 5 }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files || []);
    const validFiles = files.filter((f) => f.type.startsWith('image/'));
    const limited = validFiles.slice(0, maxFiles);
    onFilesSelected(limited);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files || []);
    const limited = files.slice(0, maxFiles);
    onFilesSelected(limited);
  };

  return (
    <div
      className={`dropzone ${isDragging ? 'dropzone--active' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={accept.join(',')}
        multiple
        onChange={handleFileInput}
        className="dropzone__input"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="dropzone__label">
        <p>Drag and drop images here, or click to select</p>
        <p className="dropzone__hint">Up to {maxFiles} images</p>
      </label>
    </div>
  );
};

export default UploadDropzone;
