import { connectToDatabase } from '../../../../src/utils/db';
import { Quote } from '../../../../src/models/Quote';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json'
};

export async function GET(
  _req: NextRequest,
  context: { params: { id: string } },
) {
  const { id } = context.params;

  try {
    // Handle missing or empty ID
    if (!id) {
      return new NextResponse(
        JSON.stringify({ message: 'ID parameter is required' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
          },
        },
      );
    }
    // Validate MongoDB ObjectId format BEFORE converting
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid ID format' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
          },
        },
      );
    }

    const objectId = new mongoose.Types.ObjectId(id);

    await connectToDatabase();

    const filteredQuote = await Quote.findById(objectId);

    if (!filteredQuote) {
      return new NextResponse(JSON.stringify({ message: 'Quote not found' }), {
        status: 404,
        headers: {
          ...corsHeaders,
        },
      });
    }

    const { author, quote } = filteredQuote;
    return new NextResponse(JSON.stringify({ author, quote }), {
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
