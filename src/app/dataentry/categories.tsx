'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/shared/components/Button';

interface Category {
  id: number;
  name: string;
  categoryLevel: number;
  displayOrder: number;
  isActive: boolean;
  children?: Category[];
}

const CategoriesManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories?endpoint=tree');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const levelToAdd = selectedParentId === null ? 0 : 1; // Simplified: only allow main and sub
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCategoryName,
          categoryLevel: levelToAdd,
          parentCategoryId: selectedParentId || null,
          isActive: true,
          visibleToVendors: true,
          visibleToCustomers: true,
        }),
      });

      if (response.ok) {
        setNewCategoryName('');
        setSelectedParentId(null);
        setShowAddModal(false);
        loadCategories();
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Delete this category?')) return;

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadCategories();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const renderCategoryTree = (cats: Category[], level = 0) => {
    return (
      <div className="space-y-1">
        {cats.map(cat => (
          <div key={cat.id}>
            <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded group">
              {cat.children && cat.children.length > 0 ? (
                <button
                  onClick={() => toggleExpand(cat.id)}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  {expandedIds.has(cat.id) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronUp className="w-4 h-4" />
                  )}
                </button>
              ) : (
                <div className="w-6" />
              )}

              <div className="flex-1">
                <span className="text-sm font-medium">{cat.name}</span>
                <span className="text-xs text-gray-500 ml-2">
                  ({['Main', 'Sub', 'Micro'][cat.categoryLevel]})
                </span>
              </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => {
                    setSelectedParentId(cat.id);
                    setShowAddModal(true);
                  }}
                  className="p-1 hover:bg-blue-100 rounded text-blue-600"
                  title="Add sub-category"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="p-1 hover:bg-red-100 rounded text-red-600"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {expandedIds.has(cat.id) && cat.children && cat.children.length > 0 && (
              <div className="ml-6 border-l pl-4">
                {renderCategoryTree(cat.children, level + 1)}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Categories Management</h2>
        <Button
          onClick={() => {
            setSelectedParentId(null);
            setShowAddModal(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Main Category
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading categories...</div>
      ) : (
        <div className="border rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
          {categories.length > 0 ? (
            renderCategoryTree(categories)
          ) : (
            <div className="text-center py-8 text-gray-500">No categories yet</div>
          )}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">
              Add {selectedParentId ? 'Sub' : 'Main'} Category
            </h3>
            <input
              type="text"
              placeholder="Category name"
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim()}
                className="flex-1"
              >
                Add
              </Button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesManagement;
