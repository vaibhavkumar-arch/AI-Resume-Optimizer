import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';

const ResumeDropzone = ({ onFileSelect, selectedFile, error }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div className="w-full">
      <motion.div
        {...getRootProps()}
        animate={{
          borderColor: isDragActive ? '#4f46e5' : '#e5e7eb',
          backgroundColor: isDragActive ? '#f5f3ff' : '#ffffff',
          scale: isDragActive ? 1.02 : 1,
        }}
        className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer ${
          error ? 'border-red-300 bg-red-50' : ''
        }`}
      >
        <input {...getInputProps()} />

        <div className={`p-4 rounded-full mb-4 ${isDragActive ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>

        {selectedFile ? (
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">{selectedFile.name}</p>
            <p className="text-sm text-gray-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFileSelect(null);
              }}
              className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Remove file
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">
              {isDragActive ? 'Drop your resume here' : 'Click or drag resume to upload'}
            </p>
            <p className="text-sm text-gray-500 mt-1">PDF files only (Max 5MB)</p>
          </div>
        )}
      </motion.div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default ResumeDropzone;
