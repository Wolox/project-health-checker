require('dotenv').config();
const parseArgs = require('minimist');
const rimraf = require('rimraf');

const runEnvChecks = require('./src/envChecks');
const runGeneralChecks = require('./src/generalChecks');
const runGitChecks = require('./src/gitChecks');
const runSeoChecks = require('./src/seoChecks');
const { green } = require('./src/constants/colors');

const shell = require('shelljs');
const techs = {
  react: require('./src/reactChecks'),
  angular: require('./src/angularChecks'),
  vue: require('./src/vueChecks')
};
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvWriter = createCsvWriter({
  path: './reports/test.csv',
  header: [
    { id: 'metric', title: 'METRICA' },
    { id: 'description', title: 'DESCRIPCION' },
    { id: 'value', title: 'RESULTADO' }
  ]
});

shell.config.silent = true;

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
  let gitData = [];
  let envData = [];
  let generalData = [];
  const seoData = [];
  let techData = [];
  if (args.onlyGit) {
    gitData = await runGitChecks(repoName, organization);
  } else {
    envData = await runEnvChecks(testPath);
    generalData = await runGeneralChecks(testPath);
    gitData = await runGitChecks(repoName, organization);
    runSeoChecks(seoLink);
    techData = await techs[techChecks](testPath);
  }
  return { envData, generalData, gitData, techData, seoData };
}

async function executeAudit() {
  const { envData, generalData, gitData, techData, seoData } = await executeChecks();
  const seconds = 1000;
  shell.exec(`npm i --prefix ./${testPath}`);
  const start = new Date();
  shell.exec(`npm run build development --prefix ./${testPath}`);
  const buildTime = (new Date().getTime() - start.getTime()) / seconds;
  console.log(green, `Tiempo de build: ${buildTime}`);
  csvWriter.writeRecords([
    { metric: 'Build', description: 'Build Time', value: buildTime },
    ...gitData,
    ...envData,
    ...generalData,
    ...seoData,
    ...techData
  ]);
  rimraf.sync(`./${testPath}/node_modules`);
  rimraf.sync(`./${testPath}/build`);
}

executeAudit();
