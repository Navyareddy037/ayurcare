import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environmental parameters
dotenv.config();

import authRoutes from './routes/authRoutes';
import doctorRoutes from './routes/doctorRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import trackerRoutes from './routes/trackerRoutes';
import reviewRoutes from './routes/reviewRoutes';
import knowledgeRoutes from './routes/knowledgeRoutes';
import aiRoutes from './routes/aiRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware registration
app.use(cors({
  origin: '*', // Allow all cross-origins for easy local evaluation
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// REST API Route mapping
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/health-tracker', trackerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/ai-assessment', aiRoutes);

// Base route for server health verification
app.get('/', (req, res) => {
  res.json({ message: 'AyurCare Express REST API Server is running successfully.' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// Start listening
app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
