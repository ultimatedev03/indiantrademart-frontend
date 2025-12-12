import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export async function GET() {
  try {
    // Fetch states from the backend using public endpoint
    const statesResponse = await fetch(`${API_URL}/api/public/locations/states`, {
      cache: 'no-store'
    });

    if (!statesResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch states from backend' },
        { status: statesResponse.status }
      );
    }

    const statesData = await statesResponse.json();
    
    if (statesData.success && statesData.states) {
      // For each state, fetch its cities
      const locations: Array<{ state: string; city: string }> = [];
      
      for (const state of statesData.states) {
        try {
          const citiesResponse = await fetch(
            `${API_URL}/api/public/locations/cities?state=${encodeURIComponent(state)}`,
            { cache: 'no-store' }
          );
          
          if (citiesResponse.ok) {
            const citiesData = await citiesResponse.json();
            if (citiesData.success && citiesData.cities) {
              citiesData.cities.forEach((city: string) => {
                locations.push({ state, city });
              });
            }
          }
        } catch (error) {
          console.error(`Error fetching cities for state ${state}:`, error);
        }
      }

      return NextResponse.json(locations);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
