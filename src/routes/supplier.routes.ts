// src/routes/supplier.routes.ts
import express from 'express';
import SupplierController from '../controllers/supplier.controller';

const router = express.Router();

router.post('/', SupplierController.createSupplier);
router.get('/', SupplierController.getAllSuppliers);
router.get('/:id', SupplierController.getSupplierById);
router.put('/:id', SupplierController.updateSupplier);
router.delete('/:id', SupplierController.deleteSupplier);

export default router;
