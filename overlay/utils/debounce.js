/**
 * Debounce a function to delay invoking until wait (ms) have elapsed since the last invocation.
 * @param {function(...*): *} fn
 * @param {number} wait
 * @return {function(...*): void}
 */
function debounce(fn, wait) {
  /**
   * A cached setTimeout handler.
   * @type {number | undefined}
   */
  let timer;

  /**
   * @returns {void}
   */
  function debounced() {
    const context = this;
    const args = arguments;

    clearTimeout(timer);
    timer = setTimeout(function () {
      return fn.apply(context, args);
    }, wait);
  }

  return debounced;
}

module.exports = debounce;
