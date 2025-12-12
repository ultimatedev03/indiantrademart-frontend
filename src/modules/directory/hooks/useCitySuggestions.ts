/**
 * useCitySuggestions Hook
 * 
 * Fetches city suggestions for a given state using the location API.
 * Handles data fetching, loading states, and error handling.
 */

import { useState, useEffect } from 'react';
import { api } from '@/shared/services/api';
import { API } from '@/shared/config/api-endpoints';

export interface CitySuggestion {
  name: string;              // canonical city name e.g. "Noida"
  displayName: string;       // for UI
  isCurrent: boolean;        // true if this is the current city
  providerCount?: number;    // optional provider count
}

interface UseCitySuggestionsReturn {
  citySuggestions: CitySuggestion[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Fetch city suggestions for a given state.
 * 
 * @param stateName - Name of the state (e.g., "Bihar", "Uttar Pradesh")
 * @param cityName - Current city name (will be marked as current in suggestions)
 * @returns Object containing citySuggestions array, isLoading flag, and error message
 * 
 * Usage:
 * const { citySuggestions, isLoading, error } = useCitySuggestions("Bihar", "Patna");
 */
export function useCitySuggestions(
  stateName: string | null,
  cityName: string | null
): UseCitySuggestionsReturn {
  const [citySuggestions, setCitySuggestions] = useState<CitySuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!stateName) {
      setCitySuggestions([]);
      setError(null);
      return;
    }

    const fetchCities = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Normalize state name (Title Case-ish) and trim
        const normalizedState = stateName.trim();
        const endpoint = API.public.locations.citiesByStateName(normalizedState);
        const response = await api.get<any[]>(endpoint);
        
        const raw = Array.isArray(response.data) ? response.data : [];
        
        // Map backend payload to CitySuggestion shape
        let cities: CitySuggestion[] = raw.map((item) => {
          const canonical = (item.name || item.cityName || '').toString();
          return {
            name: canonical,
            displayName: canonical,
            isCurrent: !!cityName && canonical.toLowerCase() === cityName.toLowerCase(),
            providerCount: typeof item.count === 'number' ? item.count : undefined,
          };
        });

        // If API returns empty or fails to include current city, ensure current city exists in list
        if (cityName && !cities.some(c => c.name.toLowerCase() === cityName.toLowerCase())) {
          cities.unshift({
            name: cityName,
            displayName: cityName,
            isCurrent: true,
          });
        }

        // Sort: current city first, then by providerCount desc
        cities.sort((a, b) => {
          if (a.isCurrent && !b.isCurrent) return -1;
          if (!a.isCurrent && b.isCurrent) return 1;
          return (b.providerCount || 0) - (a.providerCount || 0);
        });

        setCitySuggestions(cities);
      } catch (err: any) {
        console.warn('Failed to fetch city suggestions for state:', stateName, err);
        // Even on failure, show at least the current city so UI stays stable
        if (cityName) {
          setCitySuggestions([{ name: cityName, displayName: cityName, isCurrent: true }]);
        } else {
          setCitySuggestions([]);
        }
        setError(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
  }, [stateName, cityName]);

  return {
    citySuggestions,
    isLoading,
    error,
  };
}
