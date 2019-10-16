const { createObject } = require('../utils');

module.exports.BASE_ALIASES = [
  '@components',
  '@utils',
  '@services',
  '@config',
  '@redux',
  '@constants',
  '@assets',
  '@screens'
];

module.exports.generalMetrics = createObject(['FOLDER_STRUCTURE', 'BABEL_IMPORTS']);

module.exports.DOCKERFILE_ATTRIBUTES = ['FROM', 'WORKDIR', 'COPY', 'RUN', 'ENV', 'WORKDIR'];

module.exports.folderStructure = {
  react: ['app', 'config', 'constants', 'redux', 'scss', 'services', 'utils']
};
