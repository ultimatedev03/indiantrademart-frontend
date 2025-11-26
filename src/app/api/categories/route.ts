import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

/**
 * GET /api/categories/tree - Get full 3-level hierarchy
 * GET /api/categories/roots - Get root categories only
 * GET /api/categories/{id}/children - Get children of a category
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint') || 'tree';
    const parentId = searchParams.get('parentId');

    let url = `${BACKEND_URL}/api/public/categories/${endpoint}`;

    if (endpoint === 'children' && parentId) {
      url = `${BACKEND_URL}/api/public/categories/${parentId}/children`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Backend error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Category API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
