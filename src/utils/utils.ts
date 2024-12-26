import { v4 as uuidv4 } from "uuid";
/**
 * Generates a random ID as a string, padded to 6 characters with leading zeros.
 * @returns {string} The generated random ID.
 */
export const getRandomId = (): string => {
  const randomNumber = Math.floor(Math.random() * 99999) + 1;
  return randomNumber.toString().padStart(6, "0");
};

export const getRandomString = (length: number): string =>
  Array.from({ length }, () =>
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(
      Math.floor(Math.random() * 62)
    )
  ).join("");

export const generateId = (): string => uuidv4();

/**
 * Returns a promise that resolves after a specified number of seconds.
 * @param {number} seconds - The number of seconds to delay.
 * @returns {Promise<void>} A promise that resolves after the delay.
 */
export const delay = (seconds: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, seconds * 1000));

/**
 * Generates a random number between min and max (inclusive).
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} The generated random number.
 */
export const getRandomNumber = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const normalizeError = (
  error: any
): { message: string; [key: string]: any } => {
  const defaultMessage = "An unexpected error occurred";

  if (error instanceof Error) {
    const { message, ...rest } = error;
    return { message, ...rest };
  } else if (error && typeof error === "object" && "message" in error) {
    return error as { message: string; [key: string]: any };
  } else if (error && typeof error === "string") {
    return { message: error };
  } else {
    return { message: defaultMessage };
  }
};

export const validFileSize = (file: File): boolean =>
  file.size <= 5 * 1024 * 1024; // 5MB in bytes

export const isImage = (file: File): boolean => file.type.includes("image");
