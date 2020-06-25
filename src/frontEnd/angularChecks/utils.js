const path = require('path');
const { findSync } = require('find-in-files');
const { TRACK_BY_REGEX } = require('./constants');

module.exports.checkTrackByUse = async testPath => {
  const result = await findSync('ngFor', path.join(testPath, 'src/app'), 'component.html$');
  return Object.values(result).every(({ line }) => TRACK_BY_REGEX.test(line));
};

module.exports.checkPurePipes = async testPath => {
  const pipesFound = await findSync('\n', path.join(testPath, 'src'), 'pipe.ts$');
  const result = Object.values(pipesFound);
  return result.length
    ? result.every(({ line: file }) => file.some(line => line.includes('pure: true')))
    : true;
};
