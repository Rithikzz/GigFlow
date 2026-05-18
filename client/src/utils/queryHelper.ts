/**
 * Helper to clean query parameter objects by removing undefined, null, and empty string values.
 * It dynamically formats parameter values to be clean string parameters for API calls.
 */
export const cleanQueryParams = <T extends Record<string, any>>(params: T): Record<string, string> => {
  const cleaned: Record<string, string> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      cleaned[key] = String(value);
    }
  });

  return cleaned;
};
