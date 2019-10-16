const { findSync } = require('find-in-files');

const { green, red } = require('../constants/colors');
const limits = require('../constants/limits');
const { calculatePercentage } = require('../utils');
const runSeoChecks = require('./seoChecks');
const frontendMetrics = require('./constants');

const techs = {
  react: require('./reactChecks'),
  angular: require('./angularChecks'),
  vue: require('./vueChecks')
};

let amountOfJsAppFolder = 0;

const generalFrontChecks = async testPath => {
  const frontEndData = [];
  const appResults = await findSync('', `${testPath}/src/app`, '.js$');
  amountOfJsAppFolder = Object.keys(appResults).length;

  const i18nResults = await findSync("from 'i18next*';", `${testPath}/src/app`, '.js$');
  const result = calculatePercentage(i18nResults, amountOfJsAppFolder);
  frontEndData.push({
    metric: frontendMetrics.I18N,
    description: 'Porcentaje de internacionalización',
    value: result
  });

  const layoutResults = await findSync(/\n/, testPath, 'layout.js$');
  const filteredLayout = Object.keys(layoutResults).filter(elem => layoutResults[elem].count > limits.lines);
  frontEndData.push({
    metric: frontendMetrics.LAYOUT_LINES,
    description: 'Cantidad de layouts con mas de 150 lineas',
    value: filteredLayout.length
  });

  const indexResults = await findSync(/\n/, testPath, 'index.js$');
  const filteredIndex = Object.keys(indexResults).filter(elem => indexResults[elem].count > limits.lines);
  frontEndData.push({
    metric: frontendMetrics.INDEX_LINES,
    description: 'Cantidad de index con mas de 150 lineas',
    value: filteredIndex.length
  });

  return frontEndData;
};

module.exports = async (testPath, tech, seoLink) => {
  let seoData = [];
  let generalTechData = [];
  let specificTechData = [];
  if (seoLink) {
    seoData = await runSeoChecks(seoLink);
    console.log(green, 'Chequeos de SEO terminados con exito ✓');
  } else {
    console.log(red, 'No se paso una url para revisar el SEO ✓');
  }
  generalTechData = await generalFrontChecks(testPath);
  specificTechData = await techs[tech](testPath);
  return [...seoData, ...specificTechData, ...generalTechData];
};
