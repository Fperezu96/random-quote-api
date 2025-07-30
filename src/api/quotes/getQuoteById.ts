import { QuoteController } from '../../controllers/QuoteController';
import { connectToDatabase } from '../../utils/db'; 
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;

  try {
    await connectToDatabase();
    const controller = new QuoteController();
    const quote = await controller.getQuoteById(id);
    return NextResponse.json(quote, { status: 200 });
  } catch (error: any) {
    const status = error.status || 500;
    return NextResponse.json({ message: error.message }, { status });
  }
}