import { Compiler } from 'webpack';
import createRefreshTemplate from './helpers/createRefreshTemplate';
import injectRefreshEntry from './helpers/injectRefreshEntry';

export class ReactRefreshPlugin {
  public apply(compiler: Compiler): void {
    // Skip processing on production mode
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    // Inject react-refresh context to all webpack entry points
    compiler.options.entry = injectRefreshEntry(compiler.options.entry);

    compiler.hooks.normalModuleFactory.tap(this.constructor.name, nmf => {
      nmf.hooks.afterResolve.tap(this.constructor.name, data => {
        // Inject refresh loader to all JavaScript-like files
        if (
          // TODO: Remove this line on publish
          !/dist/.test(data.resource) &&
          (/\.[jt]sx?$/.test(data.resource) || /^javascript/.test(data.type)) &&
          !/node_modules/.test(data.resource)
        ) {
          console.log(data.resource);
          data.loaders.unshift({
            loader: require.resolve('./loaders'),
          });
        }

        return data;
      });
    });

    compiler.hooks.compilation.tap(this.constructor.name, compilation => {
      // @ts-ignore
      // The types are missing this hook
      compilation.mainTemplate.hooks.require.tap(
        this.constructor.name,
        createRefreshTemplate
      );
    });
  }
}

export default ReactRefreshPlugin;
