import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../../src/app'; // נקודת הכניסה לאפליקציה שלך
import Client from '../../../src/models/client.model';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Client.deleteMany({});
});

describe('ClientController', () => {
  it('should create a new client', async () => {
    const res = await request(app)
      .post('/api/clients')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123456789',
        address: '123 Main St',
      });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('John Doe');
  });

  it('should get all clients', async () => {
    await Client.create({ name: 'Alice', email: 'alice@example.com', phone: '111', address: 'Wonderland' });

    const res = await request(app).get('/api/clients');

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('Alice');
  });

  it('should get a client by ID', async () => {
    const client = await Client.create({ name: 'Bob', email: 'bob@example.com', phone: '222', address: 'Nowhere' });

    const res = await request(app).get(`/api/clients/${client._id}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Bob');
  });

  it('should return 404 if client not found by ID', async () => {
    const id = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/clients/${id}`);
    expect(res.status).toBe(404);
  });

  it('should update a client', async () => {
    const client = await Client.create({ name: 'Tom', email: 'tom@example.com', phone: '333', address: 'Ocean' });

    const res = await request(app)
      .put(`/api/clients/${client._id}`)
      .send({ name: 'Tommy', email: 'tom@example.com', phone: '333', address: 'Ocean' });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Tommy');
  });

  it('should delete a client', async () => {
    const client = await Client.create({ name: 'Sarah', email: 'sarah@example.com', phone: '444', address: 'Forest' });

    const res = await request(app).delete(`/api/clients/${client._id}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Client deleted successfully');
  });
});
