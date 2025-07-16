import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Income from '../../../src/models/income.model'; // ודא שהנתיב נכון

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
  await Income.deleteMany({});
});

describe('Income Model', () => {
  it('should create and save a valid income', async () => {
    const income = new Income({
      receiptNumber: 'RCPT001',
      date: new Date(),
      client: new mongoose.Types.ObjectId(),
      amount: 5000,
      vat: 850,
      paymentMethod: 'Credit',
      paymentDetails: {
        last4Digits: '9876',
        installments: 3
      },
      details: 'Monthly payment',
      printDate: new Date(),
      document: 'receipt.pdf'
    });

    const saved = await income.save();

    expect(saved._id).toBeDefined();
    expect(saved.receiptNumber).toBe('RCPT001');
    expect(saved.paymentDetails?.last4Digits).toBe('9876');
  });

  it('should fail if required fields are missing', async () => {
    const income = new Income({});

    let err;
    try {
      await income.save();
    } catch (error: any) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.receiptNumber).toBeDefined();
    expect(err.errors.date).toBeDefined();
    expect(err.errors.amount).toBeDefined();
    expect(err.errors.vat).toBeDefined();
    expect(err.errors.paymentMethod).toBeDefined();
  });

  it('should reject invalid enum values for paymentMethod', async () => {
    const income = new Income({
      receiptNumber: 'RCPT002',
      date: new Date(),
      amount: 1000,
      vat: 170,
      paymentMethod: 'Paypal' // לא חוקי
    });

    await expect(income.save()).rejects.toThrow(/`paymentMethod` is invalid/i);
  });

  it('should allow optional fields to be missing', async () => {
    const income = new Income({
      receiptNumber: 'RCPT003',
      date: new Date(),
      amount: 3000,
      vat: 510,
      paymentMethod: 'Cash'
    });

    const saved = await income.save();

    expect(saved.details).toBeUndefined();
    expect(saved.client).toBeUndefined();
    expect(saved.paymentDetails).toBeUndefined();
    expect(saved.document).toBeUndefined();
  });
});
