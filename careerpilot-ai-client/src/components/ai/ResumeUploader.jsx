'use client';

import { useState, useRef } from 'react';
import { FaUpload, FaFilePdf, FaSpinner } from 'react-icons/fa';

const ResumeUploader = ({ onUpload, isAnalyzing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setFile(file);
        onUpload(file);
      } else {
        alert('Please upload a PDF file');
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setFile(file);
        onUpload(file);
      } else {
        alert('Please upload a PDF file');
      }
    }
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
        dragActive 
          ? 'border-primary-500 bg-primary-50' 
          : 'border-gray-300 hover:border-gray-400'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        onChange={handleChange}
        className="hidden"
        disabled={isAnalyzing}
      />

      <div className="text-center">
        <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
          isAnalyzing ? 'bg-gray-100' : 'bg-primary-50'
        }`}>
          {isAnalyzing ? (
            <FaSpinner className="text-2xl text-primary-600 animate-spin" />
          ) : (
            <FaUpload className="text-2xl text-primary-600" />
          )}
        </div>
        
        {file && !isAnalyzing ? (
          <div className="mt-4">
            <div className="flex items-center justify-center gap-2 text-green-600">
              <FaFilePdf className="text-xl" />
              <span className="font-medium">{file.name}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <button
              onClick={handleClick}
              className="mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Upload another file
            </button>
          </div>
        ) : (
          <>
            <p className="mt-4 text-gray-600">
              {isAnalyzing ? 'Processing your resume...' : 'Drag and drop your resume here'}
            </p>
            <p className="text-sm text-gray-400 mt-1">or</p>
            <button
              onClick={handleClick}
              disabled={isAnalyzing}
              className="mt-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Browse Files
            </button>
            <p className="text-xs text-gray-400 mt-3">PDF only • Max 5MB</p>
          </>
        )}
      </div>
    </div>
  );
};

export default ResumeUploader;