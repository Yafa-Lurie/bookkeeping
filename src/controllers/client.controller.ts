import { Request, Response } from 'express';
import Client from '../models/client.model'; // Adjust the import path as necessary

class ClientController {
    // Create a new client
static async createClient(req: Request, res: Response): Promise<void> {
    try {
        const { name, email, phone, address } = req.body;

        // בדיקה אם כבר קיים לקוח עם אותו אימייל
        const existing = await Client.findOne({ email });
        if (existing) {
            res.status(400).json({ message: 'Client already exists with this email' });
            return;
        }

        const newClient = new Client({
            name,
            email,
            phone,
            address,
        });

        await newClient.save();
        res.status(201).json(newClient);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
}

    // Get all clients
    static async getClients(req: Request, res: Response): Promise<void> {
        try {
            const clients = await Client.find();
            res.status(200).json(clients);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get a single client by ID
    static async getClientById(req: Request, res: Response): Promise<void> {
        try {
            const client = await Client.findById(req.params.id);

            if (!client) {
                res.status(404).json({ message: 'Client not found' });
            }

            res.status(200).json(client);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    // Update a client by ID
    static async updateClient(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, phone, address } = req.body;
            const updatedClient = await Client.findByIdAndUpdate(
                req.params.id,
                { name, email, phone, address },
                { new: true } // Return the updated document
            );

            if (!updatedClient) {
                res.status(404).json({ message: 'Client not found' });
            }

            res.status(200).json(updatedClient);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    // Delete a client by ID
    static async deleteClient(req: Request, res: Response): Promise<void> {
        try {
            const deletedClient = await Client.findByIdAndDelete(req.params.id); // Use findByIdAndDelete

            if (!deletedClient) {
                res.status(404).json({ message: 'Client not found' });
            }

            res.status(200).json({ message: 'Client deleted successfully' });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default ClientController;