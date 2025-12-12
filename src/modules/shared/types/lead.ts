// Lead domain types - used across lead management, admin panels, and API services
export type LeadStatus = 'NEW' | 'IN_PROGRESS' | 'CONTACTED' | 'CONVERTED' | 'DROPPED';

export interface Lead {
  id: number;
  email: string;
  phone: string;
  quantity: number;
  serviceName: string;
  productId?: number;
  vendorId?: number;
  sourcePage?: string;
  triggerType?: 'click' | 'auto';
  createdAt: string;   // ISO datetime
  updatedAt: string;   // ISO datetime
  status: LeadStatus;
  notes?: string;
}
