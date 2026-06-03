import mongoose from 'mongoose';

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ['free', 'lite', 'pro', 'lifetime'],
      unique: true,
      required: true,
    },
    displayName: String,
    description: String,
    price: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'annual', 'lifetime'],
    },
    razorpayPlanId: String,
    features: {
      resumes: {
        type: Number,
        default: 2,
      },
      applications: {
        type: Number,
        default: 15,
      },
      templates: {
        type: Number,
        default: 3,
      },
      portfolioBuilder: {
        type: Boolean,
        default: false,
      },
      intershipTracker: {
        type: Boolean,
        default: false,
      },
      advancedInterviewPrep: {
        type: Boolean,
        default: false,
      },
      careerAnalytics: {
        type: Boolean,
        default: false,
      },
      portfolioThemes: {
        type: Number,
        default: 1,
      },
      pdfWatermark: {
        type: Boolean,
        default: true,
      },
      prioritySupport: {
        type: Boolean,
        default: false,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Plan', planSchema);
