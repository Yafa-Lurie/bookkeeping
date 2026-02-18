import request from 'supertest';
import app from '../../../src/app'; // ודא שזה הנתיב הנכון לאובייקט האפליקציה שלך
import mongoose from 'mongoose';
import Expense from '../../../src/models/expense.model';
import Supplier from '../../../src/models/supplier.model';

let supplierId: string;

beforeAll(async () => {
  // התחברות למסד נתונים טסט (למשל In-Memory או MongoTest)
  await mongoose.connect('mongodb://localhost:27017/expense_test');

  // יצירת ספק לבדיקה
  const supplier = new Supplier({ name: 'ספק טסט', email: 'test@supplier.com' });
  const saved = await supplier.save();
supplierId = (saved._id as mongoose.Types.ObjectId).toString();
});

afterAll(async () => {
  await (mongoose.connection.db as any).dropDatabase();
  await mongoose.disconnect();
});

describe('ExpenseController', () => {
  let expenseId: string;

  it('should create a new expense', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .send({
        referenceNumber: 'EXP-001',
        date: '2025-07-15',
        supplier: supplierId,
        category: 'Petty Cash',
        amount: 200,
        vat: 34,
        paymentMethod: 'Cash'
      });

    expect(res.status).toBe(201);
    expect(res.body.referenceNumber).toBe('EXP-001');
    expenseId = res.body._id;
  });

  it('should get all expenses', async () => {
    const res = await request(app).get('/api/expenses');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get an expense by id', async () => {
    const res = await request(app).get(`/api/expenses/${expenseId}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(expenseId);
  });

  it('should update an expense', async () => {
    const res = await request(app)
      .put(`/api/expenses/${expenseId}`)
      .send({ amount: 250 });
    expect(res.status).toBe(200);
    expect(res.body.amount).toBe(250);
  });

  it('should delete an expense', async () => {
    const res = await request(app).delete(`/api/expenses/${expenseId}`);
    expect(res.status).toBe(204);
  });
});
