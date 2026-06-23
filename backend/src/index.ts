import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import githubRoutes from './routes/github.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiRateLimit } from './middleware/rateLimit.js';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:5173').split(',');

app.set('trust proxy', 1);

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(o => origin.startsWith(o.trim()))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(morgan('combined'));

// Global rate limiting
app.use('/api', apiRateLimit);

// Routes
app.use('/api', githubRoutes);

// Health check root
app.get('/', (_req, res) => {
  res.json({
    name: 'GitInsight API',
    version: '1.0.0',
    status: 'running',
    docs: '/api/health',
  });
});

// 404 + error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n🚀 GitInsight API running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV ?? 'development'}`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});

export default app;
