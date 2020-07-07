/** @type {Set<function(): void>} */
const cleanupHandlers = new Set();
afterEach(() => {
  [...cleanupHandlers].map((callback) => callback());
});

const location = (href) => {
  const originalLocation = global.window.location;

  delete global.window.location;
  global.window.location = new URL(href);

  function mockRestore() {
    global.window.location = originalLocation;
  }

  cleanupHandlers.add(mockRestore);

  return {
    mockRestore,
  };
};

module.exports = location;
