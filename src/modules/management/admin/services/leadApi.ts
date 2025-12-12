// TEMP MOCK IMPLEMENTATION
// NOTE: This file currently uses stubbed implementations.
// TODO: Replace bodies of these functions with real HTTP calls
// to Java + MySQL backend once lead APIs are implemented.

import type { Lead, LeadStatus } from '@/modules/shared/types/lead';

export interface LeadFilter {
  status?: LeadStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface LeadListResponse {
  items: Lead[];
  total: number;
  page: number;
  pageSize: number;
}

export const leadApi = {
  async listLeads(filter: LeadFilter = {}): Promise<LeadListResponse> {
    // TODO: Call GET /api/leads with filters (status, search, page, pageSize)
    // Currently returns empty result set
    return Promise.resolve({
      items: [],
      total: 0,
      page: filter.page ?? 1,
      pageSize: filter.pageSize ?? 20,
    });
  },

  async getLeadById(id: number): Promise<Lead | null> {
    // TODO: Call GET /api/leads/{id}
    // Currently returns null (lead not found)
    return Promise.resolve(null);
  },

  async updateLeadStatus(id: number, status: LeadStatus): Promise<void> {
    // TODO: Call PATCH /api/leads/{id}/status with { status }
    // Currently a no-op
    return Promise.resolve();
  },

  async updateLeadNotes(id: number, notes: string): Promise<void> {
    // TODO: Call PATCH /api/leads/{id}/notes with { notes }
    // Currently a no-op
    return Promise.resolve();
  },

  async deleteLead(id: number): Promise<void> {
    // TODO: Call DELETE /api/leads/{id}
    // Currently a no-op
    return Promise.resolve();
  },
};
