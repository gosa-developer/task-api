import request from 'supertest';
import app from '../../src/index';

describe('Tasks Integration', () => {
  it('should return 401 for unauthorized access', async () => {
    const response = await request(app).get('/tasks');
    expect(response.status).toBe(401);
  });
});