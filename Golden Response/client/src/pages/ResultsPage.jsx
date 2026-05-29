import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAnalysis from '../hooks/useAnalysis';
import ATSScoreGauge from '../components/analysis/ATSScoreGauge';
import ScoreBreakdown from '../components/analysis/ScoreBreakdown';
import RecommendationCard from '../components/analysis/RecommendationCard';
import SkillsComparison from '../components/analysis/SkillsComparison';
import SummaryRewrite from '../components/analysis/SummaryRewrite';
import ProjectSuggestions from '../components/analysis/ProjectSuggestions';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const analysisId = queryParams.get('id');
  
  const { currentAnalysis, loading, getAnalysisById } = useAnalysis();

  useEffect(() => {
    if (analysisId) {
      getAnalysisById(analysisId);
    }
  }, [analysisId, getAnalysisById]);

  if (loading && !currentAnalysis) {
    return <Loader fullScreen text="Loading analysis results..." />;
  }

  if (!currentAnalysis) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Analysis Not Found</h2>
        <p className="text-gray-500 mt-2">We couldn't find the analysis you're looking for.</p>
        <Link to="/analyze" className="inline-block mt-6 text-indigo-600 font-bold">
          Start a new analysis
        </Link>
      </div>
    );
  }

  const { atsScore, scoreBreakdown, recommendations, optimizedScore } = currentAnalysis;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[calc(100vh-64px)]">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analysis Results</h1>
          <p className="text-gray-500">
            {currentAnalysis.jobTitle ? `Targeting: ${currentAnalysis.jobTitle}` : "Here's how your resume stacks up against the job description."}
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none border-gray-200">
            Download Report
          </Button>
          <Link to={`/chat?analysisId=${currentAnalysis._id}`} className="flex-1 md:flex-none">
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-md">
              Ask Career Coach
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Section: Score & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        
        {/* Main Gauge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center lg:col-span-1"
        >
          <ATSScoreGauge score={atsScore} />
          <div className="mt-8 text-center">
            <p className="text-sm font-medium text-gray-500">Current ATS Score</p>
            <p className="text-xs text-indigo-600 font-bold mt-2 bg-indigo-50 px-3 py-1 rounded-full inline-block">
              Target optimized score: {optimizedScore}%
            </p>
          </div>
        </motion.div>

        {/* Breakdown */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-6">Score Breakdown</h3>
          <ScoreBreakdown breakdown={scoreBreakdown} />
        </motion.div>
      </div>

      {/* Recommendations Section */}
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Actionable Recommendations</h2>
      
      <div className="space-y-6">
        
        {/* Summary Rewrite */}
        <RecommendationCard 
          title="Summary Optimization" 
          delay={0.3}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
        >
          <SummaryRewrite 
            current={recommendations.summary.current}
            suggested={recommendations.summary.suggested}
            reasoning={recommendations.summary.reasoning}
          />
        </RecommendationCard>

        {/* Skills Analysis */}
        <RecommendationCard 
          title="Skills Alignment" 
          delay={0.4}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
        >
          <SkillsComparison 
            skillsToAdd={recommendations.skillsToAdd}
            skillsToRemove={recommendations.skillsToRemove}
            skillsToReword={recommendations.skillsToReword}
          />
        </RecommendationCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Projects */}
          <RecommendationCard 
            title="Projects to Build" 
            delay={0.5}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>}
          >
            <ProjectSuggestions projects={recommendations.projectsToAdd} />
          </RecommendationCard>

          {/* Certifications */}
          <RecommendationCard 
            title="Certifications" 
            delay={0.6}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
          >
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Existing (Add to Resume)</h4>
                <div className="flex flex-wrap gap-2">
                  {recommendations.certsToAdd?.length > 0 ? (
                    recommendations.certsToAdd.map((cert, idx) => (
                      <span key={idx} className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-100">
                        {cert.existing}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 italic">No existing certs suggested.</p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">Recommended to Pursue</h4>
                <div className="space-y-2">
                  {recommendations.certsToGet?.map((cert, idx) => (
                    <div key={idx} className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                      <p className="text-sm font-bold text-indigo-900">{cert.name}</p>
                      <p className="text-xs text-indigo-700 mt-1">{cert.provider} • {cert.estimatedTime}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </RecommendationCard>
        </div>

        {/* Formatting & Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecommendationCard 
            title="Formatting Tips" 
            delay={0.7}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>}
          >
            <ul className="space-y-2">
              {recommendations.formattingTips?.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  {tip}
                </li>
              ))}
            </ul>
          </RecommendationCard>

          <RecommendationCard 
            title="Additional Notes" 
            delay={0.8}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          >
            <ul className="space-y-2">
              {recommendations.additionalNotes?.map((note, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 shrink-0"></div>
                  {note}
                </li>
              ))}
            </ul>
          </RecommendationCard>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
