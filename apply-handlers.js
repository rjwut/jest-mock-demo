/**
 * Passes `inputValue` into the given array of "handler" functions one at a time until one of them
 * returns something other than `undefined`, then returns that value.
 *
 * @param {Function[]} handlers - the functions to try
 * @param {*} inputValue - the value to pass to each function
 * @returns {*} - the first non-`undefined` value returned by a handler function, or `undefined` if
 * all handler functions return `undefined`
 * @throws {Error} - if any handler function throws an error
 */
module.exports = (handlers, inputValue) => {
  for (const handler of handlers) {
    const result = handler(inputValue);

    if (result !== undefined) {
      return result;
    }
  }

  return undefined;
};
