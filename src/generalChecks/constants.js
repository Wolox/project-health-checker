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

module.exports.generalMetrics = createObject([
  'README',
  'BABEL',
  'CODE_OWNERS',
  'FOLDER_STRUCTURE',
  'BABEL_IMPORTS',
  'CODE_QUALITY'
]);

module.exports.DOCKERFILE_ATTRIBUTES = ['FROM', 'WORKDIR', 'COPY', 'RUN', 'ENV', 'WORKDIR'];

module.exports.folderStructure = {
  react: ['app', 'config', 'constants', 'redux', 'scss', 'services', 'utils'],
  vue: ['components', 'config', 'constants', 'scss', 'services', 'store', 'utils', 'views'],
  nuxt: [
    'assets',
    'components',
    'config',
    'constants',
    'layouts',
    'locales',
    'middleware',
    'pages',
    'plugins',
    'services',
    'store'
  ]
};

module.exports.rootPath = {
  react: 'src',
  vue: 'src',
  nuxt: ''
};
