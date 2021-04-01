describe('validateOptions', () => {
  let getCompilation;

  beforeEach(() => {
    jest.isolateModules(() => {
      getCompilation = require('../helpers/compilation');
    });
  });

  it('should accept "const" when it is true', async () => {
    const compilation = await getCompilation('cjs', { loaderOptions: { const: true } });
    expect(compilation.errors).toStrictEqual([]);
  });

  it('should accept "const" when it is false', async () => {
    const compilation = await getCompilation('cjs', { loaderOptions: { const: false } });
    expect(compilation.errors).toStrictEqual([]);
  });

  it('should reject "const" when it is not a boolean', async () => {
    const compilation = await getCompilation('cjs', { loaderOptions: { const: 1 } });
    expect(compilation.errors).toHaveLength(1);
    expect(compilation.errors[0]).toMatchInlineSnapshot(`
      "Invalid options object. React Refresh Loader has been initialized using an options object that does not match the API schema.
       - options.const should be a boolean."
    `);
  });

  it.skipIf(WEBPACK_VERSION !== 5, 'should accept "esModule" when it is true', async () => {
    const compilation = await getCompilation('esm', {
      loaderOptions: { esModule: true },
    });
    expect(compilation.errors).toStrictEqual([]);
  });

  it('should accept "esModule" when it is false', async () => {
    const compilation = await getCompilation('cjs', {
      loaderOptions: { esModule: false },
    });
    expect(compilation.errors).toStrictEqual([]);
  });

  it('should accept "esModule" when it is undefined', async () => {
    const compilation = await getCompilation('cjs', { loaderOptions: {} });
    expect(compilation.errors).toStrictEqual([]);
  });

  it('should accept "esModule" when it is an empty object', async () => {
    const compilation = await getCompilation('cjs', { loaderOptions: { esModule: {} } });
    expect(compilation.errors).toStrictEqual([]);
  });

  it('should reject "esModule" when it is not a boolean nor an object', async () => {
    const compilation = await getCompilation('cjs', {
      loaderOptions: { esModule: 'esModule' },
    });
    expect(compilation.errors).toHaveLength(1);
    expect(compilation.errors[0]).toMatchInlineSnapshot(`
      "Invalid options object. React Refresh Loader has been initialized using an options object that does not match the API schema.
       - options.esModule should be one of these:
         boolean | object { exclude?, include? }
         Details:
          * options.esModule should be a boolean.
          * options.esModule should be an object:
            object { exclude?, include? }"
    `);
  });

  it('should accept "esModule.exclude" when it is a RegExp', async () => {
    const compilation = await getCompilation('cjs', {
      loaderOptions: { esModule: { exclude: /index\.js/ } },
    });
    expect(compilation.errors).toStrictEqual([]);
  });

  it('should accept "esModule.exclude" when it is an absolute path string', async () => {
    const compilation = await getCompilation('cjs', {
      loaderOptions: { esModule: { exclude: '/index.js' } },
    });
    expect(compilation.errors).toStrictEqual([]);
  });

  it('should accept "esModule.exclude" when it is a string', async () => {
    const compilation = await getCompilation('cjs', {
      loaderOptions: { esModule: { exclude: 'index.js' } },
    });
    expect(compilation.errors).toStrictEqual([]);
  });

  it('should accept "esModule.exclude" when it is an array of RegExp or strings', async () => {
    const compilation = await getCompilation('cjs', {
      loaderOptions: { esModule: { exclude: [/index\.js/, 'index.js'] } },
    });
    expect(compilation.errors).toStrictEqual([]);
  });

  it('should reject "esModule.exclude" when it is an object', async () => {
    const compilation = await getCompilation('cjs', {
      loaderOptions: { esModule: { exclude: {} } },
    });
    expect(compilation.errors).toHaveLength(1);
    expect(compilation.errors[0]).toMatchInlineSnapshot(`
      "Invalid options object. React Refresh Loader has been initialized using an options object that does not match the API schema.
       - options.esModule should be one of these:
         boolean | object { exclude?, include? }
         Details:
          * options.esModule.exclude should be one of these:
            RegExp | string
            Details:
             * options.esModule.exclude should be an instance of RegExp.
             * options.esModule.exclude should be a string.
          * options.esModule.exclude should be an array:
            [RegExp | string, ...] (should not have fewer than 1 item)
          * options.esModule.exclude should be one of these:
            RegExp | string | [RegExp | string, ...] (should not have fewer than 1 item)"
    `);
  });

  it.skipIf(
    WEBPACK_VERSION !== 5,
    'should accept "esModule.include" when it is a RegExp',
    async () => {
      const compilation = await getCompilation('esm', {
        loaderOptions: { esModule: { include: /index\.js/ } },
      });
      expect(compilation.errors).toStrictEqual([]);
    }
  );

  it.skipIf(
    WEBPACK_VERSION !== 5,
    'should accept "esModule.include" when it is an absolute path string',
    async () => {
      const compilation = await getCompilation('esm', {
        loaderOptions: { esModule: { include: '/index.js' } },
      });
      expect(compilation.errors).toStrictEqual([]);
    }
  );

  it.skipIf(
    WEBPACK_VERSION !== 5,
    'should accept "esModule.include" when it is a string',
    async () => {
      const compilation = await getCompilation('esm', {
        loaderOptions: { esModule: { include: 'index.js' } },
      });
      expect(compilation.errors).toStrictEqual([]);
    }
  );

  it.skipIf(
    WEBPACK_VERSION !== 5,
    'should accept "esModule.include" when it is an array of RegExp or strings',
    async () => {
      const compilation = await getCompilation('esm', {
        loaderOptions: { esModule: { include: [/index\.js/, 'index.js'] } },
      });
      expect(compilation.errors).toStrictEqual([]);
    }
  );

  it('should reject "esModule.include" when it is an object', async () => {
    const compilation = await getCompilation('esm', {
      loaderOptions: { esModule: { include: {} } },
    });
    expect(compilation.errors).toHaveLength(1);
    expect(compilation.errors[0]).toMatchInlineSnapshot(`
      "Invalid options object. React Refresh Loader has been initialized using an options object that does not match the API schema.
       - options.esModule should be one of these:
         boolean | object { exclude?, include? }
         Details:
          * options.esModule.include should be one of these:
            RegExp | string
            Details:
             * options.esModule.include should be an instance of RegExp.
             * options.esModule.include should be a string.
          * options.esModule.include should be an array:
            [RegExp | string, ...] (should not have fewer than 1 item)
          * options.esModule.include should be one of these:
            RegExp | string | [RegExp | string, ...] (should not have fewer than 1 item)"
    `);
  });

  it('should reject any unknown options', async () => {
    const compilation = await getCompilation('cjs', {
      loaderOptions: { unknown: 'unknown' },
    });
    expect(compilation.errors).toHaveLength(1);
    expect(compilation.errors[0]).toMatchInlineSnapshot(`
      "Invalid options object. React Refresh Loader has been initialized using an options object that does not match the API schema.
       - options has an unknown property 'unknown'. These properties are valid:
         object { const?, esModule? }"
    `);
  });
});
