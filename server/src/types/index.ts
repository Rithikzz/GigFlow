import { Document, Types } from 'mongoose';

/** User document interface for Mongoose */
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(enteredPassword: string): Promise<boolean>;
}

/** Lead status union type */
export type LeadStatus = 'new' | 'contacted' | 'negotiating' | 'won' | 'lost';

/** Embedded note subdocument interface */
export interface INote {
  _id?: Types.ObjectId;
  authorName: string;
  content: string;
  createdAt?: Date;
}

/** Lead document interface for Mongoose */
export interface ILead extends Document {
  _id: Types.ObjectId;
  title: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  status: LeadStatus;
  value: number;
  source: string;
  description?: string;
  notes: INote[];
  assignedTo?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/** JWT token payload structure */
export interface JwtPayload {
  id: string;
  iat?: number;
  exp?: number;
}
