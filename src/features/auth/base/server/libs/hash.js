import { verify as argonVerify, hash as argonHash } from "@node-rs/argon2";

// recommended minimum parameters
const ARGON_OPTIONS = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

/**
 * @param {string} hashed
 * @param {string} str
 */
export function verify(hashed, str) {
  return argonVerify(hashed, str, ARGON_OPTIONS);
}

/**
 * @param {string} str
 */
export function hash(str) {
  return argonHash(str, ARGON_OPTIONS);
}
