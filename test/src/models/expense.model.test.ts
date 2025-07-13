import ExpenseController from '../../../src/controllers/expense.controller';
import Expense from '../../../src/models/expense.model';
import { Request, Response } from 'express';

jest.mock('../models/expense.model');

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe('ExpenseController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createExpense', () => {
    it('should create an expense and return 201', async () => {
      const req = { body: { name: 'Lunch', amount: 20 } } as Request;
      const saveMock = jest.fn().mockResolvedValue(req.body);
      (Expense as any).mockImplementation(() => ({ save: saveMock }));
      const res = mockResponse();

      await ExpenseController.createExpense(req, res);

      expect(saveMock).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(req.body);
    });

    it('should handle errors and return 400', async () => {
      const req = { body: {} } as Request;
      const saveMock = jest.fn().mockRejectedValue(new Error('Validation error'));
      (Expense as any).mockImplementation(() => ({ save: saveMock }));
      const res = mockResponse();

      await ExpenseController.createExpense(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Validation error' });
    });
  });

  describe('getAllExpenses', () => {
    it('should return all expenses with 200', async () => {
      const expenses = [{ name: 'Lunch', amount: 20 }];
      (Expense.find as jest.Mock).mockResolvedValue(expenses);
      const req = {} as Request;
      const res = mockResponse();

      await ExpenseController.getAllExpenses(req, res);

      expect(Expense.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expenses);
    });

    it('should handle errors and return 500', async () => {
      (Expense.find as jest.Mock).mockRejectedValue(new Error('DB error'));
      const req = {} as Request;
      const res = mockResponse();

      await ExpenseController.getAllExpenses(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
    });
  });

  describe('getExpenseById', () => {
    it('should return expense by id with 200', async () => {
      const expense = { _id: '1', name: 'Lunch', amount: 20 };
      (Expense.findById as jest.Mock).mockResolvedValue(expense);
      const req = { params: { id: '1' } } as unknown as Request;
      const res = mockResponse();

      await ExpenseController.getExpenseById(req, res);

      expect(Expense.findById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expense);
    });

    it('should return 404 if expense not found', async () => {
      (Expense.findById as jest.Mock).mockResolvedValue(null);
      const req = { params: { id: '1' } } as unknown as Request;
      const res = mockResponse();

      await ExpenseController.getExpenseById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('Expense not found');
    });

    it('should handle errors and return 500', async () => {
      (Expense.findById as jest.Mock).mockRejectedValue(new Error('DB error'));
      const req = { params: { id: '1' } } as unknown as Request;
      const res = mockResponse();

      await ExpenseController.getExpenseById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'DB error' });
    });
  });

  describe('updateExpense', () => {
    it('should update expense and return 200', async () => {
      const updatedExpense = { _id: '1', name: 'Dinner', amount: 30 };
      (Expense.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedExpense);
      const req = { params: { id: '1' }, body: { name: 'Dinner', amount: 30 } } as unknown as Request;
      const res = mockResponse();

      await ExpenseController.updateExpense(req, res);

      expect(Expense.findByIdAndUpdate).toHaveBeenCalledWith('1', req.body, { new: true });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedExpense);
    });

    it('should return 404 if expense not found', async () => {
      (Expense.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
      const req = { params: { id: '1' }, body: {} } as unknown as Request;
      const res = mockResponse();

      await ExpenseController.updateExpense(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('Expense not found');
    });

    it('should handle errors and return 400', async () => {
      (Expense.findByIdAndUpdate as jest.Mock).mockRejectedValue(new Error('Update error'));
      const req = { params: { id: '1' }, body: {} } as unknown as Request;
      const res = mockResponse();

      await ExpenseController.updateExpense(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Update error' });
    });
  });

  describe('deleteExpense', () => {
    it('should delete expense and return 204', async () => {
      (Expense.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: '1' });
      const req = { params: { id: '1' } } as unknown as Request;
      const res = mockResponse();

      await ExpenseController.deleteExpense(req, res);

      expect(Expense.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should return 404 if expense not found', async () => {
      (Expense.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
      const req = { params: { id: '1' } } as unknown as Request;
      const res = mockResponse();

      await ExpenseController.deleteExpense(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith('Expense not found');
    });

    it('should handle errors and return 500', async () => {
      (Expense.findByIdAndDelete as jest.Mock).mockRejectedValue(new Error('Delete error'));
      const req = { params: { id: '1' } } as unknown as Request;
      const res = mockResponse();

      await ExpenseController.deleteExpense(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Delete error' });
    });
  });
});