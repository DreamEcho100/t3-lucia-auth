import type {
  AuthDefaultOptions,
  AuthRedirectResult,
  AuthSuccessResult,
} from "../../types";

export type ResendVerificationEmailOptions = AuthDefaultOptions;
export interface ResendVerificationEmailInput {
  email: string;
}

export type ResendVerificationEmailServiceSuccessResult = Promise<
  AuthSuccessResult | AuthRedirectResult
>;
