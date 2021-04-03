/** @type {Set<function(): void>} */
const cleanupHandlers = new Set();
afterEach(() => {
  [...cleanupHandlers].map((callback) => callback());
});

const mockLocation = (href) => {
  const originalLocation = global.window.location;

  delete global.window.location;
  const locationMock = new URL(href);
  global.window.location = locationMock;

  function mockRestore() {
    global.window.location = originalLocation;
  }

  cleanupHandlers.add(mockRestore);

  return [locationMock, mockRestore];
};

export default mockLocation;
