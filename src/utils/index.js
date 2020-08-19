const { readdirSync, readFileSync } = require('fs');

const percentage = 100;

const removeComments = match => match.line.filter(line => line.substring(0, 2) !== '//');

exports.createObject = keyArray => keyArray.reduce((acc, key) => ({ ...acc, [key]: key }), {});

exports.analyzeMatches = matches => Object.keys(matches).filter(key => removeComments(matches[key]).length);

exports.calculatePercentage = (results, total, skipComments = false) => {
  const filesCount = skipComments ? Object.keys(results).length : this.analyzeMatches(results).length;
  return (filesCount / total) * percentage;
};

exports.fetchJSON = filePath => JSON.parse(readFileSync(filePath));

exports.getDirectories = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
