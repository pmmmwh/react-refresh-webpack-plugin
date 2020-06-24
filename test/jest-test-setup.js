/**
 * Skips a test conditionally.
 * @param {boolean} condition The condition to skip the test.
 * @param {string} testName The name of the test.
 * @param {import('@jest/types').Global.TestFn} fn The test function.
 * @param {number} [timeout] The time to wait before aborting.
 * @return {void|*}
 */
test.skipIf = (condition, testName, fn, timeout) => {
  if (condition) {
    return test.skip(testName, fn);
  }
  return test(testName, fn, timeout);
};

it.skipIf = test.skipIf;
