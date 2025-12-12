// Module: buyer/lead - Service for lead submission API calls
import { API } from '@/shared/config/api-endpoints';
import { api } from '@/shared/services/api';

export type CreateLeadPayload = {
  email: string;
  phone: string;
  quantity: number | string;
  unit: string;  
  serviceName: string;
  productId?: number;
  vendorId?: number;
  sourcePage?: string;
  triggerType?: 'click' | 'auto';
};

export const leadService = {
  createLead: async (payload: CreateLeadPayload) => {
    const response = await api.post(API.buyer.lead.createLead, payload);
    return response.data;
  },
};
