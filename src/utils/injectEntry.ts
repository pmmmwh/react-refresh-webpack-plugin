import { Entry, EntryFunc } from 'webpack';

type StaticEntry = string | string[] | Entry;
type WebpackEntry = StaticEntry | EntryFunc;

const injectEntry = (originalEntry?: WebpackEntry): WebpackEntry => {
  const ReactRefreshEntry = require.resolve('./ReactRefreshEntry');

  // Single string entry point
  if (typeof originalEntry === 'string') {
    return [ReactRefreshEntry, originalEntry];
  }
  // Single array entry point
  if (Array.isArray(originalEntry)) {
    return [ReactRefreshEntry, ...originalEntry];
  }
  // Multiple entry points
  if (typeof originalEntry === 'object') {
    return Object.entries(originalEntry).reduce(
      (acc, [curKey, curEntry]) => ({
        ...acc,
        [curKey]: injectEntry(curEntry),
      }),
      {}
    );
  }
  // Dynamic entry points
  if (typeof originalEntry === 'function') {
    return async (...args: Parameters<typeof originalEntry>) => {
      const resolvedEntry = await originalEntry(...args);
      return injectEntry(resolvedEntry) as StaticEntry;
    };
  }

  throw new Error('Failed to parse the webpack `entry` object!');
};

export default injectEntry;
