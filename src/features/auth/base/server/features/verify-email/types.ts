import type {
  AuthDefaultOptions,
  AuthRedirectResult,
  AuthSuccessResult,
} from "../../types";

export type VerifyEmailOptions = AuthDefaultOptions;
export interface VerifyEmailInput {
  token: string;
}
export type VerifyEmailServiceSuccessResult = Promise<
  AuthSuccessResult | AuthRedirectResult
>;
