import { GET } from '../../../../app/api/quotes/random-id/route';
import * as db from '@/utils/db';
import { Quote } from '@/models/Quote';

jest.mock('@/utils/db');
jest.mock('@/models/Quote');

describe('GET /api/quotes/random-id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and a random quote ID', async () => {
    (db.connectToDatabase as jest.Mock).mockResolvedValue(true);
    (Quote.find as jest.Mock).mockResolvedValue([
      { _id: '1' },
      { _id: '2' },
      { _id: '3' }
    ]);

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(['1', '2', '3']).toContain(body.id);
  });

  it('should return 500 if DB fails', async () => {
    (db.connectToDatabase as jest.Mock).mockResolvedValue(true);
    (Quote.find as jest.Mock).mockRejectedValue(new Error('fail'));

    const res = await GET();
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.message).toBe('fail');
  });
});
