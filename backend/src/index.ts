
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import { configurePassport } from './config/passport';
import authRoutes from './routes/auth';
import sessionRoutes from './routes/sessions';
import uploadRoutes from './routes/upload';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Configure middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Configure passport
configurePassport(passport);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
