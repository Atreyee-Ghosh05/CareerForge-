import mongoose from 'mongoose';

const internshipSchema = new mongoose.Schema(
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
      required: [true, 'Internship role is required'],
    },
    status: {
      type: String,
      enum: ['applied', 'shortlisted', 'interview', 'rejected', 'accepted', 'completed'],
      default: 'applied',
    },
    startDate: Date,
    endDate: Date,
    duration: String,
    location: String,
    stipend: {
      amount: Number,
      currency: {
        type: String,
        default: 'INR',
      },
    },
    jobUrl: String,
    description: String,
    notes: String,
    dateApplied: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Internship', internshipSchema);
