"use server";
import { type z } from "zod";
import {
  type SignInSchema,
  type SignUpSchema,
} from "../../../base/server/libs/validators";
import { cookies } from "next/headers";
import { signInController } from "../../../base/server/features/sign-in/controller";
import { signUpController } from "../../../base/server/features/sign-up/controller";
import { signOutController } from "../../../base/server/features/sign-out/controller";

export async function signUpAction(input: z.infer<typeof SignUpSchema>) {
  return await signUpController(input, { getServerCookies: cookies });
}

export async function signInAction(input: z.infer<typeof SignInSchema>) {
  return await signInController(input, { getServerCookies: cookies });
}

export async function signOutAction() {
  return await signOutController({ getServerCookies: cookies });
}
