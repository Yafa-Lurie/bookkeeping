import { Router } from 'express';
import ClientController from '../controllers/client.controller'; // Adjust the import path as necessary

const router = Router();

router.post('/', ClientController.createClient);
router.get('/', ClientController.getClients);
router.get('/:id', ClientController.getClientById);
router.put('/:id', ClientController.updateClient);
router.delete('/:id', ClientController.deleteClient);

export default router;