import mongoose from 'mongoose';

const interviewProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      enum: ['hr', 'software', 'finance', 'marketing', 'data-science'],
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: String,
    isSaved: {
      type: Boolean,
      default: false,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    notes: String,
    lastReviewedAt: Date,
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('InterviewProgress', interviewProgressSchema);
