/**
 * @typedef {Object} Theme
 * @property {string} black
 * @property {string} bright-black
 * @property {string} red
 * @property {string} bright-red
 * @property {string} green
 * @property {string} bright-green
 * @property {string} yellow
 * @property {string} bright-yellow
 * @property {string} blue
 * @property {string} bright-blue
 * @property {string} magenta
 * @property {string} bright-magenta
 * @property {string} cyan
 * @property {string} bright-cyan
 * @property {string} white
 * @property {string} bright-white
 * @property {string} lightgrey
 * @property {string} darkgrey
 * @property {string} grey
 * @property {string} dimgrey
 */

/**
 * @type {Theme} theme
 * A collection of colors to be used by the overlay.
 * Partially adopted from Tomorrow Night Bright.
 */
const theme = {
  black: '#000000',
  'bright-black': '#474747',
  red: '#D34F56',
  'bright-red': '#dd787d',
  green: '#B9C954',
  'bright-green': '#c9d57b',
  yellow: '#E6C452',
  'bright-yellow': '#ecd37f',
  blue: '#7CA7D8',
  'bright-blue': '#a3c1e4',
  magenta: '#C299D6',
  'bright-magenta': '#d8bde5',
  cyan: '#73BFB1',
  'bright-cyan': '#96cfc5',
  white: '#FFFFFF',
  'bright-white': '#FFFFFF',
  background: '#474747',
  'dark-background': '#343434',
  selection: 'rgba(234, 234, 234, 0.5)',
};

module.exports = theme;
