const percentage = 100;

const removeComments = match => match.line.filter(line => line.substring(0, 2) !== '//');

exports.createObject = keyArray => keyArray.reduce((acc, key) => ({ ...acc, [key]: key }), {});

exports.analyzeMatches = matches => Object.keys(matches).filter(key => removeComments(matches[key]).length);

exports.calculatePercentage = (results, total) =>
  // eslint-disable-next-line prettier/prettier
  this.analyzeMatches(results).length / total * percentage;
