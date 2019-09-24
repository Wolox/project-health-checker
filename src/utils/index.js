const { red, green } = require('../constants/colors');

const percentage = 100;

const removeComments = match => match.line.filter(line => line.substring(0, 2) !== '//');

const getMajor = version => version.split('.')[0].replace('^', '');

exports.analyzeMatches = matches => Object.keys(matches).filter(key => removeComments(matches[key]).length);

exports.resolveColor = (value, expected) => (value >= expected ? green : red);

exports.calculatePercentage = (results, total) =>
  // eslint-disable-next-line prettier/prettier
  (this.analyzeMatches(results).length / total * percentage).toFixed(2);

exports.sameVersion = (currentVersion, expectedVersion) =>
  getMajor(currentVersion) === getMajor(expectedVersion);

exports.assertExists = (exists, name) => {
  if (exists) {
    console.log(green, `Existe ${name}`);
  } else {
    console.error(red, 'Existe un readme');
  }
};

exports.filenameExists = filename => fs.access(`${testPath}/${filename}`, fs.F_OK, err => {
  if (err) {
    console.log(red, `No existe un archivo ${filename}`);
    return;
  }
  console.error(green, `Existe un archivo ${filename}`);
});
