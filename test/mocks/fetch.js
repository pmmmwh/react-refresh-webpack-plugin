/** @type {Set<function(): void>} */
const cleanupHandlers = new Set();
afterEach(() => {
  [...cleanupHandlers].map((callback) => callback());
});

const mockFetch = () => {
  const originalFetch = global.fetch;

  const fetchMock = new Function();
  global.fetch = fetchMock;

  function mockRestore() {
    global.fetch = originalFetch;
  }

  cleanupHandlers.add(mockRestore);

  return [fetchMock, mockRestore];
};

module.exports = mockFetch;
