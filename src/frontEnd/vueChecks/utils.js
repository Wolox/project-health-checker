const fs = require('fs');
const path = require('path');
const { findSync } = require('find-in-files');

/*
  ⚠️Style gonna be ommited when open tag is multi-line. For example:
    <style
      lang="scss"
      scoped
    >
      ...
    </style>
*/

module.exports.haveVueFilesScopedStyles = async testPath => {
  const rootDir = `${testPath}/src`;
  const rootVueFiles = fs.readdirSync(rootDir).filter(filename => /\.vue$/.test(filename));
  const styleTagsFound = await findSync('<style', rootDir, '.vue$');

  const filtered = Object.entries(styleTagsFound).filter(([key]) => {
    const { base: filename } = path.parse(key);
    return !rootVueFiles.includes(filename);
  });

  return filtered.every(({ line }) => line[0].includes('scoped'));
};
