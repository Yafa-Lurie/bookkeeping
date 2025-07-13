
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../../src/app';
import Expense from '../../../src/models/expense.model';

describe('Expense Routes', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/bookkeeping_test', { useNewUrlParser: true, useUnifiedTopology: true } as any);
  });

  afterAll(async () => {
    await (mongoose.connection.db as any).dropDatabase();
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await Expense.deleteMany({});
  });

  it('POST /api/expenses - should create expense', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .send({ amount: 99, category: 'Test', date: new Date(), description: 'Test expense' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.amount).toBe(99);
  });

  it('GET /api/expenses - should return all expenses', async () => {
    await Expense.create({ amount: 10, category: 'Food', date: new Date(), description: 'Lunch' });
    const res = await request(app).get('/api/expenses');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /api/expenses/:id - should return expense by id', async () => {
    const expense = await Expense.create({ amount: 20, category: 'Travel', date: new Date(), description: 'Bus' });
    const res = await request(app).get(`/api/expenses/${expense._id}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe((expense._id as any).toString());
  });

  it('PUT /api/expenses/:id - should update expense', async () => {
    const expense = await Expense.create({ amount: 30, category: 'Bills', date: new Date(), description: 'Electricity' });
    const res = await request(app)
      .put(`/api/expenses/${expense._id}`)
      .send({ amount: 35 });
    expect(res.status).toBe(200);
    expect(res.body.amount).toBe(35);
  });

  it('DELETE /api/expenses/:id - should delete expense', async () => {
    const expense = await Expense.create({ amount: 40, category: 'Fun', date: new Date(), description: 'Movie' });
    const res = await request(app).delete(`/api/expenses/${expense._id}`);
    expect(res.status).toBe(204);
    const found = await Expense.findById(expense._id);
    expect(found).toBeNull();
  });
});
