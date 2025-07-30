import { QuoteController } from '../src/controllers/QuoteController';
import QuoteModel from '../src/models/Quote';
import mongoose from 'mongoose';
import { ValidationError, NotFoundError, DatabaseError } from '../src/utils/errorHandler';

jest.mock('../src/models/Quote');
const mockedQuote = QuoteModel as jest.Mocked<typeof QuoteModel>;

describe('QuoteController', () => {
  let controller: QuoteController;

  beforeEach(() => {
    controller = new QuoteController();
    jest.clearAllMocks();
  });

  describe('getAllQuotes', () => {
    it('should return all quotes', async () => {
      const mockQuotes = [
        { _id: new mongoose.Types.ObjectId(), quote: 'Quote 1', author: 'Author 1' },
        { _id: new mongoose.Types.ObjectId(), quote: 'Quote 2', author: 'Author 2' },
      ];
      mockedQuote.find.mockResolvedValue(mockQuotes as any);

      const result = await controller.getAllQuotes();

      expect(mockedQuote.find).toHaveBeenCalledWith();
      expect(result).toEqual([
        { quote: 'Quote 1', author: 'Author 1' },
        { quote: 'Quote 2', author: 'Author 2' },
      ]);
    });

    it('should throw error on DB error', async () => {
      mockedQuote.find.mockRejectedValue(new Error('DB Error'));

      await expect(controller.getAllQuotes()).rejects.toThrow(DatabaseError);
      await expect(controller.getAllQuotes()).rejects.toMatchObject({
        message: 'Failed to retrieve quotes from database',
        details: 'DB Error'
      });
    });
  });

  describe('getAllQuoteIds', () => {
    it('should return all quote IDs', async () => {
      const mockIds = [{ _id: '1' }, { _id: '2' }];
      mockedQuote.find.mockResolvedValue(mockIds as any);

      const result = await controller.getAllQuoteIds();

      expect(mockedQuote.find).toHaveBeenCalledWith({}, '_id');
      expect(result).toEqual(['1', '2']);
    });

    it('should throw error on DB error', async () => {
      mockedQuote.find.mockRejectedValue(new Error('DB Error'));

      await expect(controller.getAllQuoteIds()).rejects.toThrow(DatabaseError);
      await expect(controller.getAllQuoteIds()).rejects.toMatchObject({
        message: 'Failed to retrieve quote IDs from database',
        details: 'DB Error'
      });
    });
  });

  describe('getQuoteById', () => {
    it('should throw error for invalid ID', async () => {
      await expect(controller.getQuoteById('invalid-id')).rejects.toThrow(ValidationError);
      await expect(controller.getQuoteById('invalid-id')).rejects.toMatchObject({
        message: 'The provided ID is not a valid MongoDB ObjectId',
        field: 'id'
      });
    });

    it('should throw error if quote not found', async () => {
      const validId = new mongoose.Types.ObjectId().toString();
      mockedQuote.findById.mockResolvedValue(null);

      await expect(controller.getQuoteById(validId)).rejects.toThrow(NotFoundError);
      await expect(controller.getQuoteById(validId)).rejects.toMatchObject({
        message: 'No quote found with the specified ID'
      });
    });

    it('should return quote by ID if found', async () => {
      const validId = new mongoose.Types.ObjectId().toString();
      const mockQuote = { quote: 'Test quote', author: 'Test Author' };
      mockedQuote.findById.mockResolvedValue(mockQuote as any);

      const result = await controller.getQuoteById(validId);

      expect(result).toEqual({
        quote: 'Test quote',
        author: 'Test Author'
      });
    });

    it('should throw error on server error', async () => {
      const validId = new mongoose.Types.ObjectId().toString();
      mockedQuote.findById.mockRejectedValue(new Error('DB Error'));

      await expect(controller.getQuoteById(validId)).rejects.toThrow(DatabaseError);
      await expect(controller.getQuoteById(validId)).rejects.toMatchObject({
        message: 'Failed to retrieve quote from database',
        details: 'DB Error'
      });
    });
  });
});
