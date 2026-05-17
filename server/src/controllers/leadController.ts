import { Request, Response } from 'express';
import { Lead } from '../models/Lead.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
export const getAllLeads = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  // Option: Scoping leads to user assignedTo or list all. We list all by default.
  const leads = await Lead.find({}).sort({ createdAt: -1 });
  
  // Format to client type structure
  const formattedLeads = leads.map(l => ({
    id: l._id,
    title: l.title,
    clientName: l.clientName,
    clientEmail: l.clientEmail,
    clientPhone: l.clientPhone,
    status: l.status,
    value: l.value,
    source: l.source,
    description: l.description,
    notes: l.notes.map(n => ({
      id: n._id,
      leadId: l._id.toString(),
      authorName: n.authorName,
      content: n.content,
      createdAt: n.createdAt,
    })),
    createdAt: l.createdAt,
    updatedAt: l.updatedAt,
  }));

  res.json(formattedLeads);
});

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Private
export const createLead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { title, clientName, clientEmail, clientPhone, status, value, source, description } = req.body;

  if (!title || !clientName || !clientEmail) {
    res.status(400);
    throw new Error('Title, Client Name and Client Email are required fields');
  }

  const lead = await Lead.create({
    title,
    clientName,
    clientEmail,
    clientPhone,
    status: status || 'new',
    value: value || 0,
    source: source || 'Website form',
    description,
    assignedTo: req.user?._id,
  });

  res.status(201).json({
    id: lead._id,
    title: lead.title,
    clientName: lead.clientName,
    clientEmail: lead.clientEmail,
    clientPhone: lead.clientPhone,
    status: lead.status,
    value: lead.value,
    source: lead.source,
    description: lead.description,
    notes: [],
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
  });
});

// @desc    Update a lead
// @route   PUT /api/leads/:id
// @access  Private
export const updateLead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  // Update fields
  const updatedLead = await Lead.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedLead) {
    res.status(400);
    throw new Error('Failed to update lead');
  }

  res.json({
    id: updatedLead._id,
    title: updatedLead.title,
    clientName: updatedLead.clientName,
    clientEmail: updatedLead.clientEmail,
    clientPhone: updatedLead.clientPhone,
    status: updatedLead.status,
    value: updatedLead.value,
    source: updatedLead.source,
    description: updatedLead.description,
    notes: updatedLead.notes.map(n => ({
      id: n._id,
      leadId: updatedLead._id.toString(),
      authorName: n.authorName,
      content: n.content,
      createdAt: n.createdAt,
    })),
    createdAt: updatedLead.createdAt,
    updatedAt: updatedLead.updatedAt,
  });
});

// @desc    Update lead status (Quick Stage Change)
// @route   PATCH /api/leads/:id/status
// @access  Private
export const updateLeadStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { status } = req.body;

  if (!status) {
    res.status(400);
    throw new Error('Pipeline status is required');
  }

  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  lead.status = status;
  await lead.save();

  res.json({
    id: lead._id,
    title: lead.title,
    clientName: lead.clientName,
    clientEmail: lead.clientEmail,
    clientPhone: lead.clientPhone,
    status: lead.status,
    value: lead.value,
    source: lead.source,
    description: lead.description,
    notes: lead.notes.map(n => ({
      id: n._id,
      leadId: lead._id.toString(),
      authorName: n.authorName,
      content: n.content,
      createdAt: n.createdAt,
    })),
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
  });
});

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private
export const deleteLead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  await lead.deleteOne();

  res.json({ success: true, message: 'Lead deleted from database' });
});

// @desc    Add a collaborative note
// @route   POST /api/leads/:id/notes
// @access  Private
export const addLeadNote = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { content } = req.body;

  if (!content) {
    res.status(400);
    throw new Error('Note content cannot be empty');
  }

  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }

  // Push new note embedded document
  lead.notes.push({
    authorName: req.user?.name || 'Collaborator',
    content,
  });

  await lead.save();

  res.status(201).json({
    id: lead._id,
    title: lead.title,
    clientName: lead.clientName,
    clientEmail: lead.clientEmail,
    clientPhone: lead.clientPhone,
    status: lead.status,
    value: lead.value,
    source: lead.source,
    description: lead.description,
    notes: lead.notes.map(n => ({
      id: n._id,
      leadId: lead._id.toString(),
      authorName: n.authorName,
      content: n.content,
      createdAt: n.createdAt,
    })),
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
  });
});
