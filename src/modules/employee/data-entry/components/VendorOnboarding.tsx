'use client';

import React, { useEffect, useMemo, useState } from 'react';
import userVendorService from '@/services/userVendorService';
import { format } from 'date-fns';

type Vendor = any;

export default function VendorOnboarding() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingApproval, setPendingApproval] = useState<Vendor[]>([] as any);
  const [pendingKyc, setPendingKyc] = useState<Vendor[]>([] as any);

  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectNote, setRejectNote] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [approvalRes, kycRes] = await Promise.all([
        userVendorService.getPendingApprovalVendors(0, 20),
        userVendorService.getPendingKycVendors(0, 20),
      ]);
      setPendingApproval(approvalRes?.content ?? approvalRes ?? []);
      setPendingKyc(kycRes?.content ?? kycRes ?? []);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onSelectVendor = async (vendorId: number) => {
    try {
      setActionLoading(true);
      const v = await userVendorService.getVendorById(vendorId);
      setSelectedVendor(v);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to fetch vendor');
    } finally {
      setActionLoading(false);
    }
  };

  const onApprove = async (vendorId: number) => {
    try {
      setActionLoading(true);
      await userVendorService.verifyVendor({ vendorId, verificationStatus: 'VERIFIED' as any });
      await userVendorService.updateVendorStatus(vendorId, 'VERIFIED' as any);
      await loadData();
      setSelectedVendor(null);
    } catch (e: any) {
      setError(e?.message ?? 'Approval failed');
    } finally {
      setActionLoading(false);
    }
  };

  const onReject = async (vendorId: number) => {
    try {
      setActionLoading(true);
      await userVendorService.verifyVendor({ vendorId, verificationStatus: 'REJECTED' as any, comments: rejectNote });
      await userVendorService.updateVendorStatus(vendorId, 'REJECTED' as any);
      await loadData();
      setSelectedVendor(null);
      setRejectNote('');
    } catch (e: any) {
      setError(e?.message ?? 'Rejection failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading vendor onboarding...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">{error}</div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Vendor Onboarding</h2>
          <p className="text-sm text-gray-500">Approve or review vendors to get them live</p>
        </div>
        <a
          href="#vendor-create"
          onClick={(e) => {
            e.preventDefault();
            const el = document.getElementById('vendor-create');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Create Vendor
        </a>
      </div>

      {/* Pending Approval */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-gray-800">Pending Approval</h3>
          <button onClick={loadData} className="text-sm text-indigo-600 hover:underline">Refresh</button>
        </div>
        <div className="overflow-hidden bg-white border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingApproval.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-500">No vendors awaiting approval</td>
                </tr>
              )}
              {pendingApproval.map((v: any) => (
                <tr key={v.id}>
                  <td className="px-4 py-3 text-sm text-gray-900">{v.vendorName || v.name || v.companyName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{v.businessType || v.vendorType || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{v.createdAt ? format(new Date(v.createdAt), 'dd MMM yyyy') : '-'}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => onSelectVendor(v.id)} className="px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50">View</button>
                    <button onClick={() => onApprove(v.id)} className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50" disabled={actionLoading}>Approve</button>
                    <button onClick={() => setSelectedVendor(v)} className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700">Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pending KYC */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-gray-800">Pending KYC</h3>
          <button onClick={loadData} className="text-sm text-indigo-600 hover:underline">Refresh</button>
        </div>
        <div className="overflow-hidden bg-white border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingKyc.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-gray-500">No vendors with pending KYC</td>
                </tr>
              )}
              {pendingKyc.map((v: any) => (
                <tr key={v.id}>
                  <td className="px-4 py-3 text-sm text-gray-900">{v.vendorName || v.name || v.companyName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{v.verificationStatus || 'PENDING'}</td>
                  <td className="px-4 py-3 text-right">
                    <a href="#kyc" onClick={(e)=>{e.preventDefault(); const el=document.getElementById('kyc-section'); el?.scrollIntoView({behavior:'smooth'});}} className="px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50">Review</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Inline Reject Drawer/Modal substitute */}
      {selectedVendor && (
        <div className="border rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-800">Reject Vendor</h4>
            <button onClick={() => setSelectedVendor(null)} className="text-gray-500 hover:text-gray-700">Close</button>
          </div>
          <p className="text-sm text-gray-600 mb-2">Provide a reason for rejection</p>
          <textarea value={rejectNote} onChange={(e)=>setRejectNote(e.target.value)} className="w-full border rounded-md p-2 text-sm" rows={3} placeholder="Reason..." />
          <div className="mt-3 flex justify-end gap-2">
            <button onClick={() => setSelectedVendor(null)} className="px-3 py-1.5 text-sm border rounded-md">Cancel</button>
            <button onClick={() => onReject((selectedVendor as any).id)} disabled={actionLoading || !rejectNote.trim()} className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50">Confirm Reject</button>
          </div>
        </div>
      )}

      {/* Create Vendor section anchor */}
      <div id="vendor-create">
        <VendorCreateForm onCreated={loadData} />
      </div>

      {/* KYC Section anchor - moved to separate tab */}
    </div>
  );
}

function VendorCreateForm({ onCreated }: { onCreated?: () => void }) {
  const [form, setForm] = useState({
    vendorName: '',
    email: '',
    phone: '',
    businessType: 'MANUFACTURER',
    companyName: '',
    gstNumber: '',
    panNumber: '',
    address: '',
    city: '',
    state: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const payload: any = {
        name: form.vendorName,
        vendorName: form.vendorName,
        companyName: form.companyName,
        email: form.email,
        phone: form.phone,
        businessType: form.businessType,
        gstNumber: form.gstNumber || undefined,
        panNumber: form.panNumber || undefined,
        address: form.address,
        city: form.city,
        state: form.state,
      };
      const res = await userVendorService.createVendor(payload);
      setMessage('Vendor created successfully');
      setForm({ vendorName: '', email: '', phone: '', businessType: 'MANUFACTURER', companyName: '', gstNumber: '', panNumber: '', address: '', city: '', state: '' });
      onCreated?.();
    } catch (e: any) {
      setMessage(e?.response?.data?.message || e?.message || 'Failed to create vendor');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-8 bg-white border rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Create Vendor</h3>
      {message && (
        <div className="mb-3 text-sm text-gray-700">{message}</div>
      )}
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Vendor Name</label>
          <input name="vendorName" value={form.vendorName} onChange={onChange} required className="w-full border rounded-md p-2" />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Company Name</label>
          <input name="companyName" value={form.companyName} onChange={onChange} className="w-full border rounded-md p-2" />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Email</label>
          <input type="email" name="email" value={form.email} onChange={onChange} required className="w-full border rounded-md p-2" />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Phone</label>
          <input name="phone" value={form.phone} onChange={onChange} required className="w-full border rounded-md p-2" />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Business Type</label>
          <select name="businessType" value={form.businessType} onChange={onChange} className="w-full border rounded-md p-2">
            <option>MANUFACTURER</option>
            <option>DISTRIBUTOR</option>
            <option>WHOLESALER</option>
            <option>RETAILER</option>
            <option>SERVICE_PROVIDER</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">GST Number</label>
          <input name="gstNumber" value={form.gstNumber} onChange={onChange} className="w-full border rounded-md p-2" />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">PAN Number</label>
          <input name="panNumber" value={form.panNumber} onChange={onChange} className="w-full border rounded-md p-2" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-700 mb-1">Address</label>
          <textarea name="address" value={form.address} onChange={onChange} className="w-full border rounded-md p-2" rows={2} />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">City</label>
          <input name="city" value={form.city} onChange={onChange} className="w-full border rounded-md p-2" />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">State</label>
          <input name="state" value={form.state} onChange={onChange} className="w-full border rounded-md p-2" />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <button type="submit" disabled={submitting} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50">
            {submitting ? 'Creating...' : 'Create Vendor'}
          </button>
        </div>
      </form>
    </div>
  );
}
