
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../../src/app';
import Income from '../../../src/models/income.model';

describe('IncomeController', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/bookkeeping_test', { useNewUrlParser: true, useUnifiedTopology: true } as any);
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await Income.deleteMany({});
  });

  it('should create a new income', async () => {
    const res = await request(app)
      .post('/api/incomes')
      .send({ amount: 100, source: 'Job', date: new Date(), description: 'Salary' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.amount).toBe(100);
  });

  it('should get all incomes', async () => {
    await Income.create({ amount: 200, source: 'Gift', date: new Date(), description: 'Birthday' });
    const res = await request(app).get('/api/incomes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get income by id', async () => {
    const income = await Income.create({ amount: 300, source: 'Freelance', date: new Date(), description: 'Project' });
    const res = await request(app).get(`/api/incomes/${income._id}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(income._id.toString());
  });

  it('should update an income', async () => {
    const income = await Income.create({ amount: 400, source: 'Bonus', date: new Date(), description: 'Yearly' });
    const res = await request(app)
      .put(`/api/incomes/${income._id}`)
      .send({ amount: 450 });
    expect(res.status).toBe(200);
    expect(res.body.amount).toBe(450);
  });

  it('should delete an income', async () => {
    const income = await Income.create({ amount: 500, source: 'Investment', date: new Date(), description: 'Stocks' });
    const res = await request(app).delete(`/api/incomes/${income._id}`);
    expect(res.status).toBe(204);
    const found = await Income.findById(income._id);
    expect(found).toBeNull();
  });
});
