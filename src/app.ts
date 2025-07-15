import express from 'express';
import mongoose from 'mongoose';

import incomeRoutes from './routes/income.routes';
import expenseRoutes from './routes/expense.routes';
import supplierRoutes from './routes/supplier.routes'; 
import clientRoutes from './routes/client.routes'; // Importing client routes
import reportRoutes from './routes/report.routes';
import path from 'path';

const app = express();
app.use(express.json());
app.use('/api/reports', reportRoutes);

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookkeeping';
mongoose.connect(mongoUri)
  .then(() => {
    console.log('MongoDB connected successfully.');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });
app.use('/api/clients',clientRoutes)
app.use('/api/incomes', incomeRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/suppliers', supplierRoutes); 
// מאפשר להוריד קבצים מתיקיית uploads
app.use('/files', express.static(path.join(__dirname, '../uploads')));

// הרצת השרת
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
