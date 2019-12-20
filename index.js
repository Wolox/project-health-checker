require('dotenv').config();
const parseArgs = require('minimist');

const runEnvChecks = require('./src/envChecks');
const runGeneralChecks = require('./src/generalChecks');
const runGitChecks = require('./src/gitChecks');

const runBuildChecks = require('./src/buildChecks');

const { green } = require('./src/constants/colors');
const writeSpreadSheet = require('./src/utils/writeSheet');
const persistMetrics = require('./src/utils/persistMetrics');
const codeQuality = require('./src/utils/codeQuality');
const frontendChecks = require('./src/frontEnd');

const techs = {
  react: frontendChecks,
  angular: frontendChecks,
  vue: frontendChecks
};

const createSummary = {
  react: require('./src/frontEnd/reactChecks/createSummary')
};

const args = parseArgs(process.argv);

let testPath = '';
let techChecks = 'react';
let organization = 'Wolox';
let seoLink = undefined;
let enviorment = 'development';

if (args.env) {
  enviorment = args.env;
}

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

const repoName = testPath.split('/').filter(elem => elem !== '..' && elem !== '.')[0];

if (args.org) {
  organization = args.org;
} else if (args.o) {
  organization = args.o;
}

async function executeChecks() {
  let gitData = [];
  let envData = [];
  let generalData = [];
  let techData = [];
  let buildData = [];
  console.log(green, 'Comenzando auditoria...');
  envData = await runEnvChecks(testPath);
  console.log(green, 'Chequeos de env terminados con exito ✓');
  generalData = await runGeneralChecks(testPath, techChecks);
  console.log(green, 'Chequeos generales terminados con exito ✓');
  gitData = await runGitChecks(repoName, organization);
  console.log(green, 'Chequeos de github terminados con exito ✓');
  techData = await techs[techChecks](testPath, techChecks, seoLink);
  console.log(green, 'Chequeos de tecnologia terminados con exito ✓');
  buildData = await runBuildChecks(testPath);
  return [...envData, ...generalData, ...gitData, ...techData, ...buildData];
}

async function executeAudit() {
  const reports = await executeChecks();
  const reportWithSummary = createSummary[techChecks](reports);
  const reportCodeQuality = codeQuality(reportWithSummary);
  console.log(green, 'Chequeos terminados con exito ✓');
  if (args.audit) {
    console.log(green, 'Cargando Spreadsheet...');
    writeSpreadSheet(reportCodeQuality, testPath);
  } else {
    console.log(green, 'Persistiendo Metricas...');
    persistMetrics(reportCodeQuality, techChecks, enviorment, repoName);
  }
}

executeAudit();
