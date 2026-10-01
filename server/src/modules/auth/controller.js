import * as service from './service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import { isProd } from '../../config/env.js';
import { TOKEN_MAX_AGE_MS } from '../../utils/jwt.js';

// Cross-site deployments (Vercel + Render) need SameSite=None; Secure. Locally Lax works over http.
const baseCookie = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? 'none' : 'lax',
  path: '/',
};

const setAuthCookie = (res, token) =>
  res.cookie('token', token, { ...baseCookie, maxAge: TOKEN_MAX_AGE_MS });

export const register = asyncHandler(async (req, res) => {
  const { user, token } = await service.register(req.body);
  setAuthCookie(res, token);
  sendSuccess(res, user, 201);
});

export const login = asyncHandler(async (req, res) => {
  const { user, token } = await service.login(req.body);
  setAuthCookie(res, token);
  sendSuccess(res, user);
});

export const logout = (_req, res) => {
  res.clearCookie('token', baseCookie);
  sendSuccess(res, null);
};

export const me = (req, res) => sendSuccess(res, req.user);
