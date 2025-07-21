/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */

import { logger } from "./logger.js";

/**
 * Generates a UUID for an error, sends the error to the logger,
 * and returns the UUID to be shared with the user.
 * @param error - The error to log.
 * @param context - The context in which the error occurred.
 * @returns A UUID string assigned to the error.
 */
export const errorHandler = async(
  error: unknown,
  context: string,
): Promise<string> => {
  const id = crypto.randomUUID();
  await logger.error(
    `${context} - Error ID: ${id}`,
    error instanceof Error
      ? error
      : new Error(String(error)),
  );
  return id;
};
