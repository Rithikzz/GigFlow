import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { SortOrder } from 'mongoose';
import { Lead } from '../models/Lead.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import AppError from '../utils/appError.js';
import { successResponse } from '../utils/apiResponse.js';

const PAGE_LIMIT = 10;
const getParamId = (value: string | string[]): string => (Array.isArray(value) ? value[0] : value);

export const getAllLeads = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { status, source, search, sort = 'latest', page = '1' } = req.query as {
    status?: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'LOST';
    source?: 'WEBSITE' | 'INSTAGRAM' | 'REFERRAL';
    search?: string;
    sort?: 'latest' | 'oldest';
    page?: string;
  };

  const pageNumber = Number(page) || 1;
  const skip = (pageNumber - 1) * PAGE_LIMIT;

  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (source) filter.source = source;
  if (search && search.trim()) {
    const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [{ name: { $regex: escaped, $options: 'i' } }, { email: { $regex: escaped, $options: 'i' } }];
  }

  const sortBy: Record<string, SortOrder> = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

  const [leads, totalRecords] = await Promise.all([
    Lead.find(filter).sort(sortBy).skip(skip).limit(PAGE_LIMIT).populate('assignedTo', 'name email role').lean(),
    Lead.countDocuments(filter),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalRecords / PAGE_LIMIT));

  successResponse(res, 200, {
    message: 'Leads fetched successfully',
    data: leads,
    pagination: {
      currentPage: pageNumber,
      totalPages,
      totalRecords,
      hasNextPage: pageNumber < totalPages,
      hasPrevPage: pageNumber > 1,
      perPage: PAGE_LIMIT,
    },
  });
});

export const getLeadById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const id = getParamId(req.params.id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw AppError.badRequest('Invalid lead id');
  }

  const lead = await Lead.findById(id).populate('assignedTo', 'name email role').lean();
  if (!lead) {
    throw AppError.notFound('Lead not found');
  }

  successResponse(res, 200, {
    message: 'Lead fetched successfully',
    data: lead,
  });
});

export const createLead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { name, email, status, source, assignedTo } = req.body as {
    name: string;
    email: string;
    status?: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'LOST';
    source: 'WEBSITE' | 'INSTAGRAM' | 'REFERRAL';
    assignedTo?: string;
  };

  const lead = await Lead.create({
    name,
    email,
    status: status ?? 'NEW',
    source,
    assignedTo: assignedTo ?? null,
    createdBy: req.user?._id ?? null,
  });

  const createdLead = await Lead.findById(lead._id).populate('assignedTo', 'name email role').lean();

  successResponse(res, 201, {
    message: 'Lead created successfully',
    data: createdLead,
  });
});

export const updateLead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const id = getParamId(req.params.id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw AppError.badRequest('Invalid lead id');
  }

  const { name, email, status, source, assignedTo } = req.body as {
    name?: string;
    email?: string;
    status?: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'LOST';
    source?: 'WEBSITE' | 'INSTAGRAM' | 'REFERRAL';
    assignedTo?: string | null;
  };

  const lead = await Lead.findById(id);
  if (!lead) {
    throw AppError.notFound('Lead not found');
  }

  if (name !== undefined) lead.name = name;
  if (email !== undefined) lead.email = email;
  if (status !== undefined) lead.status = status;
  if (source !== undefined) lead.source = source;
  if (assignedTo !== undefined) {
    lead.assignedTo = assignedTo ? new mongoose.Types.ObjectId(assignedTo) : null;
  }

  await lead.save();

  const updatedLead = await Lead.findById(id).populate('assignedTo', 'name email role').lean();

  successResponse(res, 200, {
    message: 'Lead updated successfully',
    data: updatedLead,
  });
});

export const deleteLead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const id = getParamId(req.params.id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw AppError.badRequest('Invalid lead id');
  }

  const lead = await Lead.findById(id);
  if (!lead) {
    throw AppError.notFound('Lead not found');
  }

  await lead.deleteOne();

  successResponse(res, 200, {
    message: 'Lead deleted successfully',
    data: null,
  });
});
