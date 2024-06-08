import { type SignUpSchema } from "~/features/auth/base/server/libs/validators";
import {
  type AuthSuccessResult,
  type AuthResult,
  type GetServerCookies,
} from "../../types";
import { type z } from "zod";

export type SignUpInput = z.infer<typeof SignUpSchema>;

export interface SignUpOptions {
  getServerCookies: GetServerCookies;
}

export interface SignUpSuccessResultData {
  userId: string;
}

export type SignUpServiceSuccessResult = Promise<
  AuthSuccessResult<SignUpSuccessResultData>
>;
export type SignUpServiceResult = Promise<AuthResult<SignUpSuccessResultData>>;
