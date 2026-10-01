// VITE_* values are bundled into public JavaScript. Never put secrets here.
const env = import.meta.env ?? {};

export const API_URL = env.VITE_API_URL || "http://localhost:5001/api/v1";
export const IS_DEV = env.DEV === true;