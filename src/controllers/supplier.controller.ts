// src/controllers/supplier.controller.ts
import { Request, Response } from 'express';
import Supplier from '../models/supplier.model';

class SupplierController {
  static async createSupplier(req: Request, res: Response): Promise<void> {
    try {
      const supplier = await Supplier.create(req.body);
      res.status(201).json(supplier);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getAllSuppliers(req: Request, res: Response): Promise<void> {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  }

  static async getSupplierById(req: Request, res: Response): Promise<void> {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      res.status(404).send('Not found');
    } else {
      res.json(supplier);
    }
  }

  static async updateSupplier(req: Request, res: Response): Promise<void> {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!supplier) {
      res.status(404).send('Not found');
    } else {
      res.json(supplier);
    }
  }

  static async deleteSupplier(req: Request, res: Response): Promise<void> {
    await Supplier.findByIdAndDelete(req.params.id);
    res.status(204).send();
  }
}

export default SupplierController;
