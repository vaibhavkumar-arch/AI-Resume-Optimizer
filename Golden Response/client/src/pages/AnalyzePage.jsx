import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import useAnalysis from '../hooks/useAnalysis';
import resumeService from '../services/resumeService';
import analysisService from '../services/analysisService';
import JDUploader from '../components/jd/JDUploader';
import ResumeDropzone from '../components/resume/ResumeDropzone';
import JDInput from '../components/jd/JDInput';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';

const AnalyzePage = () => {
  const [file, setFile] = useState(null);
  const [jdText, setJdText] = useState('');
  const [jdFile, setJdFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { analyzeResume, loading: isAnalyzing } = useAnalysis();
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    // Require a resume file, and require a job description only if no JD file was uploaded
    if (!file || (jdText.length < 50 && !jdFile)) {
      toast.error('Please provide both a resume PDF and a job description (min 50 chars)');
      return;
    }

    try {
      setIsUploading(true);
      
      // 1. Upload Resume
      const formData = new FormData();
      formData.append('resume', file);
      const uploadResponse = await resumeService.uploadResume(formData);
      
      if (!uploadResponse.success) {
        throw new Error(uploadResponse.error?.message || 'Failed to upload resume');
      }

      setIsUploading(false);
      
      // 2. If JD file provided upload it and extract text
      let finalJdText = jdText;
      if (jdFile) {
        const jdForm = new FormData();
        jdForm.append('jd', jdFile);
        const jdResp = await analysisService.uploadJDFile(jdForm);
        if (jdResp && jdResp.success && jdResp.data?.jobDescription) {
          finalJdText = jdResp.data.jobDescription;
        }
      }

      // 3. Start streaming Analysis
      const resumeId = uploadResponse.data._id || uploadResponse.data.id || uploadResponse.data.resumeId;

      // Prepare headers including auth token
      const user = JSON.parse(localStorage.getItem('user')) || {};
      const headers = {
        'Content-Type': 'application/json',
      };
      if (user.token) headers.Authorization = `Bearer ${user.token}`;

      const streamResp = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/analysis/stream-analyze`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ resumeId, jobDescription: finalJdText }),
      });

      if (!streamResp.ok) {
        const err = await streamResp.json().catch(() => ({ error: 'Stream failed' }));
        throw new Error(err?.error?.message || 'Streaming analyze failed');
      }

      const reader = streamResp.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let collected = '';

      while (!done) {
        const { value, done: d } = await reader.read();
        done = d;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          collected += chunk;
          // Update UI (optional): you could set a state to show live tokens
          console.log('stream chunk', chunk);

          // Check for final sentinel
          const sentinel = '<<ANALYSIS_COMPLETE>>';
          const idx = collected.indexOf(sentinel);
          if (idx !== -1) {
            const after = collected.slice(idx + sentinel.length);
            try {
              const meta = JSON.parse(after);
              if (meta.analysisId) {
                navigate(`/results?id=${meta.analysisId}`);
                return;
              }
            } catch (e) {
              // ignore parse
            }
          }
        }
      }
    } catch (err) {
      console.error('Analysis flow error:', err);
      toast.error(err.message || 'An error occurred during analysis');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[calc(100vh-64px)]">
      {(isUploading || isAnalyzing) && (
        <Loader fullScreen text={isUploading ? 'Uploading resume...' : 'Analyzing with AI...'} />
      )}

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">New Analysis</h1>
        <p className="text-gray-500">Upload your resume and paste the job description you're targeting.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Resume Upload */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full"
        >
          <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-sm">1</span>
            Upload Resume
          </h3>
          <ResumeDropzone onFileSelect={setFile} selectedFile={file} />
          {file && (
            <div className="mt-4 p-4 bg-indigo-50 rounded-xl flex items-center gap-3">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-indigo-700 font-medium">Resume ready for analysis</p>
            </div>
          )}
        </motion.div>

        {/* Right Column - JD Input */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full"
        >
          <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-sm">2</span>
            Job Description
          </h3>
          <JDInput value={jdText} onChange={setJdText} />
          <div className="mt-4">
            <JDUploader onFileSelect={setJdFile} selectedFile={jdFile} />
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-10 flex justify-end"
      >
        <Button 
          size="lg" 
          onClick={handleAnalyze} 
          isLoading={isUploading || isAnalyzing}
          disabled={!file || (!jdFile && jdText.length < 50) || isUploading || isAnalyzing}
          className="w-full sm:w-auto px-10 py-4 text-lg bg-indigo-600 hover:bg-indigo-700 shadow-xl"
        >
          Generate ATS Report
        </Button>
      </motion.div>
    </div>
  );
};

export default AnalyzePage;
