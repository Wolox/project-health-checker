require('dotenv').config();
const parseArgs = require('minimist');

const runEnvChecks = require('./src/envChecks');
const runGeneralChecks = require('./src/generalChecks');
const runGitChecks = require('./src/gitChecks');
const techs = {
  react: require('./src/reactChecks'),
  angular: require('./src/angularChecks'),
  vue: require('./src/vueChecks')
};

const args = parseArgs(process.argv);

let testPath = 'test';
let techChecks = 'react';
let organization = 'Wolox';

if (args.path) {
  testPath = args.path;
} else if (args.p) {
  testPath = args.p;
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

runEnvChecks(testPath);
runGeneralChecks(testPath);
runGitChecks(repoName, organization);
techs[techChecks](testPath);
