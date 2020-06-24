const path = require('path');
const fs = require('fs');
const { findSync } = require('find-in-files');
const { TRACK_BY_REGEX, DOM_MUTATION_REGEX } = require('./constants');

module.exports.checkTrackByUse = async testPath => {
  const result = await findSync('ngFor', path.join(testPath, 'src/app'), 'component.html$');
  return Object.values(result).every(({ line }) => TRACK_BY_REGEX.test(line));
};

module.exports.checkRenderer2Use = async testPath => {
  const result = await findSync(DOM_MUTATION_REGEX, path.join(testPath, 'src/app'), 'component.ts$');
  const filesWithDomMutation = Object.keys(result).filter(key => result[key].line);
  console.log('asdfasdf', filesWithDomMutation);
  return filesWithDomMutation.every(filepath =>
    fs
      .readFileSync(filepath)
      .toString()
      .includes('Renderer2')
  );
};
