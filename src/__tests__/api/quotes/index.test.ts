import { GET } from '../../../../pages/api/quotes/route';
import * as db from '../../../utils/db';
import { Quote } from '../../../models/Quote';

jest.mock('../../../../src/utils/db');
jest.mock('../../../../src/models/Quote');

describe('GET /api/quotes/', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
 
   it('should return 200 and the quote', async () => {
     (db.connectToDatabase as jest.Mock).mockResolvedValue(true);
      (Quote.find as jest.Mock).mockReturnValue({
      lean: jest.fn().mockResolvedValue([
        { _id: '1', author: 'Random Author', quote: 'Random Quote' },
        { _id: '2', author: 'Author 2', quote: 'Quote 2' }
      ])
    });
     
     const response = await GET();
     const body = await response.json();
     console.log(body);
     expect(response.status).toBe(200);
     expect(body).toEqual([
        { author: 'Random Author', quote: 'Random Quote' },
        { author: 'Author 2', quote: 'Quote 2' }
      ]);
   });

   
});
