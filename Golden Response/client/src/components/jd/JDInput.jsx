import { useState } from 'react';

const JDInput = ({ value, onChange, error }) => {
  const charCount = value.length;

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2">
        <label htmlFor="jd-text" className="block text-sm font-medium text-gray-700">
          Job Description
        </label>
        <span className={`text-xs ${charCount < 50 ? 'text-orange-500' : 'text-gray-400'}`}>
          {charCount} characters
        </span>
      </div>
      <textarea
        id="jd-text"
        rows={10}
        className={`block w-full rounded-2xl border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-4 transition-all ${
          error ? 'border-red-300 bg-red-50' : ''
        }`}
        placeholder="Paste the full job description here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {charCount > 0 && charCount < 50 && (
        <p className="mt-2 text-xs text-orange-500">
          Note: Job description seems too short for a comprehensive analysis.
        </p>
      )}
    </div>
  );
};

export default JDInput;
