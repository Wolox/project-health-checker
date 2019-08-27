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

module.exports.DOCKERFILE_ATTRIBUTES = ['FROM', 'WORKDIR', 'COPY', 'RUN', 'ENV', 'WORKDIR'];

module.exports.aliasPathRegex = alias => new RegExp(`^./src/.*/*${alias.substring(1)}$`);
