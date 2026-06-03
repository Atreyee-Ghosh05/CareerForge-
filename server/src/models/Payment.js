import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    razorpayPaymentId: {
      type: String,
      unique: true,
    },
    razorpayOrderId: String,
    razorpaySignature: String,
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed', 'cancelled'],
      default: 'pending',
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plan',
    },
    planName: String,
    billingCycle: String,
    description: String,
    receiptUrl: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Payment', paymentSchema);
