import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    phone: {
      type: String,
      default: null,
    },
    profileImage: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    portfolio: {
      type: String,
      default: null,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
    },
    subscription: {
      plan: {
        type: String,
        enum: ['free', 'lite', 'pro', 'lifetime'],
        default: 'free',
      },
      status: {
        type: String,
        enum: ['active', 'expired', 'cancelled'],
        default: 'active',
      },
      startDate: Date,
      endDate: Date,
      razorpaySubscriptionId: String,
      razorpayCustomerId: String,
    },
    limits: {
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
    },
    usage: {
      resumes: {
        type: Number,
        default: 0,
      },
      applications: {
        type: Number,
        default: 0,
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    suspensionReason: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

// Method to get user public profile
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpire;
  delete obj.emailVerificationToken;
  delete obj.emailVerificationExpire;
  return obj;
};

export default mongoose.model('User', userSchema);
