/**
 * Input sanitization utilities.
 */

/**
 * Sanitize a text string: strip HTML tags, trim, normalize whitespace.
 * @param {string} text - Raw input text
 * @returns {string} Sanitized text
 */
export function sanitizeText(text) {
  if (typeof text !== 'string') {
    return '';
  }

  return text
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove HTML entities
    .replace(/&[a-zA-Z0-9#]+;/g, ' ')
    // Remove null bytes
    .replace(/\0/g, '')
    // Normalize whitespace (collapse multiple spaces/tabs to single space)
    .replace(/[ \t]+/g, ' ')
    // Normalize multiple newlines to double newline
    .replace(/\n{3,}/g, '\n\n')
    // Trim leading and trailing whitespace
    .trim();
}

/**
 * Recursively sanitize all string values in an object.
 * @param {any} obj - Object to sanitize
 * @returns {any} Sanitized object (new reference)
 */
export function sanitizeForDB(obj) {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return sanitizeText(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeForDB(item));
  }

  if (typeof obj === 'object' && !(obj instanceof Date) && !(obj instanceof RegExp)) {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      // Prevent prototype pollution
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }
      sanitized[key] = sanitizeForDB(value);
    }
    return sanitized;
  }

  return obj;
}
