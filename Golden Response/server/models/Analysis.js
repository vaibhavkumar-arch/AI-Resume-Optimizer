import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    jobTitle: {
      type: String,
    },
    company: {
      type: String,
    },
    atsScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    scoreBreakdown: {
      keywordMatch: { score: Number, maxScore: Number, details: String },
      skillsAlignment: { score: Number, maxScore: Number, details: String },
      experienceMatch: { score: Number, maxScore: Number, details: String },
      formatting: { score: Number, maxScore: Number, details: String },
      summaryQuality: { score: Number, maxScore: Number, details: String },
      overallStructure: { score: Number, maxScore: Number, details: String },
    },
    recommendations: {
      summary: {
        current: String,
        suggested: String,
        reasoning: String,
      },
      skillsToAdd: [
        {
          skill: String,
          reason: String,
        },
      ],
      skillsToRemove: [
        {
          skill: String,
          reason: String,
        },
      ],
      skillsToReword: [
        {
          current: String,
          suggested: String,
          reason: String,
        },
      ],
      experienceTweaks: [
        {
          section: String,
          suggestion: String,
        },
      ],
      projectsToAdd: [
        {
          name: String,
          description: String,
          techStack: [String],
          whyRelevant: String,
        },
      ],
      certsToAdd: [
        {
          existing: String,
        },
      ],
      certsToGet: [
        {
          name: String,
          provider: String,
          estimatedTime: String,
          whyRelevant: String,
        },
      ],
      formattingTips: [String],
      additionalNotes: [String],
    },
    optimizedScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    analyzedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes
analysisSchema.index({ userId: 1 });
analysisSchema.index({ analyzedAt: -1 });

const Analysis = mongoose.model('Analysis', analysisSchema);

export default Analysis;
