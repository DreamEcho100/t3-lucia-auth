import type {
  AuthSuccessResult,
  AuthResult,
  AuthDefaultOptions,
} from "../../types";

export interface SignInInput {
  password: string;
  name?: string | undefined;
  email?: string | undefined;
}

export type SignInOptions = AuthDefaultOptions;

export type SignInServiceSuccessResult = Promise<AuthSuccessResult>;
export type SignInServiceResult = Promise<AuthResult>;
