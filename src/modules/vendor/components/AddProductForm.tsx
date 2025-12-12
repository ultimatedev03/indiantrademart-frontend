'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { productAPI, ProductDto, CreateVendorProductDto } from '@/shared/services/productApi';
import { API } from '@/shared/config/api-endpoints';
import { categoryAPI } from '@/shared/services/categoryApi';
import { locationAPI, State, City } from '@/shared/services/locationApi';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { PlusCircle, Upload, X, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface CategoryDTO {
  id: number;
  name: string;
  categoryLevel: number;
  children?: CategoryDTO[];
}

interface AddProductFormProps {
  onSuccess?: (product: any) => void;
  onCancel?: () => void;
}

interface FormData {
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
  images: File[];
}

interface FormErrors {
  sku?: string;
  productName?: string;
  productTitle?: string;
  description?: string;
  shortDescription?: string;
  category?: string;
  subCategory?: string;
  unitPrice?: string;
  mrp?: string;
  stockQuantity?: string;
  minimumOrderQuantity?: string;
  unitOfMeasure?: string;
  hsnCode?: string;
  gstRate?: string;
  primaryImageUrl?: string;
  images?: string;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ onSuccess, onCancel }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [mainCategories, setMainCategories] = useState<CategoryDTO[]>([]);
  const [subCategories, setSubCategories] = useState<CategoryDTO[]>([]);
  const [microCategories, setMicroCategories] = useState<CategoryDTO[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [selectedMainCategory, setSelectedMainCategory] = useState<number>(0);
  const [selectedSubCategory, setSelectedSubCategory] = useState<number>(0);
  const [selectedMicroCategory, setSelectedMicroCategory] = useState<number>(0);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
  // Location selection states - Multi-state with multi-city support
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [selectedStates, setSelectedStates] = useState<Set<number>>(new Set()); // Multi-select states
  const [selectedCitiesByState, setSelectedCitiesByState] = useState<Map<number, Set<number>>>(new Map()); // State -> Cities mapping
  const [currentStateForCities, setCurrentStateForCities] = useState<number>(0); // Currently viewing cities for this state

  const [formData, setFormData] = useState<FormData>({
    sku: '',
    productName: '',
    productTitle: '',
    description: '',
    shortDescription: '',
    category: '',
    subCategory: '',
    unitPrice: 0,
    mrp: 0,
    stockQuantity: 0,
    minimumOrderQuantity: 1,
    unitOfMeasure: 'Piece',
    hsnCode: '',
    gstRate: 0,
    primaryImageUrl: '',
    images: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    loadCategories();
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setLocationsLoading(true);
      console.log('📍 Starting to load states...');
      const statesData = await locationAPI.getStates();
      console.log('📍 States loaded successfully:', statesData);
      console.log(`📍 Total states: ${statesData?.length || 0}`);
      setStates(statesData || []);
    } catch (error: any) {
      console.error('❌ Error loading states:', error);
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setStates([]);
      toast.error('Failed to load locations');
    } finally {
      setLocationsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      console.log('📄 Starting to load category hierarchy...');
      const data = await categoryAPI.getCategoryHierarchy();
      console.log('🔍 Raw category response:', data);
      
      // Ensure data is always an array
      const categories = (Array.isArray(data) ? data : (data as any)?.data || []) as CategoryDTO[];
      console.log('✅ Processed categories:', categories);
      console.log(`📄 Total main categories: ${categories.length}`);
      
      // Log first category structure to debug
      if (categories.length > 0) {
        console.log('🔍 First category structure:', {
          id: categories[0].id,
          name: categories[0].name,
          hasChildren: !!categories[0].children,
          childrenCount: categories[0].children?.length || 0,
          childrenData: categories[0].children
        });
      }
      
      setMainCategories(categories);
    } catch (error: any) {
      console.error('❌ Error loading categories:', error);
      console.error('❌ Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setMainCategories([]);
      toast.error('Failed to load categories');
      setErrors(prev => ({ ...prev, category: 'Failed to load categories' }));
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleMainCategoryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const catId = parseInt(e.target.value);
    console.log('🏷️ Main category selected:', catId);
    setSelectedMainCategory(catId);
    setSelectedSubCategory(0);
    setSelectedMicroCategory(0);
    setSubCategories([]);
    setMicroCategories([]);

    if (catId > 0) {
      // Fetch subcategories from backend API only
      try {
        console.log(`📚 Fetching subcategories for category ${catId}...`);
        const response = await categoryAPI.getSubCategoriesByCategory(catId);
        console.log(`✅ Subcategories fetched:`, response);
        // Convert SubCategory to CategoryDTO format
        const converted = response.map(cat => ({
          id: cat.id,
          name: cat.name,
          categoryLevel: 1,
          description: cat.description,
          children: []
        }));
        setSubCategories(converted as any);
      } catch (error) {
        console.error(`❌ Error fetching subcategories for category ${catId}:`, error);
        // No fallback data - require API to return data
        toast.error('Failed to load subcategories');
        setSubCategories([]);
      }
    }
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const catId = parseInt(e.target.value);
    setSelectedSubCategory(catId);
    setSelectedMicroCategory(0);
    setMicroCategories([]);

    if (catId > 0) {
      const selected = subCategories.find(c => c.id === catId);
      if (selected?.children) {
        setMicroCategories(selected.children);
      }
    }
  };

  const handleMicroCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const catId = parseInt(e.target.value);
    setSelectedMicroCategory(catId);
  };

  const handleStateToggle = async (stateId: number) => {
    const newStates = new Set(selectedStates);
    
    if (newStates.has(stateId)) {
      // Removing state - also remove its cities
      newStates.delete(stateId);
      const newCitiesByState = new Map(selectedCitiesByState);
      newCitiesByState.delete(stateId);
      setSelectedCitiesByState(newCitiesByState);
    } else {
      // Adding state - fetch its cities
      newStates.add(stateId);
      try {
        setLocationsLoading(true);
        console.log(`📍 Fetching cities for state ID: ${stateId}`);
        const citiesData = await locationAPI.getCitiesByState(stateId);
        if (Array.isArray(citiesData) && citiesData.length > 0) {
          console.log(`✅ Loaded ${citiesData.length} cities for state ${stateId}`);
          const newCitiesByState = new Map(selectedCitiesByState);
          newCitiesByState.set(stateId, new Set());
          setSelectedCitiesByState(newCitiesByState);
          setCities(citiesData);
        }
      } catch (error) {
        console.error(`❌ Error loading cities for state ${stateId}:`, error);
        toast.error('Failed to load cities for this state');
        newStates.delete(stateId);
      } finally {
        setLocationsLoading(false);
      }
    }
    
    setSelectedStates(newStates);
    console.log('📍 Selected states:', Array.from(newStates));
  };

  const handleCityToggle = (stateId: number, cityId: number) => {
    const newCitiesByState = new Map(selectedCitiesByState);
    const stateCities = newCitiesByState.get(stateId) || new Set();
    
    if (stateCities.has(cityId)) {
      stateCities.delete(cityId);
    } else {
      stateCities.add(cityId);
    }
    
    if (stateCities.size === 0) {
      newCitiesByState.delete(stateId);
    } else {
      newCitiesByState.set(stateId, stateCities);
    }
    
    setSelectedCitiesByState(newCitiesByState);
    console.log(`🏙️ Cities for state ${stateId}:`, Array.from(stateCities));
  };

  const showCitiesForState = async (stateId: number) => {
    setCurrentStateForCities(stateId);
    if (!cities.length) {
      try {
        setLocationsLoading(true);
        const citiesData = await locationAPI.getCitiesByState(stateId);
        setCities(Array.isArray(citiesData) ? citiesData : []);
      } catch (error) {
        console.error(`❌ Error loading cities:`, error);
      } finally {
        setLocationsLoading(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast.error('Please select only JPEG, PNG, or WebP images');
      return;
    }

    const totalImages = selectedImages.length + files.length;
    if (totalImages > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    setSelectedImages(prev => [...prev, ...files]);

    files.forEach(file => {
      const url = URL.createObjectURL(file);
      setPreviewUrls(prev => [...prev, url]);
    });

    if (errors.images) {
      setErrors(prev => ({ ...prev, images: '' }));
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      const newUrls = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index]);
      return newUrls;
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    // Check if required data is still loading
    if (categoriesLoading) {
      newErrors.category = 'Categories are still loading. Please wait...';
    }

    // Validate all required fields
    if (!formData.sku?.trim()) {
      newErrors.sku = 'SKU is required';
    }
    if (!formData.productName?.trim()) {
      newErrors.productName = 'Product name is required';
    }
    if (!formData.productTitle?.trim()) {
      newErrors.productTitle = 'Product title is required';
    }
    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.shortDescription?.trim()) {
      newErrors.shortDescription = 'Short description is required';
    }
    if (!formData.category?.trim()) {
      newErrors.category = 'Category is required';
    }
    if (!formData.subCategory?.trim()) {
      newErrors.subCategory = 'Subcategory is required';
    }
    if (!formData.unitPrice || formData.unitPrice <= 0) {
      newErrors.unitPrice = 'Unit price must be greater than 0';
    }
    if (!formData.mrp || formData.mrp <= 0) {
      newErrors.mrp = 'MRP must be greater than 0';
    }
    if (formData.stockQuantity < 0) {
      newErrors.stockQuantity = 'Stock quantity cannot be negative';
    }
    if (!formData.minimumOrderQuantity || formData.minimumOrderQuantity < 1) {
      newErrors.minimumOrderQuantity = 'Minimum order quantity must be at least 1';
    }
    if (!formData.unitOfMeasure?.trim()) {
      newErrors.unitOfMeasure = 'Unit of measure is required';
    }
    if (!formData.hsnCode?.trim()) {
      newErrors.hsnCode = 'HSN code is required';
    }
    if (formData.gstRate < 0) {
      newErrors.gstRate = 'GST rate cannot be negative';
    }
    if (!formData.primaryImageUrl?.trim()) {
      newErrors.primaryImageUrl = 'Primary image URL is required';
    }
    if (selectedImages.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // TODO: Wire vendorId from auth state (user.id)
      // For now, using user.id if available or add fallback
      const vendorId = user?.id ? parseInt(user.id) : undefined;
      if (!vendorId) {
        throw new Error('Unable to determine vendor ID. Please ensure you are logged in as a vendor.');
      }

      // Build the canonical CreateVendorProductDto
      const payload: CreateVendorProductDto = {
        vendorId,
        sku: formData.sku,
        productName: formData.productName,
        productTitle: formData.productTitle,
        description: formData.description,
        shortDescription: formData.shortDescription,
        category: formData.category,
        subCategory: formData.subCategory,
        unitPrice: Number(formData.unitPrice),
        mrp: Number(formData.mrp),
        stockQuantity: Number(formData.stockQuantity),
        minimumOrderQuantity: Number(formData.minimumOrderQuantity),
        unitOfMeasure: formData.unitOfMeasure,
        hsnCode: formData.hsnCode,
        gstRate: Number(formData.gstRate),
        primaryImageUrl: formData.primaryImageUrl,
      };

      console.log('📝 Creating vendor product with payload:', payload);
      const result = await productAPI.createVendorProduct(payload);
      console.log('✅ Vendor product created successfully:', result);

      toast.success('Product created successfully!');
      
      // TODO: Upload images if needed (may be handled separately by backend)
      // For now, leaving image upload logic for future implementation
      
      // Reset form
      setFormData({
        sku: '',
        productName: '',
        productTitle: '',
        description: '',
        shortDescription: '',
        category: '',
        subCategory: '',
        unitPrice: 0,
        mrp: 0,
        stockQuantity: 0,
        minimumOrderQuantity: 1,
        unitOfMeasure: 'Piece',
        hsnCode: '',
        gstRate: 0,
        primaryImageUrl: '',
        images: [],
      });
      setSelectedMainCategory(0);
      setSelectedSubCategory(0);
      setSelectedMicroCategory(0);
      setSubCategories([]);
      setMicroCategories([]);
      setErrors({});
      setSelectedImages([]);
      setPreviewUrls([]);
      setSelectedStates(new Set());
      setSelectedCitiesByState(new Map());
      setCurrentStateForCities(0);
      setCities([]);
      
      onSuccess?.(result);
    } catch (error: any) {
      console.error('❌ Error creating vendor product:', error);
      const errorMessage = error.message || 'Failed to create product';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

      {/* SKU */}
      <div>
        <label className="block text-sm font-medium mb-2">SKU *</label>
        <Input
          type="text"
          name="sku"
          value={formData.sku}
          onChange={handleInputChange}
          placeholder="Enter unique SKU (e.g., TEST-SKU-001)"
          required
          className={errors.sku ? 'border-red-500' : ''}
        />
        {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
      </div>

      {/* Product Name */}
      <div>
        <label className="block text-sm font-medium mb-2">Product Name *</label>
        <Input
          type="text"
          name="productName"
          value={formData.productName}
          onChange={handleInputChange}
          placeholder="Enter product name"
          required
          className={errors.productName ? 'border-red-500' : ''}
        />
        {errors.productName && <p className="text-red-500 text-sm mt-1">{errors.productName}</p>}
      </div>

      {/* Product Title */}
      <div>
        <label className="block text-sm font-medium mb-2">Product Title *</label>
        <Input
          type="text"
          name="productTitle"
          value={formData.productTitle}
          onChange={handleInputChange}
          placeholder="Enter product title for display"
          required
          className={errors.productTitle ? 'border-red-500' : ''}
        />
        {errors.productTitle && <p className="text-red-500 text-sm mt-1">{errors.productTitle}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-2">Description *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter full product description"
          rows={4}
          required
          className={`w-full px-3 py-2 border rounded ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      {/* Short Description */}
      <div>
        <label className="block text-sm font-medium mb-2">Short Description *</label>
        <textarea
          name="shortDescription"
          value={formData.shortDescription}
          onChange={handleInputChange}
          placeholder="Enter short description (for listings)"
          rows={2}
          required
          className={`w-full px-3 py-2 border rounded ${errors.shortDescription ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.shortDescription && <p className="text-red-500 text-sm mt-1">{errors.shortDescription}</p>}
      </div>

      {/* Category and Subcategory */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Category *</label>
          <Input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            placeholder="e.g., Electronics"
            required
            className={errors.category ? 'border-red-500' : ''}
          />
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Subcategory *</label>
          <Input
            type="text"
            name="subCategory"
            value={formData.subCategory}
            onChange={handleInputChange}
            placeholder="e.g., Mobile Accessories"
            required
            className={errors.subCategory ? 'border-red-500' : ''}
          />
          {errors.subCategory && <p className="text-red-500 text-sm mt-1">{errors.subCategory}</p>}
        </div>
      </div>

      {/* Unit Price and MRP */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Unit Price (₹) *</label>
          <Input
            type="number"
            name="unitPrice"
            value={formData.unitPrice || ''}
            onChange={handleInputChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
            className={errors.unitPrice ? 'border-red-500' : ''}
          />
          {errors.unitPrice && <p className="text-red-500 text-sm mt-1">{errors.unitPrice}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">MRP (₹) *</label>
          <Input
            type="number"
            name="mrp"
            value={formData.mrp || ''}
            onChange={handleInputChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
            className={errors.mrp ? 'border-red-500' : ''}
          />
          {errors.mrp && <p className="text-red-500 text-sm mt-1">{errors.mrp}</p>}
        </div>
      </div>

      {/* Stock Quantity and Min Order */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Stock Quantity *</label>
          <Input
            type="number"
            name="stockQuantity"
            value={formData.stockQuantity || ''}
            onChange={handleInputChange}
            placeholder="0"
            min="0"
            required
            className={errors.stockQuantity ? 'border-red-500' : ''}
          />
          {errors.stockQuantity && <p className="text-red-500 text-sm mt-1">{errors.stockQuantity}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Min Order Quantity *</label>
          <Input
            type="number"
            name="minimumOrderQuantity"
            value={formData.minimumOrderQuantity || ''}
            onChange={handleInputChange}
            placeholder="1"
            min="1"
            required
            className={errors.minimumOrderQuantity ? 'border-red-500' : ''}
          />
          {errors.minimumOrderQuantity && <p className="text-red-500 text-sm mt-1">{errors.minimumOrderQuantity}</p>}
        </div>
      </div>

      {/* Service Locations - Multi-State Multi-City */}
      <div className="border rounded-lg p-4 bg-blue-50">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
          <span>📍</span> Service Locations <span className="text-xs font-normal text-gray-500">(Optional)</span>
        </h3>
        <p className="text-sm text-gray-600 mb-4">Select states and cities where you provide service for this product</p>
        
        {/* States Checkboxes */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3">Step 1: Select States ({selectedStates.size} selected)</label>
          {states.length === 0 && !locationsLoading && (
            <p className="text-yellow-600 text-sm mb-4">No states available</p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-40 overflow-y-auto border border-gray-300 p-3 rounded bg-white">
            {states.map(state => (
              <label
                key={state.id || state.name}
                className="flex items-center gap-2 p-2 rounded hover:bg-blue-100 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedStates.has(state.id || 0)}
                  onChange={() => handleStateToggle(state.id || 0)}
                  disabled={locationsLoading}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-gray-700 font-medium">{state.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Cities Selection by State */}
        {selectedStates.size > 0 && (
          <div>
            <label className="block text-sm font-medium mb-3">Step 2: Select Cities for Each State</label>
            <div className="space-y-4 max-h-64 overflow-y-auto border border-gray-300 rounded bg-white p-3">
              {Array.from(selectedStates).map(stateId => {
                const stateName = states.find(s => (s.id || 0) === stateId)?.name || `State ${stateId}`;
                const stateCities = selectedCitiesByState.get(stateId) || new Set();
                
                return (
                  <div key={stateId} className="pb-4 border-b last:border-b-0">
                    <button
                      type="button"
                      onClick={() => showCitiesForState(stateId)}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-2"
                    >
                      📌 {stateName} ({stateCities.size} cities selected)
                    </button>
                    
                    {currentStateForCities === stateId && cities.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-blue-50 p-2 rounded">
                        {cities.map(city => (
                          <label
                            key={city.id || city.name}
                            className="flex items-center gap-2 p-2 rounded hover:bg-blue-200 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={stateCities.has(city.id || 0)}
                              onChange={() => handleCityToggle(stateId, city.id || 0)}
                              className="w-4 h-4 rounded"
                            />
                            <span className="text-xs text-gray-700">{city.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Summary */}
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-sm text-gray-700 font-medium">📍 Service Coverage:</p>
              <div className="mt-2 text-xs text-gray-600">
                {Array.from(selectedStates).map(stateId => {
                  const stateName = states.find(s => (s.id || 0) === stateId)?.name || `State ${stateId}`;
                  const stateCities = selectedCitiesByState.get(stateId) || new Set();
                  const cityCount = stateCities.size;
                  return (
                    <div key={stateId} className="flex items-center gap-2 py-1">
                      <span>✓</span>
                      <span><strong>{stateName}</strong> - {cityCount} cit{cityCount === 1 ? 'y' : 'ies'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">Product Images *</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="mx-auto mb-2 text-gray-400" size={24} />
          <label className="cursor-pointer">
            <span className="text-blue-600 hover:text-blue-800">Click to upload</span> or drag and drop
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageSelect}
              className="hidden"
            />
          </label>
          <p className="text-xs text-gray-500 mt-2">PNG, JPG, WebP up to 5MB each (max 5 images)</p>
        </div>

        {selectedImages.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img src={url} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute inset-0 bg-black bg-opacity-50 rounded opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {errors.images && <p className="text-red-500 text-sm mt-2">{errors.images}</p>}
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading || categoriesLoading}
          className="flex items-center gap-2"
          title={categoriesLoading ? 'Waiting for categories to load...' : ''}
        >
          <PlusCircle size={18} />
          {loading ? 'Adding...' : categoriesLoading ? 'Loading...' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
};

export default AddProductForm;
