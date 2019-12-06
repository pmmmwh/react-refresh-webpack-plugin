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
 * @property white
 * @property lightgrey
 * @property darkgrey
 * @property grey
 * @property dimgrey
 */

/**
 * @type {Theme} theme
 * A collection of colors to be used by the overlay.
 * Partially adopted from Tomorrow Night Bright.
 */
const theme = {
  reset: ['transparent', 'transparent'],
  black: '000000',
  red: 'D34F56',
  green: 'B9C954',
  yellow: 'E6C452',
  blue: '7CA7D8',
  magenta: 'C299D6',
  cyan: '73BFB1',
  white: 'FFFFFF',
  lightgrey: 'C7C7C7',
  darkgrey: 'A9A9A9',
  grey: '474747',
  dimgrey: '343434',
};

module.exports = theme;
