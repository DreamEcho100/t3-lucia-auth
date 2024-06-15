import type { AuthSuccessResult, AuthDefaultOptions } from "../../types";

export interface SignInInput {
  password: string;
  name?: string | undefined;
  email?: string | undefined;
}

export type SignInOptions = AuthDefaultOptions;
export type SignInServiceSuccessResult = Promise<AuthSuccessResult>;
