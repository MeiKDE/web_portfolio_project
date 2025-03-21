import * as crypto from "crypto";

/**
 * Generates a random salt for password hashing
 */
export function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

/**
 * Hashes a password with the given salt
 */
export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

/**
 * Verifies a password against a hash
 */
export function verifyPassword(
  password: string,
  salt: string,
  hashedPassword: string
): boolean {
  const hash = hashPassword(password, salt);
  return hash === hashedPassword;
}

/**
 * Generates a verification token
 */
export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}
