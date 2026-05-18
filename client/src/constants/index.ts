import { LeadSource, LeadStatus, LeadSort } from '../types';

export const LEAD_STATUSES: LeadStatus[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'LOST'];
export const LEAD_SOURCES: LeadSource[] = ['WEBSITE', 'INSTAGRAM', 'REFERRAL'];
export const LEAD_SORTS: LeadSort[] = ['latest', 'oldest'];

export const PAGE_SIZE = 10;
