import type { AuthDefaultOptions, AuthSuccessResult } from "../../types";

export type ResendVerificationEmailOptions = AuthDefaultOptions;
export interface ResendVerificationEmailInput {
  email: string;
}
export type ResendVerificationEmailServiceSuccessResult =
  Promise<AuthSuccessResult>;
