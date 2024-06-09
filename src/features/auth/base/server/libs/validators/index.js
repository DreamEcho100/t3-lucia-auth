import { z } from "zod";

export const SignUpSchema = z
  .object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => !!data.name || !!data.email, {
    message: "Username or email is required",
    path: ["name", "email"],
  });

export const SignInSchema = z
  .object({
    name: z.string().min(2).max(50).optional(),
    email: z.string().email().optional(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
  })
  .refine((data) => !!data.name || !!data.email, {
    message: "Username or email is required",
    path: ["name", "email"],
  });
