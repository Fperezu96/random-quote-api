import { Controller, Get, Path, Route, Tags, Response, SuccessResponse } from 'tsoa';
import QuoteModel, { Quote, QuoteResponse } from '../models/Quote';
import mongoose from 'mongoose';
import logger from '../utils/logger';
import { ValidationError, NotFoundError, DatabaseError, ErrorResponse, ValidationErrorResponse } from '../utils/errorHandler';
@Route('quotes')
@Tags('Quotes')
export class QuoteController extends Controller {
  
  @Get('/')
  @SuccessResponse("200", "Successfully retrieved all quotes")
  @Response<ErrorResponse>("500", "Internal Server Error", {
    message: "Failed to retrieve quotes from database",
    details: "An unexpected error occurred while fetching quotes"
  })
  public async getAllQuotes(): Promise<QuoteResponse[]> {
    try {
      const quotes = await QuoteModel.find();
      return quotes.map(quote => ({
        quote: quote.quote,
        author: quote.author
      }));
    } catch (err) {
      logger.error(`Error fetching quotes: ${(err as Error).message}`);
      throw new DatabaseError(
        "Failed to retrieve quotes from database",
        (err as Error).message
      );
    }
  }

  @Get('/ids')
  @SuccessResponse("200", "Successfully retrieved all quote IDs")
  @Response<ErrorResponse>("500", "Internal Server Error", {
    message: "Failed to retrieve quote IDs from database",
    details: "An unexpected error occurred while fetching quote IDs"
  })
  public async getAllQuoteIds(): Promise<string[]> {
    try {
      const ids = await QuoteModel.find({}, '_id');
      return ids.map(doc => doc._id.toString());
    } catch (err) {
      logger.error(`Error fetching quote IDs: ${(err as Error).message}`);
      throw new DatabaseError(
        "Failed to retrieve quote IDs from database",
        (err as Error).message
      );
    }
  }

  @Get('/:id')
  @SuccessResponse("200", "Successfully retrieved quote")
  @Response<ValidationErrorResponse>("400", "Invalid ID Format", {
    message: "The provided ID is not a valid MongoDB ObjectId",
    field: "id"
  })
  @Response<ErrorResponse>("404", "Quote Not Found", {
    message: "No quote found with the specified ID"
  })
  @Response<ErrorResponse>("500", "Internal Server Error", {
    message: "Failed to retrieve quote from database",
    details: "An unexpected error occurred while fetching the quote"
  })
  public async getQuoteById(@Path() id: string): Promise<QuoteResponse> {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ValidationError(
          "The provided ID is not a valid MongoDB ObjectId",
          "id"
        );
      }

      const quote = await QuoteModel.findById(id);

      if (!quote) {
        logger.warn(`Quote with ID ${id} not found`);
        throw new NotFoundError("No quote found with the specified ID");
      }

      return {
        quote: quote.quote,
        author: quote.author
      };
    } catch (err) {
      // If it's already a custom error, re-throw it
      if (err instanceof ValidationError || err instanceof NotFoundError || err instanceof DatabaseError) {
        throw err;
      }
      
      logger.error(`Error fetching quote by ID: ${(err as Error).message}`);
      throw new DatabaseError(
        "Failed to retrieve quote from database",
        (err as Error).message
      );
    }
  }
}
