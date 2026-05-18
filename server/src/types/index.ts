import { Document, Types } from 'mongoose';

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

export type LeadStatus = 'new' | 'contacted' | 'negotiating' | 'won' | 'lost';

export interface INote {
  _id?: Types.ObjectId;
  authorName: string;
  content: string;
  createdAt?: Date;
}

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

export interface JwtPayload {
  id: string;
  iat?: number;
  exp?: number;
}
