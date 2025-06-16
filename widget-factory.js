const fs = require('fs/promises');

/**
 * Creates widgets (optionally using a template JSON file) with increasing serial numbers.
 */
class WidgetFactory {
  #serialNumber;

  /**
   * @param {number} [nextSerialNumber=0] - the serial number to use for the first widget created by
   * this factory
   */
  constructor(nextSerialNumber = 0) {
    this.#serialNumber = nextSerialNumber;
  }

  /**
   * @returns {number} - the serial number that will be assigned to the next widget created by this
   * factory
   */
  get nextSerialNumber() {
    return this.#serialNumber;
  }

  /**
   * Creates a widget.
   *
   * @param {string} [propFile] - the path to a JSON file containing properties to use for the
   * widget; if not provided, the widget will only have a `serialNumber` property
   * @returns {Object} - the new widget
   */
  async build(propFile) {
    let attributes;

    if (propFile) {
      attributes = JSON.parse(await fs.readFile(propFile, 'utf8'));
    }

    return {
      ...attributes,
      serialNumber: this.#serialNumber++,
    };
  }
}

module.exports = WidgetFactory;
