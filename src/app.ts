import express from 'express';
import mongoose from 'mongoose';
import incomeRoutes from './routes/income.routes';
import expenseRoutes from './routes/expense.routes'; // Ensure this file exists as 'expense.routes.ts' in the 'routes' folder


const app = express();
app.use(express.json());

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookkeeping'; // Default to local MongoDB
mongoose.connect(mongoUri)
  .then(() => {
    console.log('MongoDB connected successfully.');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

app.use('/api/incomes', incomeRoutes);
app.use('/api/expenses', expenseRoutes);

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;


// mongoose.connect('mongodb://localhost:27017/yourDatabaseName', {
//   // No need to include useNewUrlParser here
//   useUnifiedTopology: true,
//   // Other options can be specified if needed
// })
// .then(() => {
//   console.log('MongoDB connected successfully.');
// })
// .catch((error) => {
//   console.error('MongoDB connection error:', error);
// });
