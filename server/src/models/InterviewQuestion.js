import mongoose from 'mongoose';

const interviewQuestionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['hr', 'software', 'finance', 'marketing', 'data-science'],
      required: true,
    },
    question: {
      type: String,
      required: true,
      unique: true,
    },
    suggestedAnswer: String,
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    tips: [String],
    relatedTopics: [String],
    isPopular: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('InterviewQuestion', interviewQuestionSchema);
