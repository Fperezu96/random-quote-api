import { connectToDatabase } from '../../../../src/utils/db';
import { Quote } from '../../../../src/models/Quote';
import { NextResponse } from 'next/server';
import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  Pragma: 'no-cache',
  Expires: '0',
};

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
  try {
    noStore();
    await connectToDatabase();

    const [randomQuote] = await Quote.aggregate([
      { $addFields: { r: { $rand: {} } } },
      { $sort: { r: 1 } },
      { $limit: 1 },
    ]);

    if (!randomQuote) {
      return new NextResponse(JSON.stringify({ message: 'No quotes found' }), {
        status: 404,
        headers: {
          ...corsHeaders,
        },
      });
    }
    return new NextResponse(JSON.stringify({ id: randomQuote._id }), {
      status: 200,
      headers: {
        ...corsHeaders,
      },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
    return new NextResponse(JSON.stringify({ message: errorMessage }), {
      status: 500,
      headers: {
        ...corsHeaders,
      },
    });
  }
}
