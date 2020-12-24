const ReactRefreshPlugin = require('../../lib');

describe('validateOptions', () => {
  it('should accept "exclude" when it is a RegExp', () => {
    expect(() => {
      new ReactRefreshPlugin({ exclude: /test/ });
    }).not.toThrow();
  });

  it('should accept "exclude" when it is an absolute path string', () => {
    expect(() => {
      new ReactRefreshPlugin({ exclude: '/test' });
    }).not.toThrow();
  });

  it('should accept "exclude" when it is a string', () => {
    expect(() => {
      new ReactRefreshPlugin({ exclude: 'test' });
    }).not.toThrow();
  });

  it('should accept "exclude" when it is an array of RegExp or strings', () => {
    expect(() => {
      new ReactRefreshPlugin({ exclude: [/test/, 'test'] });
    }).not.toThrow();
  });

  it('should reject "exclude" when it is an object', () => {
    expect(() => {
      new ReactRefreshPlugin({ exclude: {} });
    }).toThrowErrorMatchingInlineSnapshot(`
      "Invalid options object. React Refresh Plugin has been initialized using an options object that does not match the API schema.
       - options.exclude should be one of these:
         RegExp | string | [RegExp | string, ...] (should not have fewer than 1 item)
         Details:
          * options.exclude should be one of these:
            RegExp | string
            Details:
             * options.exclude should be an instance of RegExp.
             * options.exclude should be a string.
          * options.exclude should be an array:
            [RegExp | string, ...] (should not have fewer than 1 item)"
    `);
  });

  it('should accept "forceEnable" when it is true', () => {
    expect(() => {
      new ReactRefreshPlugin({ forceEnable: true });
    }).not.toThrow();
  });

  it('should accept "forceEnable" when it is false', () => {
    expect(() => {
      new ReactRefreshPlugin({ forceEnable: false });
    }).not.toThrow();
  });

  it('should reject "forceEnable" when it is not a boolean', () => {
    expect(() => {
      new ReactRefreshPlugin({ forceEnable: 1 });
    }).toThrowErrorMatchingInlineSnapshot(`
      "Invalid options object. React Refresh Plugin has been initialized using an options object that does not match the API schema.
       - options.forceEnable should be a boolean."
    `);
  });

  it('should accept "include" when it is a RegExp', () => {
    expect(() => {
      new ReactRefreshPlugin({ include: /test/ });
    }).not.toThrow();
  });

  it('should accept "include" when it is an absolute path string', () => {
    expect(() => {
      new ReactRefreshPlugin({ include: '/test' });
    }).not.toThrow();
  });

  it('should accept "include" when it is a string', () => {
    expect(() => {
      new ReactRefreshPlugin({ include: 'test' });
    }).not.toThrow();
  });

  it('should accept "include" when it is an array of RegExp or strings', () => {
    expect(() => {
      new ReactRefreshPlugin({ include: [/test/, 'test'] });
    }).not.toThrow();
  });

  it('should reject "include" when it is an object', () => {
    expect(() => {
      new ReactRefreshPlugin({ include: {} });
    }).toThrowErrorMatchingInlineSnapshot(`
      "Invalid options object. React Refresh Plugin has been initialized using an options object that does not match the API schema.
       - options.include should be one of these:
         RegExp | string | [RegExp | string, ...] (should not have fewer than 1 item)
         Details:
          * options.include should be one of these:
            RegExp | string
            Details:
             * options.include should be an instance of RegExp.
             * options.include should be a string.
          * options.include should be an array:
            [RegExp | string, ...] (should not have fewer than 1 item)"
    `);
  });

  it('should accept "library" when it is a string', () => {
    expect(() => {
      new ReactRefreshPlugin({ library: 'library' });
    }).not.toThrow();
  });

  it('should reject "library" when it is not a string', () => {
    expect(() => {
      new ReactRefreshPlugin({ library: [] });
    }).toThrowErrorMatchingInlineSnapshot(`
      "Invalid options object. React Refresh Plugin has been initialized using an options object that does not match the API schema.
       - options.library should be a string."
    `);
  });

  it('should accept "overlay" when it is true', () => {
    expect(() => {
      new ReactRefreshPlugin({ overlay: true });
    }).not.toThrow();
  });

  it('should accept "overlay" when it is false', () => {
    expect(() => {
      new ReactRefreshPlugin({ overlay: false });
    }).not.toThrow();
  });

  it('should accept "overlay" when it is an empty object', () => {
    expect(() => {
      new ReactRefreshPlugin({ overlay: {} });
    }).not.toThrow();
  });

  it('should reject "overlay" when it is not a boolean nor an object', () => {
    expect(() => {
      new ReactRefreshPlugin({ overlay: 'overlay' });
    }).toThrowErrorMatchingInlineSnapshot(`
      "Invalid options object. React Refresh Plugin has been initialized using an options object that does not match the API schema.
       - options.overlay should be one of these:
         boolean | object { entry?, module?, sockIntegration?, sockHost?, sockPath?, sockPort?, sockProtocol?, useLegacyWDSSockets?, useURLPolyfill? }
         Details:
          * options.overlay should be a boolean.
          * options.overlay should be an object:
            object { entry?, module?, sockIntegration?, sockHost?, sockPath?, sockPort?, sockProtocol?, useLegacyWDSSockets?, useURLPolyfill? }"
    `);
  });

  it('should accept "overlay.entry" when it is an absolute path string', () => {
    expect(() => {
      new ReactRefreshPlugin({
        overlay: { entry: '/test' },
      });
    }).not.toThrow();
  });

  it('should accept "overlay.entry" when it is a string', () => {
    expect(() => {
      new ReactRefreshPlugin({
        overlay: { entry: 'test' },
      });
    }).not.toThrow();
  });

  it('should accept "overlay.entry" when it is false', () => {
    expect(() => {
      new ReactRefreshPlugin({
        overlay: { entry: false },
      });
    }).not.toThrow();
  });

  it('should reject "overlay.entry" when it is not a string nor false', () => {
    expect(() => {
      new ReactRefreshPlugin({
        overlay: { entry: true },
      });
    }).toThrowErrorMatchingInlineSnapshot(`
      "Invalid options object. React Refresh Plugin has been initialized using an options object that does not match the API schema.
       - options.overlay should be one of these:
         boolean | object { entry?, module?, sockIntegration?, sockHost?, sockPath?, sockPort?, sockProtocol?, useLegacyWDSSockets?, useURLPolyfill? }
         Details:
          * options.overlay.entry should be one of these:
            false | string
            Details:
             * options.overlay.entry should be equal to constant false.
             * options.overlay.entry should be a string."
    `);
  });

  it('should accept "overlay.module" when it is an absolute path string', () => {
    expect(() => {
      new ReactRefreshPlugin({
        overlay: { module: '/test' },
      });
    }).not.toThrow();
  });

  it('should accept "overlay.module" when it is a string', () => {
    expect(() => {
      new ReactRefreshPlugin({
        overlay: { module: 'test' },
      });
    }).not.toThrow();
  });

  it('should accept "overlay.module" when it is false', () => {
    expect(() => {
      new ReactRefreshPlugin({
        overlay: { module: false },
      });
    }).not.toThrow();
  });

  it('should reject "overlay.module" when it is not a string nor false', () => {
    expect(() => {
      new ReactRefreshPlugin({
        overlay: { module: true },
      });
    }).toThrowErrorMatchingInlineSnapshot(`
      "Invalid options object. React Refresh Plugin has been initialized using an options object that does not match the API schema.
       - options.overlay should be one of these:
         boolean | object { entry?, module?, sockIntegration?, sockHost?, sockPath?, sockPort?, sockProtocol?, useLegacyWDSSockets?, useURLPolyfill? }
         Details:
          * options.overlay.module should be one of these:
            false | string
            Details:
             * options.overlay.module should be equal to constant false.
             * options.overlay.module should be a string."
    `);
  });

  it('should accept "overlay.sockIntegration" when it is "wds"', () => {
    expect(() => {
      new ReactRefreshPlugin({
        overlay: { sockIntegration: 'wds' },
      });
    }).not.toThrow();
  });

  it('should accept "overlay.sockIntegration" when it is "whm"', () => {
    expect(() => {
      new ReactRefreshPlugin({
        overlay: { sockIntegration: 'whm' },
      });
    }).not.toThrow();
  });

  it('should accept "overlay.sockIntegration" when it is "wps"', () => {
    expect(() => {
      new ReactRefreshPlugin({
        overlay: { sockIntegration: 'wps' },
      });
    }).not.toThrow();
  });

  it('should accept "overlay.sockIntegration" when it is an absolute path string', () => {
    expect(() => {
      new ReactRefreshPlugin({
        overlay: { sockIntegration: '/test' },
      });
    }).not.toThrow();
  });

  it('should accept "overlay.sockIntegration" when it is a string', () => {
    expect(() => {
      new ReactRefreshPlugin({
        overlay: { sockIntegration: 'test' },
      });
    }).not.toThrow();
  });

  it('should accept "overlay.sockIntegration" when it is false', () => {
    expect(() => {
      new ReactRefreshPlugin({
        overlay: { sockIntegration: false },
      });
    }).not.toThrow();
  });

  it('should reject "overlay.sockIntegration" when it is not a string nor false', () => {
    expect(() => {
      new ReactRefreshPlugin({
        overlay: { sockIntegration: true },
      });
    }).toThrowErrorMatchingInlineSnapshot(`
      "Invalid options object. React Refresh Plugin has been initialized using an options object that does not match the API schema.
       - options.overlay should be one of these:
         boolean | object { entry?, module?, sockIntegration?, sockHost?, sockPath?, sockPort?, sockProtocol?, useLegacyWDSSockets?, useURLPolyfill? }
         Details:
          * options.overlay.sockIntegration should be one of these:
            false | \\"wds\\" | \\"whm\\" | \\"wps\\" | string
            Details:
             * options.overlay.sockIntegration should be equal to constant false.
             * options.overlay.sockIntegration should be one of these:
               \\"wds\\" | \\"whm\\" | \\"wps\\"
             * options.overlay.sockIntegration should be a string."
    `);
  });

  it('should accept "overlay.sockHost" when it is a string', () => {
    expect(() => {
      new ReactRefreshPlugin({
        overlay: { sockHost: 'test' },
      });
    }).not.toThrow();
  });

  it('should reject "overlay.sockHost" when it is not a string', () => {
    expect(() => {
      new ReactRefreshPlugin({
        overlay: { sockHost: true },
      });
    }).toThrowErrorMatchingInlineSnapshot(`
      "Invalid options object. React Refresh Plugin has been initialized using an options object that does not match the API schema.
       - options.overlay.sockHost should be a string."
    `);
  });

  it('should accept "overlay.sockPath" when it is a string', () => {
    expect(() => {
      new ReactRefreshPlugin({
        overlay: { sockPath: 'test' },
      });
    }).not.toThrow();
  });

  it('should reject "overlay.sockPath" when it is not a string', () => {
    expect(() => {
      new ReactRefreshPlugin({
        overlay: { sockPath: true },
      });
    }).toThrowErrorMatchingInlineSnapshot(`
      "Invalid options object. React Refresh Plugin has been initialized using an options object that does not match the API schema.
       - options.overlay.sockPath should be a string."
    `);
  });

  it('should accept "overlay.sockPort" when it is 0', () => {
    expect(() => {
      new ReactRefreshPlugin({
        overlay: { sockPort: 0 },
      });
    }).not.toThrow();
  });

  it('should accept "overlay.sockPort" when it is a positive number', () => {
    expect(() => {
      new ReactRefreshPlugin({
        overlay: { sockPort: 1 },
      });
    }).not.toThrow();
  });

  it('should reject "overlay.sockPort" when it is a negative number', () => {
    expect(() => {
      new ReactRefreshPlugin({
        overlay: { sockPort: -1 },
      });
    }).toThrowErrorMatchingInlineSnapshot(`
      "Invalid options object. React Refresh Plugin has been initialized using an options object that does not match the API schema.
       - options.overlay.sockPort should be >= 0."
    `);
  });

  it('should reject "overlay.sockPort" when it is not a number', () => {
    expect(() => {
      new ReactRefreshPlugin({
        overlay: { sockPort: '1' },
      });
    }).toThrowErrorMatchingInlineSnapshot(`
      "Invalid options object. React Refresh Plugin has been initialized using an options object that does not match the API schema.
       - options.overlay.sockPort should be a number (should be >= 0)."
    `);
  });

  it('should accept "overlay.sockProtocol" when it is "http"', () => {
    expect(() => {
      new ReactRefreshPlugin({
        overlay: { sockProtocol: 'http' },
      });
    }).not.toThrow();
  });

  it('should accept "overlay.sockProtocol" when it is "https"', () => {
    expect(() => {
      new ReactRefreshPlugin({
        overlay: { sockProtocol: 'https' },
      });
    }).not.toThrow();
  });

  it('should reject "overlay.sockProtocol" when it is not "http", "https", "ws" nor "wss"', () => {
    expect(() => {
      new ReactRefreshPlugin({
        overlay: { sockProtocol: true },
      });
    }).toThrowErrorMatchingInlineSnapshot(`
      "Invalid options object. React Refresh Plugin has been initialized using an options object that does not match the API schema.
       - options.overlay.sockProtocol should be one of these:
         \\"http\\" | \\"https\\" | \\"ws\\" | \\"wss\\""
    `);
  });

  it('should accept "overlay.useLegacyWDSSockets" when it is true', () => {
    expect(() => {
      new ReactRefreshPlugin({
        overlay: { useLegacyWDSSockets: true },
      });
    }).not.toThrow();
  });

  it('should accept "overlay.useLegacyWDSSockets" when it is false', () => {
    expect(() => {
      new ReactRefreshPlugin({
        overlay: { useLegacyWDSSockets: false },
      });
    }).not.toThrow();
  });

  it('should reject "overlay.useLegacyWDSSockets" when it is not a boolean', () => {
    expect(() => {
      new ReactRefreshPlugin({
        overlay: { useLegacyWDSSockets: 1 },
      });
    }).toThrowErrorMatchingInlineSnapshot(`
      "Invalid options object. React Refresh Plugin has been initialized using an options object that does not match the API schema.
       - options.overlay.useLegacyWDSSockets should be a boolean."
    `);
  });

  it('should reject any unknown options', () => {
    expect(() => {
      new ReactRefreshPlugin({ unknown: true });
    }).toThrowErrorMatchingInlineSnapshot(`
      "Invalid options object. React Refresh Plugin has been initialized using an options object that does not match the API schema.
       - options has an unknown property 'unknown'. These properties are valid:
         object { exclude?, forceEnable?, include?, library?, overlay? }"
    `);
  });
});
