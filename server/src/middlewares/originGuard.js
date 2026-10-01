import { clientOrigins } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

// CSRF defence for cookie auth: browsers always send Origin on cross-site state-changing requests.
// Requests without Origin (curl, server-to-server) are allowed.
export const originGuard = (req, _res, next) => {
  const origin = req.get('origin');
  if (SAFE_METHODS.has(req.method) || !origin || clientOrigins.includes(origin)) return next();
  next(new ApiError(403, 'Origin not allowed'));
};
