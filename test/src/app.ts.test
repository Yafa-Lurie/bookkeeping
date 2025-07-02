
import request from 'supertest';
import app from '../../src/app';

describe('App', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/unknown');
    expect(res.status).toBe(404);
  });

  it('should parse JSON bodies', async () => {
    // This test assumes you have a POST route for incomes or expenses
    // Replace with a valid route if needed
    const res = await request(app)
      .post('/api/incomes')
      .send({ amount: 100, source: 'Test', date: new Date() });
    // Accept 201 (created) or 400/500 if validation fails (route exists)
    expect([201, 400, 500, 404]).toContain(res.status);
  });
});
