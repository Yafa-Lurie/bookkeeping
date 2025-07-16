import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Expense from '../../../src/models/expense.model';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Expense.deleteMany({});
});

describe('Expense Model', () => {
  it('should create and save a valid expense', async () => {
    const expense = new Expense({
      referenceNumber: 'EXP123',
      date: new Date(),
      supplier: new mongoose.Types.ObjectId(),
      category: 'Furniture',
      amount: 1000,
      vat: 170,
      paymentMethod: 'Credit',
      paymentDetails: {
        last4Digits: '1234',
        installments: 3
      },
      document: 'receipt.pdf'
    });

    const savedExpense = await expense.save();

    expect(savedExpense._id).toBeDefined();
    expect(savedExpense.referenceNumber).toBe('EXP123');
    expect(savedExpense.paymentDetails?.last4Digits).toBe('1234');
  });

  it('should fail without required fields', async () => {
    const expense = new Expense({});

    let err;
    try {
      await expense.save();
    } catch (error: any) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.referenceNumber).toBeDefined();
    expect(err.errors.date).toBeDefined();
    expect(err.errors.supplier).toBeDefined();
    expect(err.errors.category).toBeDefined();
    expect(err.errors.amount).toBeDefined();
    expect(err.errors.vat).toBeDefined();
    expect(err.errors.paymentMethod).toBeDefined();
  });

  it('should reject invalid enum values for category', async () => {
    const expense = new Expense({
      referenceNumber: 'EXP999',
      date: new Date(),
      supplier: new mongoose.Types.ObjectId(),
      category: 'InvalidCategory', // לא חוקי
      amount: 500,
      vat: 85,
      paymentMethod: 'Cash'
    });

    await expect(expense.save()).rejects.toThrow(/`category` is invalid/i);
  });

  it('should reject invalid enum values for paymentMethod', async () => {
    const expense = new Expense({
      referenceNumber: 'EXP1000',
      date: new Date(),
      supplier: new mongoose.Types.ObjectId(),
      category: 'Cleaning',
      amount: 300,
      vat: 51,
      paymentMethod: 'Bitcoin' // לא חוקי
    });

    await expect(expense.save()).rejects.toThrow(/`paymentMethod` is invalid/i);
  });

  it('should allow optional paymentDetails fields to be missing', async () => {
    const expense = new Expense({
      referenceNumber: 'EXP2000',
      date: new Date(),
      supplier: new mongoose.Types.ObjectId(),
      category: 'Salary',
      amount: 8000,
      vat: 1360,
      paymentMethod: 'Bank Transfer'
    });

    const saved = await expense.save();

    expect(saved.paymentDetails).toBeUndefined();
  });
});
