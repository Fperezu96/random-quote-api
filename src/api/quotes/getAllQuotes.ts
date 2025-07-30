import { QuoteController } from '../../controllers/QuoteController';
import { connectToDatabase } from '../../utils/db'; 
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectToDatabase();
    const controller = new QuoteController();
    const quotes = await controller.getAllQuotes();
    return NextResponse.json(quotes, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}