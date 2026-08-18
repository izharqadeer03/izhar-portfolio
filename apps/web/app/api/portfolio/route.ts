import { fetchAllPortfolioData } from '@izhar-os/database';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await fetchAllPortfolioData();
    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Failed to fetch full portfolio data:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch portfolio bundle' },
      { status: 500 },
    );
  }
}
