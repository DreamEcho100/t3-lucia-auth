import type {
  AuthSuccessResult,
  AuthResult,
  AuthDefaultOptions,
} from "../../types";

export type SignOutOptions = AuthDefaultOptions;

export type SignOutServiceSuccessResult = Promise<AuthSuccessResult>;
export type SignOutServiceResult = Promise<AuthResult>;
