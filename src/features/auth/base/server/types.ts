// import { cookies } from "next/headers";
import {
  type ResponseCookie,
  type ResponseCookies,
} from "next/dist/compiled/@edge-runtime/cookies";

interface RequestCookie {
  name: string;
  value: string;
}

export type GetServerCookies = () => {
  get: (...args: [name: string] | [RequestCookie]) => RequestCookie | undefined;
  set: (
    ...args:
      | [
          key: string,
          value: string,
          cookie?: Partial<ResponseCookie> | undefined,
        ]
      | [options: ResponseCookie]
  ) => ResponseCookies;
};

export type AuthSuccessResult<Data = undefined> = Data extends undefined
  ? {
      status: "success";
      message?: string;
    }
  : {
      status: "success";
      message?: string;
      data: Data;
    };

export interface AuthErrorResult {
  status: "error";
  message: string;
  data?: never;
}

export type AuthResult<Data = undefined> =
  | AuthErrorResult
  | AuthSuccessResult<Data>;
