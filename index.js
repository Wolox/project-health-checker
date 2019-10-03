require('dotenv').config();
const parseArgs = require('minimist');

const runEnvChecks = require('./src/envChecks');
const runGeneralChecks = require('./src/generalChecks');
const runGitChecks = require('./src/gitChecks');
const runSeoChecks = require('./src/seoChecks');
const runBuildChecks = require('./src/buildChecks');

const { green, red } = require('./src/constants/colors');
const writeSpreadSheet = require('./src/utils/writeSheet');

const techs = {
  react: require('./src/reactChecks'),
  angular: require('./src/angularChecks'),
  vue: require('./src/vueChecks')
};

const args = parseArgs(process.argv);

let testPath = 'test';
let techChecks = 'react';
let organization = 'Wolox';
let seoLink = undefined;

if (args.path) {
  testPath = args.path;
} else if (args.p) {
  testPath = args.p;
}

if (args.link) {
  seoLink = args.link;
} else if (args.l) {
  seoLink = args.l;
}

if (args.tech) {
  techChecks = args.tech;
} else if (args.t) {
  techChecks = args.t;
}

let repoName = testPath;

if (args.repository) {
  repoName = args.repository;
} else if (args.r) {
  repoName = args.r;
}

if (args.org) {
  organization = args.org;
} else if (args.o) {
  organization = args.o;
}

async function executeChecks() {
  let seoData = [];
  let gitData = [];
  let envData = [];
  let generalData = [];
  let techData = [];
  let buildData = [];
  if (seoLink) {
    seoData = await runSeoChecks(seoLink);
    console.log(green, 'Chequeos de SEO terminados con exito ✓');
  } else {
    console.log(red, 'No se paso una url para revisar el SEO ✓');
  }
  envData = await runEnvChecks(testPath);
  console.log(green, 'Chequeos de env terminados con exito ✓');
  generalData = await runGeneralChecks(testPath);
  console.log(green, 'Chequeos generales terminados con exito ✓');
  gitData = await runGitChecks(repoName, organization);
  console.log(green, 'Chequeos de github terminados con exito ✓');
  techData = await techs[techChecks](testPath);
  console.log(green, 'Chequeos de tecnologia terminados con exito ✓');
  buildData = runBuildChecks(testPath);
  return [...seoData, ...envData, ...generalData, ...gitData, ...techData, ...buildData];
}

async function executeAudit() {
  const reports = await executeChecks();
  console.log(green, 'Chequeos terminados con exito ✓');
  console.log(green, 'Cargando Spreadsheet...');
  writeSpreadSheet(reports, testPath);
}

executeAudit();
