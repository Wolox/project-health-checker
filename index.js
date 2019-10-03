require('dotenv').config();
const rimraf = require('rimraf');
const shell = require('shelljs');
const inquirer = require('inquirer');
const fuzzyPath = require('inquirer-fuzzy-path');
const { userInfo } = require('os');

const runEnvChecks = require('./src/envChecks');
const runGeneralChecks = require('./src/generalChecks');
const runGitChecks = require('./src/gitChecks');
const runSeoChecks = require('./src/seoChecks');
const runEslintChecks = require('./src/linterChecks');
const { green } = require('./src/constants/colors');

const techs = {
  react: require('./src/reactChecks'),
  angular: require('./src/angularChecks'),
  vue: require('./src/vueChecks')
};
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

shell.config.silent = true;
shell.mkdir('./reports');

const csvWriter = createCsvWriter({
  path: './reports/test.csv',
  header: [
    { id: 'metric', title: 'METRICA' },
    { id: 'description', title: 'DESCRIPCION' },
    { id: 'value', title: 'RESULTADO' }
  ]
});

function runBuild(testPath) {
  const seconds = 1000;
  console.log(green, 'Empezando instalacion de dependencias para el build...');
  shell.exec(`npm i --prefix ./${testPath}`);
  const eslintData = runEslintChecks(testPath);
  console.log(green, 'Chequeos de eslint terminados con exito ✓');
  console.log(green, 'Generando el build...');
  const start = new Date();
  shell.exec(`npm run build development --prefix ./${testPath}`);
  const buildTime = (new Date().getTime() - start.getTime()) / seconds;
  console.log(green, 'Build terminado con exito ✓');
  rimraf.sync(`./${testPath}/node_modules`);
  rimraf.sync(`./${testPath}/build`);
  return [...eslintData, { metric: 'Build', description: 'Build Time', value: `${buildTime}` }];
}

inquirer.registerPrompt('fuzzypath', fuzzyPath);

const firstChecks = () => {
  const questions = [
    {
      name: 'PROJECT_PATH',
      type: 'fuzzypath',
      excludePath: nodePath => /(\/\.+)|(\/node_modules)|(\/src)|(\/build)/.test(nodePath),
      itemType: 'directory',
      rootPath: `/home/${userInfo().username}`,
      message: 'Path de proyecto a analizar',
      default: './test',
      suggestOnly: false,
      depthLimit: 3
    },
    {
      name: 'REPOSITORY',
      type: 'input',
      message: 'Nombre de repositorio en Github',
      default: answers => answers.PROJECT_PATH.split('/').pop()
    },
    {
      name: 'ORGANIZATION',
      type: 'input',
      message: 'Nombre de organizacion en Github',
      default: 'Wolox'
    },
    {
      name: 'ONLY_GIT',
      type: 'confirm',
      message: 'Ejecutar sólo chequeos de Git?',
      default: false
    }
  ];
  return inquirer.prompt(questions);
};

const secondChecks = () => {
  const questions = [
    {
      type: 'list',
      name: 'TECHNOLOGY',
      message: 'Framework usado',
      choices: ['Angular', 'React', 'Vue'],
      filter: val => val.toLowerCase()
    },
    {
      type: 'input',
      name: 'SEO_URL',
      message: 'URL para realizar chequeo de SEO'
    }
  ];
  return inquirer.prompt(questions);
};

async function executeChecks() {
  let gitData = [];
  let envData = [];
  let generalData = [];
  let techData = [];
  let buildData = [];
  const eslintData = [];

  console.log(
    green,
    `
     ███████████ ██████████   █████████  
    ░░███░░░░░░█░░███░░░░░█  ███░░░░░███ 
     ░███   █ ░  ░███  █ ░  ░███    ░███ 
     ░███████    ░██████    ░███████████ 
     ░███░░░█    ░███░░█    ░███░░░░░███ 
     ░███  ░     ░███ ░   █ ░███    ░███ 
     █████       ██████████ █████   █████
    ░░░░░       ░░░░░░░░░░ ░░░░░   ░░░░░ `
  );

  const { PROJECT_PATH, REPOSITORY, ORGANIZATION, ONLY_GIT } = await firstChecks();
  const testPath = PROJECT_PATH;
  const repoName = REPOSITORY || testPath.split('/').pop();
  const organization = ORGANIZATION;

  gitData = await runGitChecks(repoName, organization);
  console.log(green, 'Chequeos de github terminados con exito ✓');

  if (!ONLY_GIT) {
    const { TECHNOLOGY, SEO_URL } = await secondChecks();
    const techChecks = TECHNOLOGY || 'react';
    const seoLink = SEO_URL;
    runSeoChecks(seoLink);
    envData = await runEnvChecks(testPath);
    console.log(green, 'Chequeos de env terminados con exito ✓');
    generalData = await runGeneralChecks(testPath);
    console.log(green, 'Chequeos generales terminados con exito ✓');
    techData = await techs[techChecks](testPath);
    console.log(green, 'Chequeos de tecnologia terminados con exito ✓');
    buildData = await runBuild(testPath);
  }
  return [...envData, ...generalData, ...gitData, ...techData, ...buildData, ...eslintData];
}

async function executeAudit() {
  const reports = await executeChecks();
  csvWriter.writeRecords(reports);
  console.log(green, 'Chequeos terminados con exito ✓');
}

executeAudit();
