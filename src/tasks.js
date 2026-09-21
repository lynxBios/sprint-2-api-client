/**
 * Wraps fetchFn and checks the HTTP status before returning the JSON.
 * @param {Function} fetchFn
 * @param {number[]} allowedStatuses
 * @returns {Function} Returns a wrapped async function.
 */
export function withValidation(fetchFn, allowedStatuses) {
  if (typeof fetchFn !== 'function') {
    throw new TypeError('fetchFn must be a function');
  }

  if (!Array.isArray(allowedStatuses)) {
    throw new TypeError('allowedStatuses must be an array');
  }

  return async function (...args) {
    let fetchFnResponse;

    try {
      fetchFnResponse = await fetchFn(...args);
    } catch (error) {
      throw new Error('fetchFn error: Request failed', { cause: error });
    }

    if (!allowedStatuses.includes(fetchFnResponse.status)) {
      const errorBody = await fetchFnResponse.text();
      throw new Error(`HTTP ${fetchFnResponse.status}: ${errorBody}`);
    }

    return fetchFnResponse.json();
  };
}
