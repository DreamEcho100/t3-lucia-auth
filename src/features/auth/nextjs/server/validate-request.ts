import { cache } from "react";
import { validateRequest as baseValidateRequest } from "../../base/server/features/validate-request";
import { cookies } from "next/headers";

export const validateRequest = cache(() => {
  try {
    return baseValidateRequest(cookies);
  } catch (error) {
    console.error(error);
    // Next.js throws error when attempting to set cookies when rendering page
  }
});