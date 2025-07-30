import { GET } from '../../../../app/api/quotes/[id]/route';
import { NextRequest } from 'next/server';
import * as db from '@/utils/db';
import { Quote } from '@/models/Quote';

jest.mock('@/utils/db');
jest.mock('@/models/Quote');

describe('GET /api/quotes/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and the quote', async () => {
    (db.connectToDatabase as jest.Mock).mockResolvedValue(true);
    (Quote.findById as jest.Mock).mockResolvedValue({
      _id: '123',
      author: 'Test Author',
      text: 'Test Quote'
    });

    const context = { params: { id: '123' } };
    const response = await GET({} as NextRequest, context);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      author: 'Test Author',
      text: 'Test Quote'
    });
  });

  it('should return 400 if id is missing', async () => {
    const context = { params: { id: '' } };
    const response = await GET({} as NextRequest, context);
    expect(response.status).toBe(400);
  });

  it('should return 404 if quote is not found', async () => {
    (db.connectToDatabase as jest.Mock).mockResolvedValue(true);
    (Quote.findById as jest.Mock).mockResolvedValue(null);

    const context = { params: { id: '999' } };
    const response = await GET({} as NextRequest, context);
    expect(response.status).toBe(404);
  });
});
