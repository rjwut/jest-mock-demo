/**
 * Reverses the given input string and passes it to the indicated callback function. If `input` is
 * not a string, the callback will receive an error.
 *
 * @param {string} input - the string to reverse
 * @param {Function} callback - the callback function to call with the reversed string
 */
module.exports = (input, callback) => {
  if (typeof input !== 'string') {
    callback(new Error('Input must be a string'));
    return;
  }

  callback(null, [ ...input ].reverse().join(''));
};
