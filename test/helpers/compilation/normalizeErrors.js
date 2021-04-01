/**
 * @param {string} str
 * @return {string}
 */
function removeCwd(str) {
  let cwd = process.cwd();
  let result = str;

  const isWin = process.platform === 'win32';
  if (isWin) {
    cwd = cwd.replace(/\\/g, '/');
    result = result.replace(/\\/g, '/');
  }

  return result.replace(new RegExp(cwd, 'g'), '');
}

/**
 * @param {Error[]} errors
 * @return {string[]}
 */
function normalizeErrors(errors) {
  return errors.map((error) => {
    // Output nested error messages in full -
    // this is useful for checking loader validation errors, for example.
    if ('error' in error) {
      return removeCwd(error.error.message);
    }
    return removeCwd(error.message.split('\n').slice(0, 2).join('\n'));
  });
}

module.exports = normalizeErrors;
