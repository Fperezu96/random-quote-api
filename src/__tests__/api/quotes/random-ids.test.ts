import { GET } from '../../../app/api/quotes/random-id/route';
import { Quote } from '../../../models/Quote';

jest.mock('../../../utils/db');
jest.mock('../../../models/Quote');

describe('GET /api/quotes/random', () => {
  it('should return a random quote ID', async () => {
    const mockQuote = { _id: '123abc' };
    (Quote.aggregate as jest.Mock).mockResolvedValue([mockQuote]);
    const response = await GET();
    const body = await response.json();
    expect(response.status).toBe(200);
    expect(body).toEqual({ id: mockQuote._id });
  });

  it('should return 404 if no quotes found', async () => {
    (Quote.aggregate as jest.Mock).mockResolvedValue([]);
    const response = await GET();
    const body = await response.json();
    expect(response.status).toBe(404);
    expect(body.message).toBe('No quotes found');
  });

  it('should return 500 on error', async () => {
    (Quote.aggregate as jest.Mock).mockRejectedValue(new Error('DB crashed'));
    const response = await GET();
    const body = await response.json();
    expect(response.status).toBe(500);
    expect(body.message).toBe('DB crashed');
  });

  it('should return 500 if an unexpected error occurs', async () => {
    (Quote.aggregate as jest.Mock).mockRejectedValue(new Error('Unexpected error'));
    const response = await GET();
    const body = await response.json();
    expect(response.status).toBe(500);
    expect(body.message).toBe('Unexpected error');
  });
});

