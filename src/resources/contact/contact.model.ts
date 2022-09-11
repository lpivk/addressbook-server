import mongoose from 'mongoose';
import { IContact } from './contact.interface';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    userId: {
      type: String,
    },
    isFavorite: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

export const ContactModel = mongoose.model<IContact>('Contact', contactSchema);
