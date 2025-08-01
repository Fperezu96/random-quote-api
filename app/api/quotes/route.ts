import { connectToDatabase } from '../../../src/utils/db';
import { Quote } from '../../../src/models/Quote';
import { NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function GET() {
  await connectToDatabase();
  const quotes = await Quote.find().lean();
  const cleanedQuotes = quotes.map(({ author, quote }) => ({ author, quote }));
  return new NextResponse(JSON.stringify({ cleanedQuotes}), {
    status: 200,
    headers: {
      ...corsHeaders
    }
  });
}
