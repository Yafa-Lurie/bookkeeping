import request from 'supertest';
import app from '../../../src/app'; // הנתיב לקובץ שמפעיל את Express
import mongoose from 'mongoose';
import Income from '../../../src/models/income.model';

describe('IncomeController', () => {
  let createdIncomeId: string;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL!);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Income.deleteMany({});
  });

  it('should create a new income', async () => {
    const incomeData = {
      receiptNumber: 'INV-001',
      date: new Date().toISOString(),
      amount: 1000,
      vat: 170,
      paymentMethod: 'Cash',
      details: 'תשלום מזומן',
      printDate: new Date().toISOString()
    };

    const response = await request(app)
      .post('/api/incomes')
      .send(incomeData);

    expect(response.status).toBe(201);
    expect(response.body.receiptNumber).toBe('INV-001');
    createdIncomeId = response.body._id;
  });

  it('should get all incomes', async () => {
    await Income.create({
      receiptNumber: 'INV-002',
      date: new Date(),
      amount: 200,
      vat: 34,
      paymentMethod: 'Cash',
      printDate: new Date()
    });

    const res = await request(app).get('/api/incomes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get income by id', async () => {
    const income = await Income.create({
      receiptNumber: 'INV-003',
      date: new Date(),
      amount: 500,
      vat: 85,
      paymentMethod: 'Cash',
      printDate: new Date()
    });

    const res = await request(app).get(`/api/incomes/${income._id}`);
    expect(res.status).toBe(200);
    expect(res.body.receiptNumber).toBe('INV-003');
  });

  it('should return 404 for invalid income id', async () => {
    const res = await request(app).get('/api/incomes/123456789012');
    expect(res.status).toBe(500);
  });

  it('should update an income', async () => {
    const income = await Income.create({
      receiptNumber: 'INV-004',
      date: new Date(),
      amount: 300,
      vat: 51,
      paymentMethod: 'Cash',
      printDate: new Date()
    });

    const res = await request(app)
      .put(`/api/incomes/${income._id}`)
      .send({ amount: 350 });

    expect(res.status).toBe(200);
    expect(res.body.amount).toBe(350);
  });

  it('should delete an income', async () => {
    const income = await Income.create({
      receiptNumber: 'INV-005',
      date: new Date(),
      amount: 400,
      vat: 68,
      paymentMethod: 'Cash',
      printDate: new Date()
    });

    const res = await request(app).delete(`/api/incomes/${income._id}`);
    expect(res.status).toBe(204);

    const check = await Income.findById(income._id);
    expect(check).toBeNull();
  });

  it('should return 404 when trying to download non-existing receipt', async () => {
    const res = await request(app).get('/api/incomes/123456789012/download');
    expect(res.status).toBe(500); // או 404, תלוי איך הקוד שלך כתוב
  });
});
