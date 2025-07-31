import { connectToDatabase } from '../../../../utils/db';
import { Quote } from '../../../../models/Quote';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(_req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  try {
    // Handle missing or empty ID
    if (!id) {
      return NextResponse.json({ message: 'ID parameter is required' }, { status: 400 });
    }

    // Validate MongoDB ObjectId format BEFORE converting
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: 'Invalid ID format' }, { status: 400 });
    } 

    const objectId = new mongoose.Types.ObjectId(id);
    
    await connectToDatabase();

    const filteredQuote = await Quote.findById(objectId);

    if (!filteredQuote) {
      return NextResponse.json({ message: 'Quote not found' }, { status: 404 });
    }

    const { author, quote } = filteredQuote;
    return NextResponse.json({ author, quote });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}
