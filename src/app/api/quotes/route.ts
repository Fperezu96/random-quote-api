import { connectToDatabase } from '../../../utils/db';
import { Quote } from '../../../models/Quote';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectToDatabase();
  const quotes = await Quote.find().lean();
  const cleanedQuotes = quotes.map(({ author, quote }) => ({ author, quote }));
  return NextResponse.json(cleanedQuotes);
}
