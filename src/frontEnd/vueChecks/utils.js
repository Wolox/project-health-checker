const { findSync } = require('find-in-files');

/*
  ⚠️scoped-style validation gonna be ommited when open tag is multi-line. For example:
    <style
      lang="scss"
      scoped
    >
      ...
    </style>
*/

module.exports.haveVueFilesScopedStyles = async testPath => {
  const styleTagsFound = await findSync('<style', `${testPath}/src`, '.vue$');
  return Object.values(styleTagsFound).every(({ line }) => line[0].includes('scoped'));
};

module.exports.areComponentsInVueTemplate = async testPath => {
  const badFiles = await findSync('Vue.component', `${testPath}/src`, '.js$');
  return !Object.keys(badFiles).length;
};
