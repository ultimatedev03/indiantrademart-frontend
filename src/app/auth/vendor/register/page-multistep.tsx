'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { register, verifyOtp, clearError, setTempCredentials } from '@/features/auth/authSlice';
import { RootState, AppDispatch } from '@/store';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { locationAPI } from '@/shared/services/locationApi';
import { toast } from 'react-hot-toast';
import AuthRedirect from '@/modules/core/components/AuthRedirect';

type Step = 'BASIC' | 'KYC' | 'OTP';

export default function VendorRegisterPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error, otpSent } = useSelector((state: RootState) => state.auth);

  const [step, setStep] = useState<Step>('BASIC');
  const [states, setStates] = useState<any[]>([]);
  const [filteredCities, setFilteredCities] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'vendor',
    panCard: '',
    businessName: '',
    businessAddress: '',
    city: '',
    state: '',
    pincode: '',
    gstNumber: '',
  });

  const [kycDocuments, setKycDocuments] = useState({
    panCardFile: null as File | null,
    gstCertificate: null as File | null,
    businessRegistration: null as File | null,
    bankStatement: null as File | null,
  });

  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [otpCode, setOtpCode] = useState('');

  // Load states
  useEffect(() => {
    const loadStates = async () => {
      try {
        const statesData = await locationAPI.getStates();
        if (statesData && statesData.length > 0) {
          setStates(statesData.map(state => typeof state === 'string' ? state : state.name || ''));
        }
      } catch (error) {
        console.error('Failed to load states:', error);
      }
    };
    loadStates();
  }, []);

  // Load cities when state changes
  useEffect(() => {
    const loadCities = async () => {
      if (formData.state) {
        try {
          const stateObj = states.find(s => (typeof s === 'string' ? s : s.name) === formData.state);
          if (stateObj) {
            const stateId = typeof stateObj === 'string' ? 1 : stateObj.id || 1;
            const citiesData = await locationAPI.getCitiesByState(stateId as number);
            if (citiesData && citiesData.length > 0) {
              setFilteredCities(citiesData.map(city => typeof city === 'string' ? city : city.name || ''));
            }
          }
        } catch (error) {
          console.error(`Failed to load cities for ${formData.state}:`, error);
          setFilteredCities([]);
        }
      } else {
        setFilteredCities([]);
      }
    };
    loadCities();
  }, [formData.state, states]);

  const validateBasicDetails = () => {
    const errors: {[key: string]: string} = {};

    if (!formData.name.trim()) errors.name = 'Name is required';
    else if (!/^[a-zA-Z\s]+$/.test(formData.name)) errors.name = 'Name should contain only alphabets';

    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Please enter a valid email';

    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(formData.phone)) errors.phone = 'Phone must be 10 digits';
    else if (formData.phone.startsWith('0')) errors.phone = 'Phone should not start with 0';

    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) 
      errors.password = 'Password must contain uppercase, lowercase, number, and special character';

    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';

    if (!formData.businessName.trim()) errors.businessName = 'Business name is required';
    if (!formData.businessAddress.trim()) errors.businessAddress = 'Business address is required';
    if (!formData.state) errors.state = 'State is required';
    if (!formData.city) errors.city = 'City is required';
    if (!formData.pincode.trim()) errors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(formData.pincode)) errors.pincode = 'Pincode must be 6 digits';

    if (formData.panCard && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panCard))
      errors.panCard = 'Invalid PAN format';

    if (formData.gstNumber && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstNumber))
      errors.gstNumber = 'Invalid GST format';

    return errors;
  };

  const handleBasicDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateBasicDetails();
    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) return;

    // Call register endpoint
    const registerData: any = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      userType: 'vendor',
      role: 'vendor',
      panNumber: formData.panCard,
      gstNumber: formData.gstNumber,
      businessName: formData.businessName,
      businessAddress: formData.businessAddress,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
    };

    const result = await dispatch(register(registerData));

    if (register.fulfilled.match(result)) {
      dispatch(setTempCredentials({
        emailOrPhone: formData.email,
        password: formData.password,
      }));
      toast.success('Registration successful! Proceeding to KYC.');
      setStep('KYC');
    } else {
      toast.error(error || 'Registration failed');
    }
  };

  const handleKycSkip = () => {
    // Skip KYC and go to OTP
    toast.success('KYC skipped. Proceeding to OTP verification.');
    setStep('OTP');
  };

  const handleKycSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement KYC document upload to POST /api/v1/vendor-kyc/documents
    // For now, skip to OTP
    toast.success('KYC uploaded (placeholder). Proceeding to OTP verification.');
    setStep('OTP');
  };

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(verifyOtp({
      emailOrPhone: formData.email,
      otp: otpCode,
    }));

    if (verifyOtp.fulfilled.match(result)) {
      toast.success('Email verified successfully!');
      setTimeout(() => {
        router.push('/dashboard/vendor-panel');
      }, 1000);
    } else {
      toast.error(error || 'OTP verification failed');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'state') {
      setFormData(prev => ({ ...prev, state: value, city: '' }));
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.state;
        delete newErrors.city;
        return newErrors;
      });
      return;
    }

    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  React.useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  return (
    <>
      <AuthRedirect />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Step 1: Basic Details */}
          {step === 'BASIC' && (
            <>
              <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                  Create Vendor Account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                  Step 1 of 3: Basic Details
                </p>
              </div>
              <form className="mt-8 space-y-6" onSubmit={handleBasicDetailsSubmit}>
                <div className="space-y-4">
                  <div>
                    <Input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      required
                      className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.name ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                    />
                    {validationErrors.name && <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>}
                  </div>

                  <div>
                    <Input
                      name="businessName"
                      type="text"
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="Business Name"
                      required
                      className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.businessName ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                    />
                    {validationErrors.businessName && <p className="mt-1 text-sm text-red-600">{validationErrors.businessName}</p>}
                  </div>

                  <div>
                    <Input
                      name="businessAddress"
                      type="text"
                      value={formData.businessAddress}
                      onChange={handleChange}
                      placeholder="Business Address"
                      required
                      className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.businessAddress ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                    />
                    {validationErrors.businessAddress && <p className="mt-1 text-sm text-red-600">{validationErrors.businessAddress}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.state ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                      >
                        <option value="">State</option>
                        {states.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                      {validationErrors.state && <p className="mt-1 text-sm text-red-600">{validationErrors.state}</p>}
                    </div>
                    <div>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        disabled={!formData.state}
                        className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.city ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm disabled:bg-gray-100`}
                      >
                        <option value="">City</option>
                        {filteredCities.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                      {validationErrors.city && <p className="mt-1 text-sm text-red-600">{validationErrors.city}</p>}
                    </div>
                  </div>

                  <div>
                    <Input
                      name="pincode"
                      type="text"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="Pincode (6 digits)"
                      required
                      maxLength={6}
                      className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.pincode ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                    />
                    {validationErrors.pincode && <p className="mt-1 text-sm text-red-600">{validationErrors.pincode}</p>}
                  </div>

                  <div>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      required
                      className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.email ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                    />
                    {validationErrors.email && <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>}
                  </div>

                  <div>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone Number (10 digits)"
                      required
                      maxLength={10}
                      className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.phone ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                    />
                    {validationErrors.phone && <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>}
                  </div>

                  <div>
                    <Input
                      name="panCard"
                      type="text"
                      value={formData.panCard}
                      onChange={handleChange}
                      placeholder="PAN (Optional)"
                      maxLength={10}
                      style={{ textTransform: 'uppercase' }}
                      className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.panCard ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                    />
                    {validationErrors.panCard && <p className="mt-1 text-sm text-red-600">{validationErrors.panCard}</p>}
                  </div>

                  <div>
                    <Input
                      name="gstNumber"
                      type="text"
                      value={formData.gstNumber}
                      onChange={handleChange}
                      placeholder="GST Number (Optional)"
                      style={{ textTransform: 'uppercase' }}
                      className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.gstNumber ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                    />
                    {validationErrors.gstNumber && <p className="mt-1 text-sm text-red-600">{validationErrors.gstNumber}</p>}
                  </div>

                  <div>
                    <Input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password (strong)"
                      required
                      className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.password ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                    />
                    {validationErrors.password && <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>}
                  </div>

                  <div>
                    <Input
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      required
                      className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                    />
                    {validationErrors.confirmPassword && <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>}
                  </div>
                </div>

                {error && <div className="text-red-600 text-sm text-center">{error}</div>}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {loading ? 'Processing...' : 'Continue to KYC'}
                </Button>

                <p className="text-sm text-gray-600 text-center">
                  Already have an account?{' '}
                  <a href="/auth/vendor/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Sign in
                  </a>
                </p>
              </form>
            </>
          )}

          {/* Step 2: KYC Documents */}
          {step === 'KYC' && (
            <>
              <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                  KYC Documents
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                  Step 2 of 3: Upload documents
                </p>
              </div>
              <form className="mt-8 space-y-6" onSubmit={handleKycSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PAN Card</label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setKycDocuments({ ...kycDocuments, panCardFile: e.target.files?.[0] || null })}
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer"
                    />
                    {kycDocuments.panCardFile && <p className="mt-1 text-xs text-green-600">✓ {kycDocuments.panCardFile.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GST Certificate</label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setKycDocuments({ ...kycDocuments, gstCertificate: e.target.files?.[0] || null })}
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer"
                    />
                    {kycDocuments.gstCertificate && <p className="mt-1 text-xs text-green-600">✓ {kycDocuments.gstCertificate.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Registration</label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setKycDocuments({ ...kycDocuments, businessRegistration: e.target.files?.[0] || null })}
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer"
                    />
                    {kycDocuments.businessRegistration && <p className="mt-1 text-xs text-green-600">✓ {kycDocuments.businessRegistration.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank Statement</label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setKycDocuments({ ...kycDocuments, bankStatement: e.target.files?.[0] || null })}
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer"
                    />
                    {kycDocuments.bankStatement && <p className="mt-1 text-xs text-green-600">✓ {kycDocuments.bankStatement.name}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    {loading ? 'Uploading...' : 'Continue to OTP'}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleKycSkip}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Skip for Now
                  </Button>
                </div>
              </form>
            </>
          )}

          {/* Step 3: OTP Verification */}
          {step === 'OTP' && (
            <>
              <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                  Verify Email
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                  Step 3 of 3: Enter OTP sent to {formData.email}
                </p>
              </div>
              <form className="mt-8 space-y-6" onSubmit={handleOtpVerification}>
                <div>
                  <Input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter OTP"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  />
                </div>
                {error && <div className="text-red-600 text-sm text-center">{error}</div>}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  {loading ? 'Verifying...' : 'Verify & Complete'}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
