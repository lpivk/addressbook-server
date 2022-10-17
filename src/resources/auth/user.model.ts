import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import { IUser } from './user.interface';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      required: true,
      default: 'user',
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.isValidPassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const hashedPassword = await bcrypt.hash(this.password, 10);
  this.password = hashedPassword;

  next();
});

userSchema.pre('updateOne', async function (next) {
  if (!this._update.password) {
    next();
    return;
  }

  const hashedPassword = await bcrypt.hash(this._update.password, 10);
  this._update.password = hashedPassword;
  next();
});

export const UserModel = mongoose.model<IUser>('User', userSchema);
