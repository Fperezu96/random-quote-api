import mongoose, { Schema, Document, models } from 'mongoose';

export interface IQuote extends Document {
  author: string;
  quote: string;
}

const QuoteSchema = new Schema<IQuote>({
  author: { type: String, required: true },
  quote: { type: String, required: true }
});

export const Quote = models.Quote || mongoose.model<IQuote>('Quote', QuoteSchema);
