import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';

const JDUploader = ({ onFileSelect, selectedFile, error }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
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
        }}
        className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all cursor-pointer ${
          error ? 'border-red-300 bg-red-50' : ''
        }`}
      >
        <input {...getInputProps()} />
        <div className={`p-3 rounded-full mb-3 ${isDragActive ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        {selectedFile ? (
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900">{selectedFile.name}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFileSelect(null);
              }}
              className="mt-1 text-xs text-red-600 hover:text-red-700 font-medium"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-900">
              {isDragActive ? 'Drop JD here' : 'Upload JD File'}
            </p>
            <p className="text-xs text-gray-500 mt-1">PDF, TXT, or DOCX</p>
          </div>
        )}
      </motion.div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default JDUploader;
