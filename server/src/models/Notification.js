import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['subscription', 'application', 'interview', 'email', 'system'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    data: mongoose.Schema.Types.Mixed,
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
    actionUrl: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Notification', notificationSchema);
