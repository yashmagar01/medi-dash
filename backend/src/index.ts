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
    const allowedOrigins = [process.env.FRONTEND_URL].filter(Boolean) as string[];
    
    // Allow localhost (development) and frontend URLs configured in env
    if (
      !origin || 
      origin.startsWith('http://localhost') || 
      origin.startsWith('http://127.0.0.1') ||
      allowedOrigins.some(o => origin === o || o.startsWith(origin) || origin.startsWith(o))
    ) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: ${origin} not allowed`));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes & Sub-routers
const apiRouter = express.Router();

// Health check on both router and app
apiRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

apiRouter.use('/medicines', medicinesRouter);
apiRouter.use('/billing', billingRouter);
apiRouter.use('/bills', billingRouter);
apiRouter.use('/dashboard', dashboardRouter);

app.use('/api', apiRouter); // Supports Vercel Serverless Function routing (same-domain)
app.use('/', apiRouter);    // Supports local direct routing and separate hosting

// Global error handler (must be last)
app.use(errorHandler);

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`✅ AR Medicals Backend running on http://localhost:${PORT}`);
  });
}

export default app;
