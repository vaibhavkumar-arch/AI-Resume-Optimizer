import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    extractedText: {
      type: String,
      required: true,
    },
    parsedSections: {
      summary: String,
      experience: [
        {
          title: String,
          company: String,
          duration: String,
          description: String,
        },
      ],
      education: [
        {
          degree: String,
          institution: String,
          year: String,
        },
      ],
      skills: [String],
      projects: [
        {
          name: String,
          description: String,
          techStack: [String],
        },
      ],
      certifications: [
        {
          name: String,
          issuer: String,
          year: String,
        },
      ],
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // We might not need this if we have uploadedAt, but it's good practice
  }
);

// Create indexes
resumeSchema.index({ userId: 1 });

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
