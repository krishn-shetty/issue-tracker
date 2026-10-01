import { ApiError } from '../utils/ApiError.js';

// validate({ params, query, body }) with Zod schemas. Parsed (stripped, coerced) values replace the originals,
// so only known, correctly typed fields ever reach controllers/Mongoose.
export const validate = (schemas) => (req, _res, next) => {
  for (const key of ['params', 'query', 'body']) {
    if (!schemas[key]) continue;
    const result = schemas[key].safeParse(req[key] ?? {});
    if (!result.success) {
      const errors = result.error.issues.map((i) => ({
        field: i.path.join('.'),
        message: i.message,
      }));
      return next(new ApiError(422, 'Validation failed', errors));
    }
    req[key] = result.data;
  }
  next();
};
