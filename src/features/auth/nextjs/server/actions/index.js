"use server";
import {
  signUpInput,
  signUpService,
} from "~/features/auth/base/server/features/sign-up/index.js";
import {
  signInInput,
  signInService,
} from "../../../base/server/features/sign-in/index.js";
import { signOutService } from "../../../base/server/features/sign-out/index.js";
import { errorFormatter } from "~/features/auth/base/server/libs/error.js";
import { cookies } from "next/headers.js";
import {
  resendVerificationEmailInput,
  resendVerificationEmailService,
} from "~/features/auth/base/server/features/resend-verification-email/index.js";
import { env } from "~/env.js";

/** @type {import("~/features/auth/base/server/types").AuthDefaultOptions} */
const nextServerAuthDefaultOptions = {
  getCookies: cookies,
  env,
};

/**
 * @template Output
 * @template Input
 *
 * @param {{
 *  schema: (input: unknown) => Input;
 *  action:  ((input: Input) => Promise<Output>);
 * }} param
 */
function safeAction(param) {
  /** @param {Input} input */
  return async function (input) {
    try {
      const _input = param.schema(input);
      return await param.action(_input);
    } catch (err) {
      return errorFormatter(err);
    }
  };
}

export const signUpAction = safeAction({
  schema: signUpInput,
  action: (input) => signUpService(input, nextServerAuthDefaultOptions),
});

export const signInAction = safeAction({
  schema: signInInput,
  action: (input) => signInService(input, nextServerAuthDefaultOptions),
});

export async function signOutAction() {
  return signOutService(nextServerAuthDefaultOptions).catch(errorFormatter);
}

export const resubmitEmailVerificationAction = safeAction({
  schema: resendVerificationEmailInput,
  action: (input) =>
    resendVerificationEmailService(input, nextServerAuthDefaultOptions),
});
