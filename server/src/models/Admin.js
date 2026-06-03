import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'super-admin', 'moderator'],
      default: 'admin',
    },
    permissions: [String],
    activityLog: [
      {
        action: String,
        targetUserId: mongoose.Schema.Types.ObjectId,
        details: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Admin', adminSchema);
