import mongoose from 'mongoose';
import { ILead, INote } from '../types/index.js';

const noteSchema = new mongoose.Schema<INote>(
  {
    authorName: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const leadSchema = new mongoose.Schema<ILead>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a lead title'],
      trim: true,
    },
    clientName: {
      type: String,
      required: [true, 'Please provide client name'],
      trim: true,
    },
    clientEmail: {
      type: String,
      required: [true, 'Please provide client email'],
      trim: true,
      lowercase: true,
    },
    clientPhone: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'negotiating', 'won', 'lost'],
      default: 'new',
    },
    value: {
      type: Number,
      required: [true, 'Please provide deal valuation'],
      min: [0, 'Value must be positive'],
      default: 0,
    },
    source: {
      type: String,
      default: 'Website form',
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    notes: [noteSchema],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export const Lead = mongoose.model<ILead>('Lead', leadSchema);
export default Lead;
