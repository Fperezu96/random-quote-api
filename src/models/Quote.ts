// File: src/models/Quote.ts
import { Schema, model, Document } from 'mongoose';

// Plain interface for tsoa - no mongoose types
export interface Quote {
  _id?: string;
  quote: string;
  author: string;
}

// Mongoose document interface for internal use
export interface IQuoteDocument extends Document {
  quote: string;
  author: string;
}

export class QuoteResponse {
  quote!: string;
  author!: string;
}

const quoteSchema = new Schema<IQuoteDocument>({
  quote: { type: String, required: true },
  author: { type: String, required: true },
});

export default model<IQuoteDocument>('Quote', quoteSchema);
