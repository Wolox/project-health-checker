const colors = require('../constants/colors');

const percentage = 100;

const removeComments = match => match.line.filter(line => line.substring(0, 2) !== '//');

module.exports.analyzeMatches = matches =>
  Object.keys(matches).filter(key => removeComments(matches[key]).length);

module.exports.resolveColor = (value, expected) => (value >= expected ? colors.green : colors.red);

module.exports.calculatePercentage = (results, total) =>
  // eslint-disable-next-line prettier/prettier
  (this.analyzeMatches(results).length / total * percentage).toFixed(2);
