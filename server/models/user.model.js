import argon2 from 'argon2';
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true, min: 3, max: 50 },
    password: { type: String, required: true },
    profileImgLink: { type: String },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    lastLoggedInDate: { type: Date },
    ecoPoints: { type: Number, default: 0, index: true }, // total eco-points earned (denormalized for quick access)
    level: { type: Number, default: 1 }, // user level based on points
    currentStreak: { type: Number, default: 0 }, // current consecutive-day streak
    longestStreak: { type: Number, default: 0 }, // longest streak achieved
    badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }], // earned badge IDs
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Hash password before saving the user
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await argon2.hash(this.password);
  }
  next();
});

// Method to compare passwords
UserSchema.methods.isValidPassword = async function (password) {
  return await argon2.verify(this.password, password);
};

export default mongoose.model('User', UserSchema);
