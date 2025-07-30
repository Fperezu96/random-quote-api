import express from 'express';
import cors from 'cors';
import quoteRoutes from './src/routes/quotes';
import { errorHandler } from './src/utils/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', quoteRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
