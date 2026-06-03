import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
    },
    role: {
      type: String,
      required: [true, 'Job role is required'],
    },
    status: {
      type: String,
      enum: ['applied', 'assessment', 'interview', 'rejected', 'offer'],
      default: 'applied',
    },
    dateApplied: {
      type: Date,
      default: Date.now,
    },
    interviewDate: Date,
    interviewType: {
      type: String,
      enum: ['phone', 'video', 'in-person', 'online'],
    },
    location: String,
    jobUrl: String,
    notes: String,
    salary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'INR',
      },
    },
    resumeUsed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
    },
    hasOffer: Boolean,
    offerDetails: {
      salary: Number,
      currency: String,
      startDate: Date,
      accepted: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Application', applicationSchema);
