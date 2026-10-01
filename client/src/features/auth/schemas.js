import { z } from "zod";

const email = z.string().trim().min(1, "Email is required.").email("Enter a valid email address.");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Password is required.")
});

export const registerSchema = z.
object({
  name: z.
  string().
  trim().
  min(2, "Name must be at least 2 characters.").
  max(50, "Name must be at most 50 characters."),
  email,
  password: z.
  string().
  min(8, "Password must be at least 8 characters.").
  max(72, "Password must be at most 72 characters.").
  regex(/[A-Za-z]/, "Password must contain at least one letter.").
  regex(/\d/, "Password must contain at least one number."),
  confirmPassword: z.string().min(1, "Please confirm your password.")
}).
refine((values) => values.password === values.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match."
});