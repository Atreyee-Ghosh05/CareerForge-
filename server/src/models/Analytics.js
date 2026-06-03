import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    totalApplications: {
      type: Number,
      default: 0,
    },
    successfulApplications: {
      type: Number,
      default: 0,
    },
    interviewInvites: {
      type: Number,
      default: 0,
    },
    offers: {
      type: Number,
      default: 0,
    },
    successRate: {
      type: Number,
      default: 0,
    },
    interviewRate: {
      type: Number,
      default: 0,
    },
    resumeDownloads: {
      type: Number,
      default: 0,
    },
    portfolioViews: {
      type: Number,
      default: 0,
    },
    topCompanies: [
      {
        company: String,
        applications: Number,
      },
    ],
    topRoles: [
      {
        role: String,
        applications: Number,
      },
    ],
    monthlyData: [
      {
        month: String,
        applications: Number,
        interviews: Number,
        offers: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Analytics', analyticsSchema);
