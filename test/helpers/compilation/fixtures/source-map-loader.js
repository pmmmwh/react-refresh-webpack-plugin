module.exports = function sourceMapLoader(source) {
  const callback = this.async();
  callback(null, source, this.query.sourceMap);
};
