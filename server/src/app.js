import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { clientOrigins, env, isProd } from './config/env.js';
import { originGuard } from './middlewares/originGuard.js';
import { errorHandler, notFound } from './middlewares/error.js';

import authRoutes from './modules/auth/routes.js';
import userRoutes from './modules/users/routes.js';
import commentRoutes from './modules/comments/routes.js';
import issueRoutes from './modules/issues/routes.js';
import dashboardRoutes from './modules/dashboard/routes.js';

const app = express();

if (isProd) app.set('trust proxy', 1); // Render/Railway sit behind a proxy

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: clientOrigins, credentials: true }));
if (env.NODE_ENV !== 'test') app.use(morgan(isProd ? 'combined' : 'dev'));
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());
app.use(originGuard);

app.get('/api/v1/health', (_req, res) => res.json({ success: true, data: { status: 'ok' } }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1', commentRoutes); // /issues/:issueId/comments + /comments/:id (before issues router)
app.use('/api/v1/issues', issueRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
