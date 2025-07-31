import { GET } from '../../app/api/quotes/[id]/route';
import { NextRequest } from 'next/server';
import * as db from '../../utils/db';
import { Quote } from '../../models/Quote';
import mongoose from 'mongoose';

jest.mock('../../../../src/utils/db');
jest.mock('../../../../src/models/Quote');

describe('GET /api/quotes/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and the quote', async () => {
    (db.connectToDatabase as jest.Mock).mockResolvedValue(true);
    (Quote.findById as jest.Mock).mockResolvedValue(
        { _id: '1', author: 'Random Author', quote: 'Random Quote' }
    )

    const context = { params: { id: new mongoose.Types.ObjectId().toHexString() } };
    const response = await GET({} as NextRequest, context);
    const body = await response.json();
    console.log('Response body:', body);
    expect(response.status).toBe(200);
    expect(body).toEqual({
      author: 'Random Author',
      quote: 'Random Quote'
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
    const context = { params: { id: new mongoose.Types.ObjectId().toHexString() } };
    const response = await GET({} as NextRequest, context);
    expect(response.status).toBe(404);
  });

  it('should return 400 if ID format is invalid', async () => {
  const context = { params: { id: '12345' } };
  const response = await GET({} as NextRequest, context);
  const body = await response.json();
  expect(response.status).toBe(400);
  expect(body.message).toBe('Invalid ID format');
});

it('should return 500 if an unexpected error occurs', async () => {
  const validId = new mongoose.Types.ObjectId().toHexString();
  (Quote.findById as jest.Mock).mockRejectedValue(new Error('Database failure'));
  const context = { params: { id: validId } };
  const response = await GET({} as NextRequest, context);
  const body = await response.json();

  expect(response.status).toBe(500);
  expect(body.message).toBe('Database failure');
});
});
