/*
 * Here we define a manual mock for the `fs/promises` module. It only implements a mock of the
 * `readFile()` method from the `fs/promises`, since that's the only one we use in this project. It
 * also provides a `mockFile()` method to let us mock the files that `readFile()` can read, and
 * `mockClear()` to reset the mock to a pristine state.
 *
 * When a test uses `jest.mock('node:fs/promises')` (without providing our own mock factory), Jest
 * will automatically load up this mock.
 */
const { resolve } = require('node:path');

const files = new Map();

const fs = {
  readFile: async filename => {
    filename = resolve(filename);
    const content = files.get(filename);

    if (content) {
      return content;
    }

    const error = new Error(`ENOENT: no such file or directory, open '${filename}'`);
    error.errno = -4058;
    error.code = 'ENOENT';
    error.syscall = 'open';
    error.path = filename;
    throw new error;
  },

  mockFile: (filename, content) => {
    filename = resolve(filename);

    if (content === undefined) {
      files.delete(filename);
    } else {
      content = JSON.stringify(content);
      files.set(filename, content);
    }
  },

  mockClear: () => {
    files.clear();
  },
};

module.exports = fs;
