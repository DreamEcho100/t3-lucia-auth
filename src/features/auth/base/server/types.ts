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

export interface AuthNeededEnv {
  JWT_SECRET: string;
}

export type AuthDefaultOptions<Other = unknown> = {
  getCookies: GetServerCookies;
  env: AuthNeededEnv;
} & Other;

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

export type AuthRedirectResult = {
  status: "redirect";
  message?: string;
  url: string;
  statusNumber: number;
};

export type AuthErrorResult =
  | {
      status: "error";
      message: string;
      data?: never;
      statusNumber: number;
    }
  | {
      status: "input-validation-errors";
      fields: {
        [x: string]: string[] | undefined;
        [x: number]: string[] | undefined;
        [x: symbol]: string[] | undefined;
      };
      message?: never;
      data?: never;
      statusNumber: number;
    };

export type AuthResult<Data = undefined> =
  | AuthErrorResult
  | AuthSuccessResult<Data>;
