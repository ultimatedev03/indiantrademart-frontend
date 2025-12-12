import { api } from './api';

export interface State {
  id?: number;
  name: string;
  code?: string;
}

export interface City {
  id?: number;
  name: string;
  stateId?: number;
  stateName?: string;
  code?: string;
}

export interface Location {
  id?: number;
  state: string;
  city: string;
  stateId?: number;
  cityId?: number;
}

// Location API functions
export const locationAPI = {
  // Get all states
  getStates: async (): Promise<State[]> => {
    try {
      console.log('📍 Fetching states...');
      const response = await api.get('/api/public/locations/states');
      console.log('✅ States fetched successfully:', response.data);
      
      // Handle different response formats
      // Backend returns: {success: true, states: ["..."], count: 22}
      let states = response.data?.states || response.data?.data || response.data || [];
      
      // Convert string array to State objects
      if (Array.isArray(states) && states.length > 0 && typeof states[0] === 'string') {
        return states.map((name: string, index: number) => ({
          id: index + 1,
          name: name,
          code: name.substring(0, 2).toUpperCase()
        }));
      }
      
      return Array.isArray(states) ? states : [];
    } catch (error: any) {
      console.error('❌ Error fetching states:', error?.response?.data || error?.message);
      return [];
    }
  },

  // Get cities by state
  getCitiesByState: async (stateId: number): Promise<City[]> => {
    try {
      console.log(`📍 Fetching cities for state ${stateId}...`);
      const response = await api.get(`/api/public/locations/states/${stateId}/cities`);
      console.log(`✅ Cities fetched for state ${stateId}:`, response.data);
      
      // Backend returns: {cities: Array<string>, stateName, count, success, stateId}
      const citiesArray = response.data?.cities || response.data?.data || [];
      console.log(`✅ Extracted cities array:`, citiesArray);
      
      // Convert string array to City objects if needed
      if (Array.isArray(citiesArray)) {
        if (citiesArray.length > 0 && typeof citiesArray[0] === 'string') {
          return citiesArray.map((name: string, index: number) => ({
            id: index + 1,
            name: name,
            stateId: stateId
          }));
        }
        return citiesArray;
      }
      
      return [];
    } catch (error: any) {
      console.error(`❌ Error fetching cities for state ${stateId}:`, error?.response?.data || error?.message);
      return [];
    }
  },

  // Get all cities
  getAllCities: async (): Promise<City[]> => {
    try {
      console.log('📍 Fetching all cities...');
      const response = await api.get('/api/public/locations/cities');
      console.log('✅ All cities fetched successfully:', response.data);
      
      // Handle different response formats
      const data = response.data?.data || response.data || [];
      return Array.isArray(data) ? data : [];
    } catch (error: any) {
      console.error('❌ Error fetching all cities:', error?.response?.data || error?.message);
      return [];
    }
  },

  // Search cities by name
  searchCities: async (query: string): Promise<City[]> => {
    try {
      console.log(`📍 Searching cities for: ${query}...`);
      const response = await api.get('/api/public/locations/cities/search', {
        params: { query }
      });
      console.log(`✅ Cities search results for "${query}":`, response.data);
      
      // Handle different response formats
      const data = response.data?.data || response.data || [];
      return Array.isArray(data) ? data : [];
    } catch (error: any) {
      console.error(`❌ Error searching cities for "${query}":`, error?.response?.data || error?.message);
      return [];
    }
  }
};
