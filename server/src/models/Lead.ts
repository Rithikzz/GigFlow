import mongoose from 'mongoose';
import { ILead } from '../types/index.js';

const leadSchema = new mongoose.Schema<ILead>(
  {
    name: {
      type: String,
      required: [true, 'Please provide lead name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide lead email'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'QUALIFIED', 'LOST'],
      default: 'NEW',
    },
    source: {
      type: String,
      enum: ['WEBSITE', 'INSTAGRAM', 'REFERRAL'],
      required: [true, 'Please provide lead source'],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

leadSchema.index({ status: 1, source: 1, createdAt: -1 });
leadSchema.index({ email: 1 });
leadSchema.index({ name: 'text', email: 'text' });

export const Lead = mongoose.model<ILead>('Lead', leadSchema);
export default Lead;
