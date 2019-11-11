/**
 * @typedef Theme
 * @property reset
 * @property black
 * @property red
 * @property green
 * @property yellow
 * @property blue
 * @property magenta
 * @property cyan
 * @property lightgrey
 * @property darkgrey
 * @property white
 */

/**
 * @type {Theme} theme
 * A collection of colors to be used by the overlay.
 * Partially adopted from Dracula.
 */
const theme = {
  reset: ['transparent', 'transparent'],
  black: '000000',
  red: 'FF6D67',
  green: '59F68D',
  yellow: 'F3F89D',
  blue: 'C9A8FA',
  magenta: 'FF92D0',
  cyan: '99ECFD',
  lightgrey: 'C7C7C7',
  darkgrey: '676767',
  white: 'FFFFFF',
};

module.exports = theme;
