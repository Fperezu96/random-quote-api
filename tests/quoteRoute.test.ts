import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app'; 
import QuoteModel from '../src/models/Quote';

jest.mock('../src/models/Quote');
const mockedQuote = QuoteModel as jest.Mocked<typeof QuoteModel>;

describe('Quote Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/quotes', () => {
    it('should return all quotes', async () => {
      const mockQuotes = [
        { _id: '1', quote: 'Quote 1', author: 'Author 1' },
        { _id: '2', quote: 'Quote 2', author: 'Author 2' },
      ];
      mockedQuote.find.mockResolvedValue(mockQuotes as any);

      const res = await request(app).get('/api/quotes');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([
          { quote: 'Quote 1', author: 'Author 1' },
          { quote: 'Quote 2', author: 'Author 2' }
        ]);
    });

    it('should return 500 on DB error', async () => {
      mockedQuote.find.mockRejectedValue(new Error('DB error'));

      const res = await request(app).get('/api/quotes');

      expect(res.status).toBe(500);
      // TSOA error responses don't include a message body by default
    });
  });

  describe('GET /api/quotes/ids', () => {
    it('should return all quote IDs', async () => {
      const mockIds = [{ _id: '1' }, { _id: '2' }];
      mockedQuote.find.mockResolvedValue(mockIds as any);

      const res = await request(app).get('/api/quotes/ids');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(['1', '2']); // Controller returns array of strings
    });

    it('should return 500 on DB error', async () => {
      mockedQuote.find.mockRejectedValue(new Error('DB error'));

      const res = await request(app).get('/api/quotes/ids');

      expect(res.status).toBe(500);
    });
  });

  describe('GET /api/quotes/:id', () => {
    it('should return 400 for invalid ID', async () => {
      const res = await request(app).get('/api/quotes/invalid-id');

      expect(res.status).toBe(400); 
    });

    it('should return 404 if quote not found', async () => {
      const id = new mongoose.Types.ObjectId().toString();
      mockedQuote.findById.mockResolvedValue(null);
      const res = await request(app).get(`/api/quotes/${id}`);
      expect(res.status).toBe(404);
    });

    it('should return quote by ID if found', async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const mockQuote = { _id: new mongoose.Types.ObjectId(id), quote: 'Quote', author: 'Author' };
      mockedQuote.findById.mockResolvedValue(mockQuote as any);

      const res = await request(app).get(`/api/quotes/${id}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ author: 'Author', quote: 'Quote'});
    });

    it('should return 500 on DB error', async () => {
      const id = new mongoose.Types.ObjectId().toString();
      mockedQuote.findById.mockRejectedValue(new Error('DB error'));

      const res = await request(app).get(`/api/quotes/${id}`);

      expect(res.status).toBe(500);
    });
  });
});
