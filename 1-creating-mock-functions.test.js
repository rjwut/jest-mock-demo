/*
 * A mock function can be created using `jest.fn()`. You can query its call history to find out
 * things like: how many times it was called, what arguments were passed in when it was called, what
 * value was returned, etc. You can also inspect the complete details of its call history via the
 * mock function's `mock` property.
 *
 * Note that by default, a mock function simply returns `undefined` when called. The next test suite
 * discusses how to provided an implementation for a mock function.
 *
 * The matchers provided by Jest to query mock functions include:
 *
 * - `toHaveBeenCalled()`: Checks if the mock function was called at least once.
 * - `toHaveBeenCalledTimes(number)`: Checks if the mock function was called exactly the specified
 *   number of times.
 * - `toHaveBeenCalledWith(...args)`: Checks if the mock function was ever called with the specified
 *   arguments.
 * - `toHaveBeenLastCalledWith(...args)`: Same as `toHaveBeenCalledWith()`, but only checks the most
 *   recent call.
 * - `toHaveBeenNthCalledWith(n, ...args)`: Same as `toHaveBeenCalledWith()`, but only checks the
 *   nth call (1-based).
 * - `toHaveReturned()`: Checks if the mock function has returned (as opposed to throwing an error)
 *   at least once.
 * - `toHaveReturnedTimes(number)`: Checks if the mock function has returned at least the specified
 *   number of times.
 * - `toHaveReturnedWith(value)`: Checks if the mock function returned a specified value at least
 *   once.
 * - `toHaveLastReturnedWith(value)`: Same as `toHaveReturnedWith()`, but only checks the most
 *   recent return value.
 * - `toHaveNthReturnedWith(n, value)`: Same as `toHaveReturnedWith()`, but only checks the nth
 *   return value (1-based).
 *
 * The matchers that test for particular values being passed in or returned can use static methods
 * on `expect` to check against a matcher instead of a discrete value.
 *
 * It's important to ensure that each test is completely isolated from the others, so you have to
 * prevent a mock function's call history from being carried over between tests. The most
 * bulletproof way to ensure this is to create all of your mock functions in the `beforeEach()`
 * block of your test suite. However, if that's not feasible, you can also call
 * `jest.clearAllMocks()` to reset the call history of any existing mock functions. To reset the
 * call history of an individual mock function, you can call `mockClear()` on it.
 */
const reverseStringWithCallback = require('./reverse-callback');

let callback;

beforeEach(() => {
  // Create a new mock function for each test
  callback = jest.fn();
});

test('reverseString reverses the input string', () => {
  expect(callback).not.toHaveBeenCalled();
  reverseStringWithCallback('hello', callback);
  expect(callback).toHaveBeenCalled();
  expect(callback).toHaveBeenCalledTimes(1);
  expect(callback).toHaveBeenLastCalledWith(null, 'olleh');
  expect(callback.mock).toEqual(expect.objectContaining({
    calls: [                     // arguments for each call
      [ null, 'olleh' ],
    ],
    contexts: [                  // value of this for each call
      undefined,
    ],
    instances: [                 // instances created via the new keyword
      undefined,
    ],
    lastCall: [ null, 'olleh' ], // arguments for the most recent call
    results: [                   // return values or thrown errors for each call
      { type: 'return', value: undefined },
    ],
  }));
  callback.mockClear();
});

test('Callback gets an error for non-string input', () => {
  reverseStringWithCallback(47, callback);
  expect(callback).toHaveBeenLastCalledWith(new Error('Input must be a string'));
});
