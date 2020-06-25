const path = require('path');
const { findSync } = require('find-in-files');
const { TRACK_BY_REGEX } = require('./constants');
const fs = require('fs');

module.exports.filesHasString = async (subString, folderPath, filenamePattern) => {
  const filesFound = await findSync('\n', folderPath, filenamePattern);
  const result = Object.values(filesFound);
  return result.length ? result.every(({ line: file }) => file.some(line => line.includes(subString))) : true;
};

module.exports.checkTrackByUse = async testPath => {
  const result = await findSync('ngFor', path.join(testPath, 'src/app'), 'component.html$');
  return Object.values(result).every(({ line }) => TRACK_BY_REGEX.test(line));
};

module.exports.checkInjectable = async (screensFolder, screensPath, testPath) => {
  const screenServicesHasInjectable =
    screensFolder &&
    screensFolder.every(async screen => {
      const screenServicePath = path.join(screensPath, screen, 'services');
      if (fs.existsSync(screenServicePath)) {
        const servicesHasInjectable = await this.filesHasString(
          '@Injectable',
          screenServicePath,
          'service.ts$'
        );
        return servicesHasInjectable;
      }
      return true;
    });

  const servicesHasInjectable = await this.filesHasString(
    '@Injectable',
    path.join(testPath, 'src/app/services'),
    'service.ts$'
  );

  return servicesHasInjectable && screenServicesHasInjectable;
};
