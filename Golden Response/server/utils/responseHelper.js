/**
 * Standardized API response helpers.
 * Every API response follows: { success: boolean, data?: object, message?: string, error?: object }
 */

/**
 * Send a success response.
 * @param {import('express').Response} res
 * @param {object|null} data - Response payload
 * @param {string} message - Human-readable success message
 * @param {number} statusCode - HTTP status code (default 200)
 */
export function sendSuccess(res, data = null, message = 'Success', statusCode = 200) {
  const response = {
    success: true,
    message,
  };

  if (data !== null && data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
}

/**
 * Send an error response.
 * @param {import('express').Response} res
 * @param {string} code - Machine-readable error code (e.g. 'VALIDATION_ERROR')
 * @param {string} message - Human-readable error message
 * @param {number} statusCode - HTTP status code (default 500)
 * @param {object|null} details - Additional error details
 */
export function sendError(res, code = 'INTERNAL_ERROR', message = 'An error occurred', statusCode = 500, details = null) {
  const response = {
    success: false,
    error: {
      code,
      message,
    },
  };

  if (details !== null && details !== undefined) {
    response.error.details = details;
  }

  return res.status(statusCode).json(response);
}
