import React from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Lead, LeadStatus } from '../../types';
import { X, Save } from 'lucide-react';

const leadSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  clientName: z.string().min(2, 'Client name must be at least 2 characters'),
  clientEmail: z.string().email('Please enter a valid email address'),
  clientPhone: z.string().optional(),
  value: z.coerce.number().min(0, 'Value must be positive'),
  source: z.string().min(2, 'Source is required'),
  status: z.enum(['new', 'contacted', 'negotiating', 'won', 'lost'] as const),
  description: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadFormProps {
  initialData?: Lead;
  onSubmit: (data: LeadFormData) => void;
  onClose: () => void;
}

export const LeadForm: React.FC<LeadFormProps> = ({ initialData, onSubmit, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema) as unknown as Resolver<LeadFormData>,
    defaultValues: initialData || {
      title: '',
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      value: 0,
      source: 'Website form',
      status: 'new',
      description: '',
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-md">
      <div className="w-full max-w-lg glass-card rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
          <h2 className="text-lg font-heading font-bold text-white m-0">
            {initialData ? 'Edit Lead' : 'Add New Lead'}
          </h2>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg hover:bg-white/5 text-dark-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-1.5">
              Lead / Project Title
            </label>
            <input
              type="text"
              placeholder="e.g. Mobile App Redesign"
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
              {...register('title')}
            />
            {errors.title && (
              <p className="text-xs text-rose-400 mt-1">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-1.5">
                Client Name
              </label>
              <input
                type="text"
                placeholder="e.g. Stripe"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                {...register('clientName')}
              />
              {errors.clientName && (
                <p className="text-xs text-rose-400 mt-1">{errors.clientName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-1.5">
                Deal Value ($)
              </label>
              <input
                type="number"
                placeholder="e.g. 5000"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                {...register('value')}
              />
              {errors.value && (
                <p className="text-xs text-rose-400 mt-1">{errors.value.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-1.5">
                Client Email
              </label>
              <input
                type="email"
                placeholder="client@company.com"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                {...register('clientEmail')}
              />
              {errors.clientEmail && (
                <p className="text-xs text-rose-400 mt-1">{errors.clientEmail.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-1.5">
                Client Phone (Optional)
              </label>
              <input
                type="text"
                placeholder="+1 (555) 012-3456"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                {...register('clientPhone')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-1.5">
                Lead Source
              </label>
              <input
                type="text"
                placeholder="e.g. Cold email, Referral"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                {...register('source')}
              />
              {errors.source && (
                <p className="text-xs text-rose-400 mt-1">{errors.source.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-1.5">
                Pipeline Status
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm appearance-none"
                {...register('status')}
              >
                <option value="new" className="bg-dark-900 text-white">New</option>
                <option value="contacted" className="bg-dark-900 text-white">Contacted</option>
                <option value="negotiating" className="bg-dark-900 text-white">Negotiating</option>
                <option value="won" className="bg-dark-900 text-white">Won</option>
                <option value="lost" className="bg-dark-900 text-white">Lost</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark-300 uppercase tracking-wider mb-1.5">
              Description / Notes
            </label>
            <textarea
              rows={3}
              placeholder="Provide background information on deal sizing, project scope, or client preferences."
              className="w-full px-4 py-2.5 rounded-xl glass-input text-sm resize-none"
              {...register('description')}
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-dark-200 text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold shadow-lg shadow-brand-500/20 transition-all"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Saving...' : 'Save Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
