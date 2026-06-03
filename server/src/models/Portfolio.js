import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    theme: {
      type: String,
      enum: ['modern', 'professional', 'dark-pro'],
      default: 'modern',
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    about: {
      heading: String,
      description: String,
      profileImage: String,
    },
    skills: [
      {
        name: String,
        level: {
          type: String,
          enum: ['beginner', 'intermediate', 'advanced', 'expert'],
        },
      },
    ],
    projects: [
      {
        title: String,
        description: String,
        image: String,
        technologies: [String],
        link: String,
        github: String,
      },
    ],
    experience: [
      {
        company: String,
        role: String,
        duration: String,
        description: String,
      },
    ],
    education: [
      {
        institution: String,
        degree: String,
        field: String,
        year: String,
      },
    ],
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
    },
    socialLinks: {
      linkedin: String,
      github: String,
      twitter: String,
      email: String,
      phone: String,
    },
    contact: {
      email: String,
      phone: String,
      availability: String,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    customDomain: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Portfolio', portfolioSchema);
