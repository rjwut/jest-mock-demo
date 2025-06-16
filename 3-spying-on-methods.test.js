/*
 * A spy is a mock function that wraps an existing method. You can install a spy by invoking the
 * `jest.spyOn()` method, passing in the object and method name you want to spy on. It will return
 * the mock function which wraps the original method. Invoking `mockRestore()` on the mock function
 * will restore the original method, disabling the spy.
 */
const Dog = require('./dog');

let dog, barkSpy, nameSpy;

beforeEach(() => {
  dog = new Dog('Fritz');
  barkSpy = jest.spyOn(dog, 'bark');        // spy on the bark() method
  nameSpy = jest.spyOn(dog, 'name', 'get'); // spy on the name getter
});

afterEach(() => {
  barkSpy.mockRestore();
  nameSpy.mockRestore();
});

/**
 * You can access the spy either via the return value of `jest.spyOn()` or by simply referencing the
 * spied member on the object itself.
 */
test('Play with the Dog.bark() spy', () => {
  expect(dog.bark()).toBe('Fritz says "Woof!"');
  expect(barkSpy).toHaveBeenCalledTimes(1);
  dog.bark.mockReturnValue('Fritz says "Arf!"');
  expect(dog.bark()).toBe('Fritz says "Arf!"');
  dog.bark.mockReturnValueOnce('Fritz says "Ruff!"');
  dog.bark.mockImplementationOnce(function () {
    // Note: Don't use an arrow function if referencing "this"
    throw new Error(`${this.name} has laryngitis`);
  });
  expect(dog.bark()).toBe('Fritz says "Ruff!"');
  expect(() => dog.bark()).toThrow('Fritz has laryngitis');
  expect(dog.bark()).toBe('Fritz says "Arf!"');
});

/**
 * For getters and setters, you have to use the return value of `jest.spyOn()` to access the
 * mock function, since directly referencing the mocked property will simply invoke the mock getter
 * and return the value it provides, rather than the mock function itself.
 */
test('Play with the Dog.name spy', () => {
  expect(dog.name).toBe('Fritz');
  nameSpy.mockReturnValueOnce('Rex');
  expect(dog.name).toBe('Rex');
  expect(dog.name).toBe('Fritz');
  expect(nameSpy).toHaveBeenCalledTimes(3);
});
