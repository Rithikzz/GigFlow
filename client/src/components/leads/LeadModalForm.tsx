import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LEAD_SOURCES, LEAD_STATUSES } from '../../constants';
import { CreateLeadPayload, Lead, UpdateLeadPayload } from '../../types';
import { Button, Input, Modal, Select } from '../ui';

const objectIdRegex = /^[a-fA-F0-9]{24}$/;

const leadFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'LOST']),
  source: z.enum(['WEBSITE', 'INSTAGRAM', 'REFERRAL']),
  assignedTo: z
    .string()
    .optional()
    .refine((value) => !value || objectIdRegex.test(value), 'Assigned user must be a valid user ID'),
});

type LeadFormValues = z.infer<typeof leadFormSchema>;

interface LeadModalFormProps {
  open: boolean;
  lead?: Lead;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateLeadPayload | UpdateLeadPayload) => Promise<void>;
}

export const LeadModalForm: React.FC<LeadModalFormProps> = ({ open, lead, submitting, onClose, onSubmit }) => {
  const isEdit = Boolean(lead);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: '',
      email: '',
      status: 'NEW',
      source: 'WEBSITE',
      assignedTo: '',
    },
  });

  useEffect(() => {
    if (lead) {
      reset({
        name: lead.name,
        email: lead.email,
        status: lead.status,
        source: lead.source,
        assignedTo: lead.assignedTo?._id ?? '',
      });
      return;
    }

    reset({
      name: '',
      email: '',
      status: 'NEW',
      source: 'WEBSITE',
      assignedTo: '',
    });
  }, [lead, reset]);

  const submitHandler = async (values: LeadFormValues) => {
    const payload = {
      ...values,
      assignedTo: values.assignedTo || undefined,
    };
    await onSubmit(payload);
  };

  return (
    <Modal
      open={open}
      title={isEdit ? 'Edit Lead' : 'Create Lead'}
      onClose={onClose}
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit(submitHandler)} loading={submitting}>
            {isEdit ? 'Save changes' : 'Create lead'}
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input label="Name" placeholder="Rahul Sharma" {...register('name')} error={errors.name?.message} />
        <Input label="Email" placeholder="rahul@company.com" {...register('email')} error={errors.email?.message} />
        <Select
          label="Status"
          options={LEAD_STATUSES.map((status) => ({ label: status, value: status }))}
          {...register('status')}
          error={errors.status?.message}
        />
        <Select
          label="Source"
          options={LEAD_SOURCES.map((source) => ({ label: source, value: source }))}
          {...register('source')}
          error={errors.source?.message}
        />
        <div className="md:col-span-2">
          <Input
            label="Assigned User ID (optional)"
            placeholder="MongoDB user ObjectId"
            {...register('assignedTo')}
            error={errors.assignedTo?.message}
          />
        </div>
      </div>
    </Modal>
  );
};
