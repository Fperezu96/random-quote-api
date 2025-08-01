import { connectToDatabase } from '../../../../src/utils/db';
import { Quote } from '../../../../src/models/Quote';
import { NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function GET() {
  try {
    await connectToDatabase();

    const [randomQuote] = await Quote.aggregate([{ $sample: { size: 1 } }]);

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
