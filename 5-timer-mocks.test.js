/*
 * Writing tests for code that uses timers would be a pain, but fortunately, you can use mock timers
 * allow you to control the simulated passage of time. Call `jest.useFakeTimers()` to enable them
 * and `jest.useRealTimers()` to disable them.
 */
const Metronome = require('./metronome');

let metronome;

beforeEach(() => {
  jest.useFakeTimers();
  metronome = new Metronome();
});

afterEach(() => {
  jest.useRealTimers();
});

test('Golden path metronome test', () => {
  const onStart = jest.fn();
  const onTick = jest.fn();
  const onStop = jest.fn();
  metronome.on('start', onStart);
  metronome.on('tick', onTick);
  metronome.on('stop', onStop);
  expect(metronome.running).toBe(false);
  expect(metronome.bpm).toBe(Metronome.DEFAULT_BPM);
  metronome.start();

  try {
    expect(metronome.running).toBe(true);
    expect(onStart).toHaveBeenLastCalledWith(Metronome.DEFAULT_BPM);

    // With the metronome started, we have a pending interval for the first tick. Now we'll fast-
    // forward time until that tick occurs.
    jest.runOnlyPendingTimers();
    expect(onTick).toHaveBeenCalledTimes(1);
    expect(onTick).toHaveBeenLastCalledWith(Metronome.DEFAULT_BPM);

    // Let's double the BPM. This should stop and restart the metronome.
    const newBpm = metronome.bpm * 2;
    metronome.bpm = newBpm;
    expect(metronome.running).toBe(true);
    expect(metronome.bpm).toBe(newBpm);
    expect(onStop).toHaveBeenCalled();
    expect(onStart).toHaveBeenCalledTimes(2);
    expect(onStart).toHaveBeenLastCalledWith(newBpm);

    // Now fast-forward time until the next tick at the new BPM.
    jest.runOnlyPendingTimers();
    expect(onTick).toHaveBeenCalledTimes(2);
    expect(onTick).toHaveBeenLastCalledWith(newBpm);

    // Fast-forward three seconds. That should result in six more ticks at the new BPM.
    jest.advanceTimersByTime(3000);
    expect(onTick).toHaveBeenCalledTimes(8);
  } finally {
    metronome.stop();
  }

  expect(metronome.running).toBe(false);
  expect(onStop).toHaveBeenCalledTimes(2);
});

test('Stopping a stopped metronome does nothing', () => {
  const onStop = jest.fn();
  metronome.on('stop', onStop);
  metronome.stop();
  expect(onStop).not.toHaveBeenCalled();
});

test('Starting a running metronome does nothing', () => {
  try {
    const onStart = jest.fn();
    metronome.on('start', onStart);
    metronome.start();
    metronome.start();
    expect(onStart).toHaveBeenCalledTimes(1);
  } finally {
    metronome.stop();
  }
});

test('Can\'t set BPM to a non-number', () => {
  expect(() => {
    metronome.bpm = 'not a number';
  }).toThrow(TypeError);
});

test('Can\'t set BPM to a number less than 1', () => {
  expect(() => {
    metronome.bpm = 0;
  }).toThrow(RangeError);
});

test('Changing the BPM while stopped does not start the Metronome or emit any events', () => {
  const onAny = jest.fn();
  metronome.on('start', onAny);
  metronome.on('tick', onAny);
  metronome.on('stop', onAny);
  metronome.bpm++;
  expect(metronome.running).toBe(false);
  expect(onAny).not.toHaveBeenCalled();
});

test('Setting the BPM to the same value while running does not restart the Metronome', () => {
  const onStart = jest.fn();
  const onStop = jest.fn();
  metronome.on('start', onStart);
  metronome.on('stop', onStop);
  metronome.start();

  try {
    metronome.bpm = metronome.bpm;
    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onStop).not.toHaveBeenCalled();
  } finally {
    metronome.stop();
  }
});

test('Changing the BPM while running stops and restarts the metronome', () => {
  const onStart = jest.fn();
  const onStop = jest.fn();
  metronome.on('start', onStart);
  metronome.on('stop', onStop);
  metronome.start();

  try {
    metronome.bpm++;
    expect(onStop).toHaveBeenCalled();
    expect(onStart).toHaveBeenLastCalledWith(metronome.bpm);
  } finally {
    metronome.stop();
  }
});
