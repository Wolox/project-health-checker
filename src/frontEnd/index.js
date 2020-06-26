const { green, red } = require('../constants/colors');
const runSeoChecks = require('./seoChecks');

const techs = {
  react: require('./reactChecks'),
  angular: require('./angularChecks'),
  vue: require('./vueChecks'),
  nuxt: require('./nuxtChecks')
};

module.exports = async (testPath, tech, seoLink) => {
  let seoData = [];
  let specificTechData = [];
  if (seoLink) {
    seoData = await runSeoChecks(seoLink);
    console.log(green, 'Chequeos de SEO terminados con exito ✓');
  } else {
    console.log(red, 'No se paso una url para revisar el SEO ✓');
  }
  specificTechData = await techs[tech](testPath);
  return [...seoData, ...specificTechData];
};
