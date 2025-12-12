'use client';

import React, { useEffect, useState } from 'react';
import userVendorService from '@/services/userVendorService';
import fileService from '@/services/fileService';
import { format } from 'date-fns';

type Vendor = any;

export default function VendorKycReview() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vendors, setVendors] = useState<any[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  const loadVendors = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await userVendorService.getPendingKycVendors(0, 50);
      setVendors(res?.content ?? res ?? []);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const onSelectVendor = (vendor: any) => {
    setSelectedVendor(vendor);
    setDocuments(vendor?.verificationDocuments ?? []);
  };

  const onUploadDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedVendor) return;

    try {
      setUploading(true);
      setError(null);
      const uploadedFile = await fileService.uploadFile(file);
      setDocuments((d) => [...d, uploadedFile]);
    } catch (e: any) {
      setError(e?.message ?? 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onApproveKyc = async () => {
    if (!selectedVendor) return;
    try {
      setLoading(true);
      const docUrls = documents.map((d) => d.url || d.documentUrl);
      await userVendorService.submitVendorKyc(selectedVendor.id, docUrls);
      await userVendorService.verifyVendor({ vendorId: selectedVendor.id, verificationStatus: 'VERIFIED' as any });
      await loadVendors();
      setSelectedVendor(null);
    } catch (e: any) {
      setError(e?.message ?? 'Approval failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !selectedVendor) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading KYC vendors...</div>
      </div>
    );
  }

  if (!selectedVendor) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-800">KYC Document Review</h3>
          <button onClick={loadVendors} className="text-sm text-indigo-600 hover:underline">Refresh</button>
        </div>

        {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">{error}</div>}

        {vendors.length === 0 && (
          <div className="p-6 text-center text-gray-500 bg-white rounded-lg border">No vendors pending KYC verification</div>
        )}

        <div className="grid gap-4">
          {vendors.map((v: any) => (
            <div key={v.id} className="p-4 bg-white border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{v.vendorName || v.name || v.companyName}</h4>
                  <p className="text-sm text-gray-600">{v.email}</p>
                  <p className="text-xs text-gray-500 mt-1">Status: {v.verificationStatus || 'PENDING'}</p>
                </div>
                <button onClick={() => onSelectVendor(v)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                  Review KYC
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-800">KYC Review: {selectedVendor.vendorName || selectedVendor.name}</h3>
          <p className="text-sm text-gray-600">{selectedVendor.email}</p>
        </div>
        <button onClick={() => setSelectedVendor(null)} className="px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50">Back</button>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">{error}</div>}

      {/* Vendor Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white border rounded-lg">
        <div>
          <label className="text-xs text-gray-600 uppercase">Company Name</label>
          <p className="text-sm font-medium text-gray-900">{selectedVendor.companyName || 'N/A'}</p>
        </div>
        <div>
          <label className="text-xs text-gray-600 uppercase">GST Number</label>
          <p className="text-sm font-medium text-gray-900">{selectedVendor.gstNumber || 'N/A'}</p>
        </div>
        <div>
          <label className="text-xs text-gray-600 uppercase">PAN Number</label>
          <p className="text-sm font-medium text-gray-900">{selectedVendor.panNumber || 'N/A'}</p>
        </div>
        <div>
          <label className="text-xs text-gray-600 uppercase">Phone</label>
          <p className="text-sm font-medium text-gray-900">{selectedVendor.phone || 'N/A'}</p>
        </div>
      </div>

      {/* Documents */}
      <div className="p-4 bg-white border rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-800">KYC Documents</h4>
          <label className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
            <span>Upload Document</span>
            <input type="file" onChange={onUploadDocument} disabled={uploading} accept=".pdf,.jpg,.png,.doc,.docx" className="hidden" />
          </label>
        </div>

        {uploading && <div className="text-sm text-gray-600 mb-3">Uploading...</div>}

        {documents.length === 0 && (
          <div className="p-4 text-center text-gray-500 border border-dashed rounded-md">No documents uploaded yet</div>
        )}

        {documents.length > 0 && (
          <div className="space-y-2">
            {documents.map((doc: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{doc.name || doc.fileName || `Document ${idx + 1}`}</p>
                  <p className="text-xs text-gray-600">{doc.size ? (doc.size / 1024).toFixed(2) : '0'} KB</p>
                </div>
                <div className="flex gap-2">
                  {doc.url || doc.documentUrl ? (
                    <a href={doc.url || doc.documentUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                      View
                    </a>
                  ) : null}
                  <button onClick={() => setDocuments(documents.filter((_, i) => i !== idx))} className="text-xs text-red-600 hover:underline">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-end p-4 bg-white border rounded-lg">
        <button onClick={() => setSelectedVendor(null)} className="px-4 py-2 border rounded-md hover:bg-gray-50 text-sm">
          Cancel
        </button>
        <button onClick={onApproveKyc} disabled={documents.length === 0 || uploading || loading} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm disabled:opacity-50">
          {loading ? 'Approving...' : 'Approve KYC'}
        </button>
      </div>
    </div>
  );
}
