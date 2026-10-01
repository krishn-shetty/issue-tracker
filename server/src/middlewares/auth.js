import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { verifyToken } from '../utils/jwt.js';
import * as userRepository from '../modules/users/repository.js';

export const protect = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.token;
  if (!token) throw new ApiError(401, 'Authentication required');

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw new ApiError(401, 'Invalid or expired session');
  }

  const user = await userRepository.findById(payload.sub);
  if (!user) throw new ApiError(401, 'Invalid or expired session');

  req.user = user;
  next();
});

export const requireAdmin = (req, _res, next) =>
  req.user?.role === 'ADMIN' ? next() : next(new ApiError(403, 'Admin access required'));
