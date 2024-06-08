import { type SignInSchema } from "~/features/auth/base/server/libs/validators";
import {
  type AuthSuccessResult,
  type AuthResult,
  type GetServerCookies,
} from "../../types";
import { type z } from "zod";

export type SignInInput = z.infer<typeof SignInSchema>;

export interface SignInOptions {
  getServerCookies: GetServerCookies;
}

export type SignInServiceSuccessResult = Promise<AuthSuccessResult>;
export type SignInServiceResult = Promise<AuthResult>;
