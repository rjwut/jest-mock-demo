/*
 * By default, a mock function returns `undefined`. You can provide your own implementation instead,
 * either by passing in an implementation function when you call `jest.fn()`, or by using invoking
 * the mock function's `mockImplementation()` method. To revert back to the default behavior of
 * simply returning `undefined`, call `mockReset()` on the mock function. (This will also clear the
 * mock function's call history as if you'd invoked `mockClear()`.)
 *
 * There is also a `mockImplementationOnce()` method that allows you to specify an implementation
 * that only gets called once, after which it reverts to the previous behavior. You can invoke
 * `mockImplementationOnce()` multiple times to specify different implementations for subsequent
 * calls.
 *
 * A good defensive programming pattern to ensure that each test provides its own implemenation for
 * a mock function is to provide a default implementation that throws an error, like this:
 *
 * ```js
 * let mockFn;
 *
 * beforeEach(() => {
 *   mockFn = jest.fn(() => {
 *     throw new Error('Not mocked');
 *   }
 * });
 * ```
 *
 * Then individual tests can provide their own implementations using `mockImplementationOnce()`. If
 * someone forgets to provide an implementation when they write a test, the default implementation
 * will throw the "Not mocked" error.
 *
 * There are several convenience methods available on mock functions for common implementation
 * scenarios:
 *
 * `mockReturnValue(value: any)`
 * --> `mockImplementation(() => value)`
 *
 * `mockReturnValueOnce(value: any)`
 * --> `mockImplementationOnce(() => value)`
 *
 * `mockResolvedValue(value: any)`
 * --> `mockImplementation(() => Promise.resolve(value))`
 *
 * `mockResolvedValueOnce(value: any)`
 * --> `mockImplementationOnce(() => Promise.resolve(value))`
 *
 * `mockRejectedValue(value: any)`
 * --> `mockImplementation(() => Promise.reject(value))`
 *
 * `mockRejectedValueOnce(value: any)`
 * --> `mockImplementationOnce(() => Promise.reject(value))`
 *
 * `mockReturnThis()`
 * --> `mockImplementation(function() { return this; })`
 *
 * It kind of annoys me that there are no `mockThrow()` and `mockThrowOnce()` methods. 🤷‍♂️
 *
 * There's also a `withImplementation(fn: Function, callback: Function)`, which allows you to apply
 * a mock implementation within the scope of the given callback.
 *
 * As with a mock function's call history, implementations must be isolated to ensure they don't
 * carry over between tests or you'll get inconsistent results. Again, the most bulletproof way to
 * do this is to create your mock functions in the `beforeEach()` block of your test suite. Another
 * option is to invoke `jest.resetAllMocks()`, which removes the implementations of all existing
 * mock functions. An individual mock function's implementation can be reset by calling
 * `mockReset()` on it. Using the `*Once()` methods whenever possible is also a good way to avoid
 * implementations hanging around longer than intended, even within an individual test.
 */
const applyHandlers = require('./apply-handlers');

let handlers;

beforeEach(() => {
  handlers = [
    jest.fn(),
    jest.fn(),
    jest.fn(),
  ];
});

test('Mocking behavior', () => {
  // Mock functions return undefined by default
  expect(applyHandlers(handlers, 'test')).toBeUndefined();

  // Mock a return value
  handlers[2].mockReturnValueOnce('foo');
  expect(applyHandlers(handlers, 'test')).toBe('foo');

  // Mock an implementation
  handlers[1].mockImplementationOnce(() => {
    throw new Error('bar');
  });
  handlers[2].mockReturnValueOnce('baz');
  expect(() => applyHandlers(handlers, 'test')).toThrow('bar');
  expect(applyHandlers(handlers, 'test')).toBe('baz');

  /*
   * Full list of behavior mocking methods:
   *
   * mockImplementation(fn: Function)
   * mockImplementationOnce(fn: Function)
   * mockReturnThis()
   * mockReturnValue(value: any)
   * mockReturnValueOnce(value: any)
   * mockResolvedValue(value: any)
   * mockResolvedValueOnce(value: any)
   * mockRejectedValue(value: any)
   * mockRejectedValueOnce(value: any)
   *
   * mockReset: Calls mockClear() and resets the mock function's behavior to return `undefined`
   */
});
