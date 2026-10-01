export const sendSuccess = (res, data = null, status = 200, extra = {}) =>
  res.status(status).json({ success: true, data, ...extra });
