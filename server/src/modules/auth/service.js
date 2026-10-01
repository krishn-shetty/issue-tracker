import * as userRepo from '../users/repository.js';
import { ApiError } from '../../utils/ApiError.js';
import { signToken } from '../../utils/jwt.js';

export const register = async ({ name, email, password }) => {
  if (await userRepo.findByEmail(email)) throw new ApiError(409, 'Email is already registered');
  // role is never taken from the request: always USER
  const user = await userRepo.create({ name, email, password, role: 'USER' });
  return { user, token: signToken(user._id) };
};

export const login = async ({ email, password }) => {
  const user = await userRepo.findByEmailWithPassword(email);
  const valid = user && (await user.comparePassword(password));
  if (!valid) throw new ApiError(401, 'Invalid email or password');
  return { user, token: signToken(user._id) };
};
