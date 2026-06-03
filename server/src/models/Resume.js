import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Resume title is required'],
      default: 'My Resume',
    },
    template: {
      type: String,
      enum: ['modern', 'classic', 'minimal', 'professional', 'creative', 'premium'],
      default: 'modern',
    },
    personalInfo: {
      fullName: String,
      email: String,
      phone: String,
      location: String,
      website: String,
      summary: String,
    },
    experience: [
      {
        jobTitle: String,
        company: String,
        location: String,
        startDate: String,
        endDate: String,
        currentlyWorking: Boolean,
        description: String,
      },
    ],
    education: [
      {
        degree: String,
        institution: String,
        field: String,
        graduationYear: String,
        grade: String,
        description: String,
      },
    ],
    skills: [String],
    certifications: [
      {
        name: String,
        issuer: String,
        issueDate: String,
        expiryDate: String,
        credentialUrl: String,
      },
    ],
    projects: [
      {
        name: String,
        description: String,
        technologies: [String],
        startDate: String,
        endDate: String,
        link: String,
      },
    ],
    languages: [
      {
        language: String,
        proficiency: {
          type: String,
          enum: ['basic', 'intermediate', 'fluent', 'native'],
        },
      },
    ],
    socialLinks: {
      linkedin: String,
      github: String,
      portfolio: String,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Resume', resumeSchema);
