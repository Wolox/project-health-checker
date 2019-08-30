const fs = require('fs');

const nodeContentRegex = /node\s*{([^}]+)}/;
const quotesContentRegex = /['"](.*?)['"]/;

const getValidLines = text => {
  const lines = text.split(/\n\s*/);
  return lines.filter(line => line).map(line => line.trim());
}

const getNodeScripts = fileContent => {
  const nodeScriptContent = fileContent.match(nodeContentRegex)[1];
  const nodeScriptLines = getValidLines(nodeScriptContent);
  return nodeScriptLines;
}

module.exports.validateJenkinsFileContent = (fileContent, testPath) => {
  const validations = {
    woloxCiImport: false,
    checkoutConfig: false,
    woloxCiValidPath: false,
  }
  validations.woloxCiImport = !!fileContent.match(/@Library\s*\('wolox-ci'\)/) ;
  getNodeScripts(fileContent).map(script => {
    if (script.includes('checkout')) {
      validations.checkoutConfig = true;
    }
    if (script.includes('woloxCi')) {
      const woloxCiPath = `${testPath}/${script.match(quotesContentRegex)[1]}`;
      validations.woloxCiValidPath = fs.existsSync(woloxCiPath);
    }
  });
  return validations;
}
