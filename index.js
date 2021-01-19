require('dotenv').config();
const parseArgs = require('minimist');
const shell = require('shelljs');

const runEnvChecks = require('./src/envChecks');
const runGeneralChecks = require('./src/generalChecks');
const runGitChecks = require('./src/gitChecks');
const runBuildChecks = require('./src/buildChecks');
const runCrashesChecks = require('./src/crashesChecks');

const { green } = require('./src/constants/colors');
const writeSpreadSheet = require('./src/utils/writeSheet');
const persistMetrics = require('./src/utils/persistMetrics');
const codeQuality = require('./src/utils/codeQuality');
const frontendChecks = require('./src/frontEnd');

const createSummary = {
  react: require('./src/frontEnd/reactChecks/createSummary'),
  vue: require('./src/frontEnd/vueChecks/createSummary'),
  angular: require('./src/frontEnd/angularChecks/createSummary'),
  nuxt: require('./src/frontEnd/nuxtChecks/createSummary')
};

const args = parseArgs(process.argv);

let testPath = '';
let techChecks = 'react';
let organization = 'Wolox';
let seoLink = undefined;
let environment = 'development';
let buildScriptName = 'build';
let filesToCreate = undefined;
let apmProjectName = '';
let gitProvider = 'github';

if (args.env) {
  environment = args.env;
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

if (args.buildScript) {
  buildScriptName = args.buildScript;
} else if (args.b) {
  buildScriptName = args.b;
}

if (args.requiredFiles) {
  filesToCreate = args.requiredFiles;
} else if (args.f) {
  filesToCreate = args.f;
}

if (args.apm) {
  apmProjectName = args.apm;
} else if (args.a) {
  apmProjectName = args.a;
} else {
  apmProjectName = repoName;
}

if (args.gitProvider) {
  // eslint-disable-next-line prefer-destructuring
  gitProvider = args.gitProvider;
} else if (args.g) {
  gitProvider = args.g;
}

async function executeChecks() {
  let gitData = [];
  let envData = [];
  let generalData = [];
  let techData = [];
  let buildData = [];
  let crashesData = [];
  console.log(green, 'Comenzando auditoria...');
  envData = await runEnvChecks(testPath, techChecks);
  console.log(green, 'Chequeos de env terminados con exito ✓');
  generalData = await runGeneralChecks(testPath, techChecks);
  console.log(green, 'Chequeos generales terminados con exito ✓');
  gitData = await runGitChecks(gitProvider)(repoName, organization);
  console.log(green, 'Chequeos de github terminados con exito ✓');
  techData = await frontendChecks(testPath, techChecks, seoLink);
  console.log(green, 'Chequeos de tecnologia terminados con exito ✓');
  buildData = await runBuildChecks(testPath, techChecks, buildScriptName);
  crashesData = await runCrashesChecks(apmProjectName);
  return [...envData, ...generalData, ...gitData, ...techData, ...buildData, ...crashesData];
}

async function executeAudit() {
  if (filesToCreate) {
    filesToCreate.split(',').forEach(fileName => shell.exec(`touch ${testPath}/${fileName}`));
  }
  const reports = await executeChecks();
  const reportWithSummary = createSummary[techChecks](reports);
  const reportCodeQuality = codeQuality(reportWithSummary);
  console.log(green, 'Chequeos terminados con exito ✓');
  if (args.audit) {
    console.log(green, 'Cargando Spreadsheet...');
    writeSpreadSheet(reportCodeQuality, testPath);
  } else {
    console.log(green, 'Persistiendo Metricas...');
    persistMetrics(reportCodeQuality, techChecks, environment, repoName);
  }
}

executeAudit();
