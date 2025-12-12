'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { productAPI, ProductDto } from '@/shared/services/productApi';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import { Select } from '@/shared/components';
import { PlusCircle, Upload, X, AlertCircle } from 'lucide-react';

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

const AddProductForm: React.FC<AddProductFormProps> = ({ onSuccess, onCancel }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  
  // Category hierarchy state
  const [mainCategories, setMainCategories] = useState<CategoryDTO[]>([]);
  const [subCategories, setSubCategories] = useState<CategoryDTO[]>([]);
  const [microCategories, setMicroCategories] = useState<CategoryDTO[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  
  // Selected categories
  const [selectedMainCategory, setSelectedMainCategory] = useState<number>(0);
  const [selectedSubCategory, setSelectedSubCategory] = useState<number>(0);
  const [selectedMicroCategory, setSelectedMicroCategory] = useState<number>(0);

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<ProductDto, 'id' | 'images' | 'vendorId' | 'createdAt' | 'updatedAt'>>({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    stock: 0,
    categoryId: 0,
    brand: '',
    model: '',
    sku: '',
    minOrderQuantity: 1,
    unit: 'piece',
    specifications: '',
    tags: '',
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    freeShipping: false,
    shippingCharge: 0,
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await fetch('/api/categories?endpoint=tree');
      const data = await response.json();
      setMainCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
      setErrors(prev => ({ ...prev, categories: 'Failed to load categories' }));
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleMainCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const catId = parseInt(e.target.value);
    setSelectedMainCategory(catId);
    setSelectedSubCategory(0);
    setSelectedMicroCategory(0);
    setSubCategories([]);
    setMicroCategories([]);

    if (catId > 0) {
      const selected = mainCategories.find(c => c.id === catId);
      if (selected?.children) {
        setSubCategories(selected.children);
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
    setFormData(prev => ({ ...prev, categoryId: catId }));

    if (errors.categoryId) {
      setErrors(prev => ({ ...prev, categoryId: '' }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : 
              type === 'checkbox' ? (e.target as HTMLInputElement).checked :
              value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      alert('Please select only JPEG, PNG, or WebP images');
      return;
    }

    const totalImages = selectedImages.length + files.length;
    if (totalImages > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    setSelectedImages(prev => [...prev, ...files]);
    files.forEach(file => {
      const url = URL.createObjectURL(file);
      setPreviewUrls(prev => [...prev, url]);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      const newUrls = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index]);
      return newUrls;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.stock < 0) newErrors.stock = 'Stock cannot be negative';
    if (selectedMicroCategory === 0) newErrors.categoryId = 'Please select a category';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setSuccessMessage(null);
    try {
      const dataToSend = {
        ...formData,
        categoryId: selectedMicroCategory,
        price: parseFloat(formData.price.toString()),
        originalPrice: parseFloat((formData.originalPrice || 0).toString()),
        stock: parseInt(formData.stock.toString()),
        minOrderQuantity: parseInt((formData.minOrderQuantity || 1).toString()),
      };

      const product = await productAPI.addProduct(dataToSend);
      const productId = product.id;
      if (selectedImages.length > 0) {
        await productAPI.uploadProductImages(productId, selectedImages);
      }
      setSuccessMessage(`✅ Product created successfully! ID: ${productId}`);
      
      setTimeout(() => {
        onSuccess?.({ ...dataToSend, id: productId });
      }, 1500);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to create product';
      setErrors({ submit: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Add New Product</h1>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {successMessage}
        </div>
      )}

      {errors.submit && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
          <div className="text-red-700">{errors.submit}</div>
        </div>
      )}

      {/* Category Cascade */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Main Category *</label>
          <select
            value={selectedMainCategory}
            onChange={handleMainCategoryChange}
            disabled={categoriesLoading}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={0}>Select main category...</option>
            {mainCategories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Sub Category *</label>
          <select
            value={selectedSubCategory}
            onChange={handleSubCategoryChange}
            disabled={selectedMainCategory === 0 || subCategories.length === 0}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value={0}>Select sub category...</option>
            {subCategories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Micro Category *</label>
          <select
            value={selectedMicroCategory}
            onChange={handleMicroCategoryChange}
            disabled={selectedSubCategory === 0 || microCategories.length === 0}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value={0}>Select micro category...</option>
            {microCategories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
        </div>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Product Name *</label>
          <Input
            type="text"
            name="name"
            placeholder="Enter product name"
            value={formData.name}
            onChange={handleInputChange}
            disabled={loading}
            error={errors.name}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Brand</label>
          <Input
            type="text"
            name="brand"
            placeholder="Enter brand name"
            value={formData.brand}
            onChange={handleInputChange}
            disabled={loading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">SKU</label>
          <Input
            type="text"
            name="sku"
            placeholder="Enter SKU"
            value={formData.sku}
            onChange={handleInputChange}
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Price (₹) *</label>
          <Input
            type="number"
            name="price"
            placeholder="0"
            value={formData.price}
            onChange={handleInputChange}
            disabled={loading}
            error={errors.price}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Original Price (₹)</label>
          <Input
            type="number"
            name="originalPrice"
            placeholder="0"
            value={formData.originalPrice}
            onChange={handleInputChange}
            disabled={loading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Stock *</label>
          <Input
            type="number"
            name="stock"
            placeholder="0"
            value={formData.stock}
            onChange={handleInputChange}
            disabled={loading}
            error={errors.stock}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Min Order Qty</label>
          <Input
            type="number"
            name="minOrderQuantity"
            placeholder="1"
            value={formData.minOrderQuantity}
            onChange={handleInputChange}
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">Unit</label>
          <select
            name="unit"
            value={formData.unit}
            onChange={handleInputChange}
            disabled={loading}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="piece">Piece</option>
            <option value="kg">KG</option>
            <option value="meter">Meter</option>
            <option value="box">Box</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-gray-700">Description *</label>
        <textarea
          name="description"
          placeholder="Enter product description"
          value={formData.description}
          onChange={handleInputChange}
          disabled={loading}
          rows={4}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      {/* Image Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-gray-700">Product Images (Max 5)</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageSelect}
            disabled={loading}
            className="hidden"
            id="image-input"
          />
          <label htmlFor="image-input" className="cursor-pointer text-blue-500 hover:underline">
            Click to upload or drag images
          </label>
        </div>

        {previewUrls.length > 0 && (
          <div className="grid grid-cols-5 gap-2 mt-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative">
                <img src={url} alt={`Preview ${index}`} className="w-full h-20 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={loading || categoriesLoading}
          className="flex items-center gap-2"
        >
          {loading ? 'Creating...' : <>
            <PlusCircle className="w-4 h-4" />
            Add Product
          </>}
        </Button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-2 border rounded-lg text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default AddProductForm;
