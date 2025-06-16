const { EventEmitter } = require('events');

const DEFAULT_BPM = 60;

/**
 * Emits a `tick` event at a regular interval, based on the current beats per minute (BPM). Also
 * emits `start` and `stop` events when the metronome starts and stops, respectively. The `start`
 * and `tick` events include the current BPM as an argument.
 */
class Metronome extends EventEmitter {
  #bpm = 60;
  #timer = null;

  /**
   * @returns {number} - the default beats per minute for the `Metronome` (`60`)
   */
  static get DEFAULT_BPM() {
    return DEFAULT_BPM;
  }

  /**
   * @returns {number} - the current beats per minute (default = `60`)
   */
  get bpm() {
    return this.#bpm;
  }

  /**
   * @param {number} bpm - the beats per minute to set; if this is changed while the `Metronome` is
   * running, it will stop and restart with the new BPM (which will emit the `stop` and `start`
   * events)
   * @throws {TypeError} - if `bpm` is not a number
   * @throws {RangeError} - if `bpm` is not greater than zero
   */
  set bpm(bpm) {
    if (bpm === this.#bpm) {
      return;
    }

    if (typeof bpm !== 'number') {
      throw new TypeError('BPM must be a number');
    }

    if (bpm < 1) {
      throw new RangeError('BPM must be greater than zero');
    }

    this.#bpm = bpm;

    if (this.#timer) {
      this.stop();
      this.start();
    }
  }

  /**
   * @returns {boolean} - `true` if the `Metronome` is currently running, `false` otherwise
   */
  get running() {
    return this.#timer !== null;
  }

  /**
   * Causes the `Metronome` to emit a `start` event, then periodically emit `tick` events at the
   * current BPM. If the `Metronome` is already running, this method does nothing.
   */
  start() {
    if (this.running) {
      return;
    }

    this.emit('start', this.#bpm);
    const interval = (60 / this.#bpm) * 1000;
    this.#timer = setInterval(() => {
      this.emit('tick', this.#bpm);
    }, interval);
  }

  /**
   * Causes the `Metronome` to emit a `stop` event, after which no more `tick` events will be
   * emitted until `start()` is called again. If the `Metronome` is not running, this method does
   * nothing.
   */
  stop() {
    if (!this.running) {
      return;
    }

    clearInterval(this.#timer);
    this.#timer = null;
    this.emit('stop');
  }
}

module.exports = Metronome;
