import { connectToDatabase } from '../../../../src/utils/db';
import { Quote } from '../../../../src/models/Quote';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(_req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  try {
    // Handle missing or empty ID
    if (!id) {
      return NextResponse.json({ message: 'ID parameter is required' }, { status: 400 });
    }

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ID format' }, { status: 400 });
    }

    await connectToDatabase();
    const quote = await Quote.findById(id).lean();
    const cleanedQuote = quote!.map(({ author, quote }) => ({ author, quote }));

    if (!quote) {
      return NextResponse.json({ message: 'Quote not found' }, { status: 404 });
    }

    // Return only author and quote
    return NextResponse.json(cleanedQuote);

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}
