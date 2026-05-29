import { generateAnalysis } from './aiService.js';
import { getATSAnalysisPrompt } from '../prompts/atsAnalysisPrompt.js';
import logger from '../utils/logger.js';

export const analyzeResume = async (resumeText, jobDescription) => {
  try {
    const prompt = getATSAnalysisPrompt(resumeText, jobDescription);
    const analysisResult = await generateAnalysis(prompt);

    // Basic validation of the returned structure
    if (!analysisResult.atsScore || !analysisResult.scoreBreakdown || !analysisResult.recommendations) {
      throw new Error('AI returned an incomplete response structure.');
    }

    // Default missing fields if any
    const completeResult = {
      ...analysisResult,
      optimizedScore: analysisResult.optimizedScore || Math.min(100, analysisResult.atsScore + 20),
    };

    return completeResult;
  } catch (error) {
    logger.error(`Error in analyzeResume service: ${error.message}`);
    // If AI fails (quota or other), provide a quick local fallback so users still get useful feedback
    try {
      const fallback = localFallbackAnalysis(resumeText, jobDescription);
      logger.info('Returning fallback local analysis due to AI failure');
      return fallback;
    } catch (fbErr) {
      logger.error(`Fallback analysis also failed: ${fbErr.message}`);
      throw error;
    }
  }
};

// Simple local heuristic fallback when AI is unavailable
const localFallbackAnalysis = (resumeText, jobDescription) => {
  const jdWords = jobDescription.toLowerCase().match(/\w+/g) || [];
  const resumeWords = resumeText.toLowerCase().match(/\w+/g) || [];

  const jdSet = new Set(jdWords);
  const resumeSet = new Set(resumeWords);

  // keyword match count
  let matchCount = 0;
  jdSet.forEach((w) => { if (resumeSet.has(w)) matchCount++; });

  const keywordMatchScore = Math.min(25, Math.round((matchCount / Math.max(1, jdSet.size)) * 25));

  // skills alignment - rough check for common tech words
  const skills = ['javascript','react','node','express','mongodb','python','aws','docker','sql','java'];
  const skillsFound = skills.filter(s => resumeSet.has(s));
  const skillsScore = Math.min(25, Math.round((skillsFound.length / skills.length) * 25));

  // experience relevance - length heuristic
  const resumeLength = resumeWords.length;
  const expScore = resumeLength > 600 ? 20 : resumeLength > 300 ? 12 : 6;

  const formattingScore = 8; // rough default
  const summaryQuality = resumeText.toLowerCase().includes('summary') ? 8 : 4;
  const overall = keywordMatchScore + skillsScore + expScore + formattingScore + summaryQuality;

  const recommendations = {
    summary: {
      current: resumeText.slice(0, 200) || 'Not found',
      suggested: `Write a concise 2-3 sentence summary that highlights relevant skills like ${skillsFound.slice(0,3).join(', ') || 'your key technologies'}.`,
      reasoning: 'A targeted summary helps match JD keywords and set the right context for ATS.'
    },
    skillsToAdd: [],
    skillsToRemove: [],
    skillsToReword: [],
    experienceTweaks: [],
    projectsToAdd: [],
    certsToAdd: [],
    certsToGet: [],
    formattingTips: [],
    additionalNotes: []
  };

  // suggest missing skills from JD
  const jdSkills = jdWords.filter(w => skills.includes(w));
  jdSkills.forEach(s => {
    if (!resumeSet.has(s)) recommendations.skillsToAdd.push({ skill: s, reason: 'Mentioned in JD' });
  });

  return {
    atsScore: Math.min(100, overall),
    scoreBreakdown: {
      keywordMatch: { score: keywordMatchScore, maxScore: 25, details: `${matchCount} matching tokens` },
      skillsAlignment: { score: skillsScore, maxScore: 25, details: `${skillsFound.length} recognized skills` },
      experienceMatch: { score: expScore, maxScore: 20, details: `Resume length ${resumeLength} words` },
      formatting: { score: formattingScore, maxScore: 10, details: 'Basic formatting heuristics' },
      summaryQuality: { score: summaryQuality, maxScore: 10, details: 'Heuristic check for presence of summary' },
      overallStructure: { score: Math.round(overall / 10), maxScore: 10, details: 'Heuristic overall' }
    },
    recommendations,
    optimizedScore: Math.min(100, overall + 10),
  };
};
