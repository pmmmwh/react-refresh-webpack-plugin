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
  return errors.map((error) => removeCwd(error.toString().split('\n').slice(0, 2).join('\n')));
}

module.exports = normalizeErrors;
