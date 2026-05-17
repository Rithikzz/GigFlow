/** HTTP status code constants for clean architecture */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/** Application-wide string constants */
export const APP_CONSTANTS = {
  JWT_EXPIRY: '30d',
  DEFAULT_AVATAR_BG: '6366f1',
  DEFAULT_AVATAR_COLOR: 'fff',
  DEFAULT_LEAD_SOURCE: 'Website form',
  DEFAULT_LEAD_STATUS: 'new',
} as const;
