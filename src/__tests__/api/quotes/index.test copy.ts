import { GET } from '../../../../app/api/quotes/route';
import * as db from '@/utils/db';
import { Quote } from '@/models/Quote';

jest.mock('@/utils/db');
jest.mock('@/models/Quote');

describe('GET /api/quotes/', () => {
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
 
     const response = await GET();
     const body = await response.json();
 
     expect(response.status).toBe(200);
     expect(body).toEqual({
       author: 'Test Author',
       text: 'Test Quote'
     });
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
