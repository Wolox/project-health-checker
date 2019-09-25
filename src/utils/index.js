const { red, green } = require('../constants/colors');

const percentage = 100;

const removeComments = match => match.line.filter(line => line.substring(0, 2) !== '//');

exports.analyzeMatches = matches => Object.keys(matches).filter(key => removeComments(matches[key]).length);

exports.resolveColor = (value, expected) => (value >= expected ? green : red);

exports.calculatePercentage = (results, total) =>
  // eslint-disable-next-line prettier/prettier
  (this.analyzeMatches(results).length / total * percentage).toFixed(2);


exports.assertExists = (exists, name) => {
  if (exists) {
    console.log(green, `Existe ${name}`);
  } else {
    console.error(red, 'Existe un readme');
  }
};
