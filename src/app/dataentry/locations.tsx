'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/shared/components/Button';

interface Location {
  id: number;
  state: string;
  city: string;
  pincode?: string;
  isActive: boolean;
}

const LocationsManagement: React.FC = () => {
  const [locations, setLocations] = useState<{ [state: string]: Location[] }>({});
  const [loading, setLoading] = useState(false);
  const [expandedStates, setExpandedStates] = useState<Set<string>>(new Set());
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState<'state' | 'city'>('state');
  const [newState, setNewState] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newPincode, setNewPincode] = useState('');
  const [selectedState, setSelectedState] = useState('');

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/public/locations/states');
      const data: Location[] = await response.json();
      
      // Group by state
      const grouped: { [state: string]: Location[] } = {};
      data.forEach(loc => {
        if (!grouped[loc.state]) {
          grouped[loc.state] = [];
        }
        grouped[loc.state].push(loc);
      });
      setLocations(grouped);
    } catch (error) {
      console.error('Error loading locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpandState = (state: string) => {
    const newExpanded = new Set(expandedStates);
    if (newExpanded.has(state)) {
      newExpanded.delete(state);
    } else {
      newExpanded.add(state);
    }
    setExpandedStates(newExpanded);
  };

  const handleAddLocation = async () => {
    if (modalType === 'state' && !newState.trim()) return;
    if (modalType === 'city' && (!newCity.trim() || !selectedState)) return;

    try {
      // For simplicity, we'll just refresh from backend
      // In production, you'd send this to an API endpoint
      if (modalType === 'state') {
        // Add state logic - would need new API endpoint
        console.log('Adding state:', newState);
      } else {
        // Add city logic - would need new API endpoint
        console.log('Adding city to state:', selectedState, newCity);
      }
      
      setNewState('');
      setNewCity('');
      setNewPincode('');
      setShowAddModal(false);
      loadLocations();
    } catch (error) {
      console.error('Error adding location:', error);
    }
  };

  const handleDeleteCity = async (locationId: number) => {
    if (!confirm('Delete this city?')) return;

    try {
      // Would need DELETE endpoint
      console.log('Deleting location:', locationId);
      loadLocations();
    } catch (error) {
      console.error('Error deleting location:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Locations Management</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setModalType('state');
              setShowAddModal(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add State
          </Button>
          {selectedState && (
            <Button
              onClick={() => {
                setModalType('city');
                setShowAddModal(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add City
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading locations...</div>
      ) : (
        <div className="border rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
          {Object.keys(locations).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(locations).map(([state, cities]) => (
                <div key={state}>
                  <div
                    onClick={() => toggleExpandState(state)}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer font-semibold"
                  >
                    {expandedStates.has(state) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronUp className="w-4 h-4" />
                    )}
                    <span>{state}</span>
                    <span className="text-xs text-gray-500">({cities.length} cities)</span>
                  </div>

                  {expandedStates.has(state) && (
                    <div className="ml-6 space-y-1 border-l pl-4">
                      {cities.map(city => (
                        <div
                          key={city.id}
                          className="flex items-center justify-between p-2 hover:bg-gray-100 rounded text-sm"
                        >
                          <div>
                            <span>{city.city}</span>
                            {city.pincode && (
                              <span className="text-xs text-gray-500 ml-2">{city.pincode}</span>
                            )}
                          </div>
                          <button
                            onClick={() => handleDeleteCity(city.id)}
                            className="p-1 hover:bg-red-100 rounded text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No locations yet</div>
          )}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">
              Add {modalType === 'state' ? 'State' : 'City'}
            </h3>

            {modalType === 'state' ? (
              <input
                type="text"
                placeholder="State name"
                value={newState}
                onChange={e => setNewState(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            ) : (
              <>
                <select
                  value={selectedState}
                  onChange={e => setSelectedState(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select state</option>
                  {Object.keys(locations).map(state => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="City name"
                  value={newCity}
                  onChange={e => setNewCity(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <input
                  type="text"
                  placeholder="Pincode (optional)"
                  value={newPincode}
                  onChange={e => setNewPincode(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleAddLocation}
                disabled={
                  modalType === 'state'
                    ? !newState.trim()
                    : !newCity.trim() || !selectedState
                }
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

export default LocationsManagement;
