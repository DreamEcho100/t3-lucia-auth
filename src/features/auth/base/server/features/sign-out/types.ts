import {
  type AuthSuccessResult,
  type AuthResult,
  type GetServerCookies,
} from "../../types";

export interface SignOutOptions {
  getServerCookies: GetServerCookies;
}

export type SignOutServiceSuccessResult = Promise<AuthSuccessResult>;
export type SignOutServiceResult = Promise<AuthResult>;
