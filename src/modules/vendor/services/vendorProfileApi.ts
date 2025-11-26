import { api } from '@/shared/services/api';

export interface VendorProfile {
  id?: number;
  vendorId?: number;
  businessName: string;
  businessType: string;
  gstNumber: string;
  panNumber: string;
  establishedYear?: string;
  employeeCount?: string;
  businessDescription?: string;
  website?: string;
  contactPersonName: string;
  designation?: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  accountHolderName?: string;
  categories?: string[];
  certifications?: string[];
  profileUrl?: string;
  portfolioVideoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VendorProfileResponse {
  success: boolean;
  message: string;
  data: VendorProfile;
}

// Vendor Profile API functions
export const vendorProfileAPI = {
  // Get current vendor's profile
  getMyProfile: async (): Promise<VendorProfile> => {
    try {
      console.log('📋 Fetching vendor profile...');
      const response = await api.get('/api/vendor/profile');
      console.log('✅ Vendor profile fetched:', response.data);
      
      // Handle different response formats
      const data = response.data?.data || response.data;
      return data;
    } catch (error: any) {
      console.error('❌ Error fetching vendor profile:', error?.response?.data || error?.message);
      throw error;
    }
  },

  // Get vendor profile by ID
  getProfileById: async (vendorId: number): Promise<VendorProfile> => {
    try {
      console.log(`📋 Fetching profile for vendor ${vendorId}...`);
      const response = await api.get(`/api/vendor/${vendorId}/profile`);
      console.log(`✅ Profile fetched for vendor ${vendorId}:`, response.data);
      
      const data = response.data?.data || response.data;
      return data;
    } catch (error: any) {
      console.error(`❌ Error fetching profile for vendor ${vendorId}:`, error?.response?.data || error?.message);
      throw error;
    }
  },

  // Update vendor profile
  updateProfile: async (profileData: Partial<VendorProfile>): Promise<VendorProfile> => {
    try {
      console.log('📝 Updating vendor profile...', profileData);
      const response = await api.put('/api/vendor/profile', profileData);
      console.log('✅ Vendor profile updated successfully:', response.data);
      
      const data = response.data?.data || response.data;
      return data;
    } catch (error: any) {
      console.error('❌ Error updating vendor profile:', error?.response?.data || error?.message);
      throw error;
    }
  },

  // Get vendor business details
  getBusinessDetails: async (): Promise<Partial<VendorProfile>> => {
    try {
      console.log('🏢 Fetching business details...');
      const response = await api.get('/api/vendor/business-details');
      console.log('✅ Business details fetched:', response.data);
      
      const data = response.data?.data || response.data;
      return data;
    } catch (error: any) {
      console.error('❌ Error fetching business details:', error?.response?.data || error?.message);
      return {};
    }
  },

  // Get vendor contact information
  getContactInfo: async (): Promise<Partial<VendorProfile>> => {
    try {
      console.log('📞 Fetching contact information...');
      const response = await api.get('/api/vendor/contact-info');
      console.log('✅ Contact info fetched:', response.data);
      
      const data = response.data?.data || response.data;
      return data;
    } catch (error: any) {
      console.error('❌ Error fetching contact info:', error?.response?.data || error?.message);
      return {};
    }
  },

  // Get vendor address
  getAddress: async (): Promise<Partial<VendorProfile>> => {
    try {
      console.log('📍 Fetching address...');
      const response = await api.get('/api/vendor/address');
      console.log('✅ Address fetched:', response.data);
      
      const data = response.data?.data || response.data;
      return data;
    } catch (error: any) {
      console.error('❌ Error fetching address:', error?.response?.data || error?.message);
      return {};
    }
  },

  // Get vendor bank details
  getBankDetails: async (): Promise<Partial<VendorProfile>> => {
    try {
      console.log('🏦 Fetching bank details...');
      const response = await api.get('/api/vendor/bank-details');
      console.log('✅ Bank details fetched:', response.data);
      
      const data = response.data?.data || response.data;
      return data;
    } catch (error: any) {
      console.error('❌ Error fetching bank details:', error?.response?.data || error?.message);
      return {};
    }
  },

  // Upload vendor avatar/thumbnail
  uploadAvatar: async (file: File): Promise<string> => {
    try {
      console.log('📸 Uploading vendor avatar...');
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post('/api/vendor/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('✅ Avatar uploaded successfully:', response.data);
      return response.data?.data?.url || response.data?.url || '';
    } catch (error: any) {
      console.error('❌ Error uploading avatar:', error?.response?.data || error?.message);
      throw error;
    }
  },

  // Get vendor statistics
  getVendorStats: async (): Promise<any> => {
    try {
      console.log('📊 Fetching vendor statistics...');
      const response = await api.get('/api/vendor/statistics');
      console.log('✅ Statistics fetched:', response.data);
      
      const data = response.data?.data || response.data;
      return data;
    } catch (error: any) {
      console.error('❌ Error fetching statistics:', error?.response?.data || error?.message);
      return null;
    }
  }
};
