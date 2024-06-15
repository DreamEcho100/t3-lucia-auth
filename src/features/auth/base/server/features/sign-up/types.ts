import type {
  AuthSuccessResult,
  AuthResult,
  AuthDefaultOptions,
} from "../../types";

export type SignUpInput = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type SignUpOptions = AuthDefaultOptions;

export interface SignUpSuccessResultData {
  userId: string;
}

export type SignUpServiceSuccessResult = Promise<
  AuthSuccessResult<SignUpSuccessResultData>
>;
export type SignUpServiceResult = Promise<AuthResult<SignUpSuccessResultData>>;
