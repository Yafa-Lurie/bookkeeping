import express from 'express';
import mongoose from 'mongoose';
import incomeRoutes from './routes/income.routes';
import expenseRoutes from './routes/expense.routes'; // Ensure this file exists as 'expense.routes.ts' in the 'routes' folder


const app = express();
app.use(express.json());

const mongoUri = 'your_mongo_connection_string'; // Replace with your MongoDB connection string
mongoose.connect(mongoUri);

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
