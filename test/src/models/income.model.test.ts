
import mongoose from 'mongoose';
import Income from '../../../src/models/income.model';

describe('Income Model', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/bookkeeping_test', { useNewUrlParser: true, useUnifiedTopology: true } as any);
  });

  afterAll(async () => {
    await (mongoose.connection.db as any).dropDatabase();
    await mongoose.disconnect();
  });

  it('should create and save an income', async () => {
    const income = new Income({ amount: 1000, source: 'Job', date: new Date(), description: 'Salary' });
    const saved = await income.save();
    expect(saved._id).toBeDefined();
    expect(saved.amount).toBe(1000);
    expect(saved.details).toBe('Job');
  });

  it('should require amount field', async () => {
    const income = new Income({ source: 'Gift', date: new Date() });
    let err;
    try {
      await income.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
  });
});
