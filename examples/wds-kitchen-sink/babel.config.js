module.exports = api => {
  // This caches the Babel config
  api.cache.using(() => process.env.NODE_ENV);
  return {
    presets: ['@babel/preset-env', '@babel/preset-react'],
    // Applies the react-refresh Babel plugin on development mode only
    ...(api.env('development') && { plugins: ['react-refresh/babel'] }),
  };
};
