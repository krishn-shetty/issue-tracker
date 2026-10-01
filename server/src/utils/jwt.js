import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export const signToken = (userId) =>
  jwt.sign({ sub: String(userId) }, env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '7d' });

export const verifyToken = (token) =>
  jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] });
