import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import medicinesRouter from './routes/medicines';
import billingRouter from './routes/billing';
import dashboardRouter from './routes/dashboard';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow any localhost origin (handles Vite port auto-increment: 5173, 5174, etc.)
    if (!origin || origin.startsWith('http://localhost')) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: ${origin} not allowed`));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/medicines', medicinesRouter);
app.use('/billing', billingRouter);
app.use('/bills', billingRouter);
app.use('/dashboard', dashboardRouter);

// Global error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ AR Medicals Backend running on http://localhost:${PORT}`);
});

export default app;
