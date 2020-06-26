const fs = require('fs');
const shell = require('shelljs');

const percentage = 100;

const CLOC_TECH_LANGS = {
  angular: 'TypeScript,HTML'
};

const removeComments = match => match.line.filter(line => line.substring(0, 2) !== '//');

exports.createObject = keyArray => keyArray.reduce((acc, key) => ({ ...acc, [key]: key }), {});

exports.analyzeMatches = matches => Object.keys(matches).filter(key => removeComments(matches[key]).length);

exports.calculatePercentage = (results, total, skipComments = false) => {
  const filesCount = skipComments ? Object.keys(results).length : this.analyzeMatches(results).length;
  return (filesCount / total) * percentage;
};

exports.fetchJSON = filePath => JSON.parse(fs.readFileSync(filePath));

exports.getClocReport = (dirPath, tech) => {
  const clocCommand = `npm run cloc -- ${dirPath} --by-file --include-lang=${CLOC_TECH_LANGS[tech]} --json --out=./src/reports/cloc-report-${tech}.json`;
  shell.exec(clocCommand);
  return require(`../reports/cloc-report-${tech}.json`);
};
