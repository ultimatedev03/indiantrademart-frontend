import { api } from '@/shared/services/api';
import { API } from '@/shared/config/api-endpoints';

export interface VendorRanking {
  id: number;
  vendorId: number;
  score: number;
  rank: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  avgRating: number;
  completionRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExcelImportResponse {
  success: boolean;
  message: string;
  totalRows: number;
  successfulImports: number;
  failedImports: number;
  errors: string[];
  importedProducts: any[];
}

export interface VendorTaxProfile {
  id: number;
  vendorId: number;
  gstNumber: string;
  panNumber: string;
  companyName: string;
  address: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GstValidationResponse {
  valid: boolean;
  gstNumber: string;
  message: string;
  companyName?: string;
  address?: string;
  status?: string;
}

export interface PanValidationResponse {
  valid: boolean;
  panNumber: string;
  message: string;
  holderName?: string;
  category?: string;
  status?: string;
}

export interface VendorGstSelection {
  id: number;
  vendorId: number;
  gstNumber: string;
  gstRate: number;
  isSelected: boolean;
  createdAt: string;
}

export interface VendorTdsSelection {
  id: number;
  vendorId: number;
  panNumber: string;
  tdsRate: number;
  isSelected: boolean;
  createdAt: string;
}

export interface VendorGstSelectionDto {
  vendorId: number;
  gstNumber: string;
  selectedGstRates: number[];
  selectedTdsRates: number[];
}

export interface ImportTemplate {
  columns: string[];
  sampleData: any[];
  instructions: string[];
}

// ✅ You can also define a DTO for vendor product creation based on backend body
export interface CreateVendorProductDto {
  vendorId: number;
  sku: string;
  productName: string;
  productTitle: string;
  description: string;
  shortDescription: string;
  category: string;
  subCategory: string;
  unitPrice: number;
  mrp: number;
  stockQuantity: number;
  minimumOrderQuantity: number;
  unitOfMeasure: string;
  hsnCode: string;
  gstRate: number;
  primaryImageUrl: string;
}

// Vendor API functions
export const vendorAPI = {
  // Get vendor ranking
  getVendorRanking: async (vendorId: number): Promise<VendorRanking> => {
    const response = await api.get(API.vendor.ranking(vendorId));
    return response.data;
  },

  // GST validation and verification
  validateGstNumber: async (vendorId: number, gstNumber: string): Promise<GstValidationResponse> => {
    const response = await api.get(API.vendor.tax.gstValidate(vendorId, gstNumber));
    return response.data;
  },

  verifyGstNumber: async (vendorId: number, gstNumber: string): Promise<GstValidationResponse> => {
    const response = await api.get(API.vendor.tax.gstVerify(vendorId, gstNumber));
    return response.data;
  },

  getGstDetails: async (vendorId: number, gstNumber: string): Promise<GstValidationResponse> => {
    const response = await api.get(API.vendor.tax.gstDetails(vendorId, gstNumber));
    return response.data;
  },

  // PAN validation and verification
  validatePanNumber: async (vendorId: number, panNumber: string): Promise<PanValidationResponse> => {
    const response = await api.get(API.vendor.tax.panValidate(vendorId, panNumber));
    return response.data;
  },

  verifyPanNumber: async (vendorId: number, panNumber: string): Promise<PanValidationResponse> => {
    const response = await api.get(API.vendor.tax.panVerify(vendorId, panNumber));
    return response.data;
  },

  getPanDetails: async (vendorId: number, panNumber: string): Promise<PanValidationResponse> => {
    const response = await api.get(API.vendor.tax.panDetails(vendorId, panNumber));
    return response.data;
  },

    // GST rates
    getAvailableGstRates: async (): Promise<{ gstRates: number[]; message: string }> => {
      const response = await api.get(API.vendor.tax.gstRates);
      return response.data;
    },

  // Excel import - uses excel import endpoint
  bulkImportProducts: async (vendorId: number, file: File): Promise<ExcelImportResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(API.vendor.excel.import(vendorId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Download import template
  downloadImportTemplate: async (): Promise<Blob> => {
    const response = await api.get(API.vendor.excel.template, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Product image upload
  uploadProductImages: async (vendorId: number, productId: number, images: File[]): Promise<any> => {
    const formData = new FormData();
    images.forEach(image => {
      formData.append('images', image);
    });

    const response = await api.post(API.vendor.products.uploadImages(vendorId, productId), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Import template
  getImportTemplate: async (vendorId: number): Promise<ImportTemplate> => {
    const response = await api.get(API.vendor.excel.dashboardImportTemplate(vendorId));
    return response.data;
  },

  downloadTemplate: async (vendorId: number): Promise<Blob> => {
    const response = await api.get(API.vendor.excel.dashboardDownloadTemplate(vendorId), {
      responseType: 'blob',
    });
    return response.data;
  },

  // Tax selections
  saveVendorTaxSelections: async (vendorId: number, selections: VendorGstSelectionDto): Promise<any> => {
    const response = await api.post(API.vendor.tax.selections(vendorId), selections);
    return response.data;
  },

  getVendorGstSelections: async (vendorId: number, gstNumber: string): Promise<VendorGstSelection[]> => {
    const response = await api.get(API.vendor.tax.gstSelections(vendorId, gstNumber));
    return response.data;
  },

  getVendorTdsSelections: async (vendorId: number, panNumber: string): Promise<VendorTdsSelection[]> => {
    const response = await api.get(API.vendor.tax.panSelections(vendorId, panNumber));
    return response.data;
  },

  getSelectedGstRates: async (vendorId: number, gstNumber: string): Promise<VendorGstSelection[]> => {
    const response = await api.get(API.vendor.tax.gstSelectedRates(vendorId, gstNumber));
    return response.data;
  },

  getSelectedTdsRates: async (vendorId: number, panNumber: string): Promise<VendorTdsSelection[]> => {
    const response = await api.get(API.vendor.tax.panSelectedRates(vendorId, panNumber));
    return response.data;
  },

  // Tax dashboard
  getVendorTaxDashboard: async (vendorId: number, gstNumber?: string, panNumber?: string): Promise<any> => {
    const params: any = {};
    if (gstNumber) params.gstNumber = gstNumber;
    if (panNumber) params.panNumber = panNumber;

    const response = await api.get(API.vendor.tax.dashboard(vendorId), { params });
    return response.data;
  },

  // ✅ Vendor KYC documents - Upload individual documents
  // This function uploads KYC documents one at a time using multipart form-data
  // Expected by: POST /api/kyc/upload (params: vendorId, documentType, file)
  uploadKycDocument: async (
    vendorId: number | string,
    documentType: 'PAN' | 'GST' | 'BUSINESS_REGISTRATION' | 'BANK_STATEMENT',
    file: File
  ): Promise<any> => {
    const formData = new FormData();
    formData.append('vendorId', vendorId.toString());
    formData.append('documentType', documentType);
    formData.append('file', file);

    const response = await api.post('/api/kyc/upload', formData);
    return response.data;
  },

  // ✅ Vendor KYC documents - Submit document URLs (alternative approach)
  // This function updates KYC document URLs directly
  // Expected by: POST /api/v1/vendor-kyc/documents (body: vendorId, panCardUrl, gstCertificateUrl, etc.)
  submitKycDocuments: async (data: FormData | any): Promise<any> => {
    const config =
      data instanceof FormData
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : undefined;

    const response = await api.post(API.vendor.kyc.submitDocuments, data, config);
    return response.data;
  },

  // ✅ NEW: Vendor product creation endpoint (/api/v1/vendor/products)
  createProduct: async (productData: CreateVendorProductDto): Promise<any> => {
    const response = await api.post(API.vendor.products.create, productData);
    return response.data;
  },
};
