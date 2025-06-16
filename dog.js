class Dog {
  #name;

  /**
   * @param {string} name - the `Dog`'s name
   */
  constructor(name) {
    this.#name = name;
  }

  /**
   * @returns {string} - the `Dog`'s name
   */
  get name() {
    return this.#name;
  }

  /**
   * @returns {string} - a string stating that the `Dog` is barking
   */
  bark() {
    return `${this.name} says "Woof!"`;
  }
}

module.exports = Dog;
