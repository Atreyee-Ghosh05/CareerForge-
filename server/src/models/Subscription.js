import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
      required: true,
    },
    planName: {
      type: String,
      enum: ['free', 'lite', 'pro', 'lifetime'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled', 'paused'],
      default: 'active',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: Date,
    renewalDate: Date,
    razorpaySubscriptionId: String,
    razorpayCustomerId: String,
    razorpayPlanId: String,
    billingCycle: {
      type: String,
      enum: ['monthly', 'annual', 'lifetime'],
      default: 'monthly',
    },
    autoRenewal: {
      type: Boolean,
      default: true,
    },
    cancellationReason: String,
    cancelledAt: Date,
    paymentHistory: [
      {
        paymentId: String,
        amount: Number,
        currency: String,
        date: Date,
        status: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Subscription', subscriptionSchema);
