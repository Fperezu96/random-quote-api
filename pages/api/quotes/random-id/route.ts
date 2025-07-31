import { connectToDatabase } from '../../../../src/utils/db';
import { Quote } from '../../../../src/models/Quote';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();

    const [randomQuote] = await Quote.aggregate([{ $sample: { size: 1 } }]);

    if (!randomQuote) {
      return NextResponse.json({ message: 'No quotes found' }, { status: 404 });
    }

    return NextResponse.json({ id: randomQuote._id });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}