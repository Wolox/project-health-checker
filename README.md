# Project Health Checker

[![FEArmy](./assets/FEA_open_source_sm.png)](https://github.com/orgs/Wolox/teams/front-end-army/members)

## Summary

The objective of this package is to analyze, check and inform the health of different front-end projects regarding the use of good practices on the code, SEO, project and repository configurations depending on the technology being used on it.

Running this script will inform you the general state of a project by obtaining the following metrics:

_**Project's checks:**_
- .env file exists and is needed to run the project
- Uses linter
- Uses i18n
- Framework is up to date
- Uses absolute imports
- Has a CI server
- Uses Redux Recompose
- .babelrc file exists and is used
- All the installed dependencies are being used
- Layout files do not pass 150 lines

_**Github:**_
- Have a codeowners file with at least 3 owners.
- Repository has a README.md file
- Project has a repository on Github.
- Repository doesn't have more than 15 branches (except master, stage and development)
- Modifications to *development* branch are made via pull requests
- *master* branch is protected, commits can only be merged via pull requests
- Average of requested changes on the last 100 PRs
- *development* branch is up to date
- PRs can only be merged if approved by at least 1 CR
- Every commit to master has a release

---

## Usage

Once positioned on the root directory of the project run the following command:

>`node index.js`

Note: Once the project becomes a npm package this command will change

#### Parameters

|<div style="width:300px">Parameter [Example]</div>|Description|If omitted|
|---|---|---|
|`-p --path [../path/to/project]`|Path (absolute or relative) to the project to check|The checks will be run against everything inside *./test* directory.|
|`-t --tech [angular/react/vue]`|Choose which technology checks applies to your project|Will use react as default technology|
|`-l --link [github.com]`|This argument is necessary if you want to run a lighthouse audit against the project's site in any environment|Won't run the check|
|`-b --buildScript ['build development']`| npm script name which is used to generate the project's build| The default value will be 'build'|
|`-f --requiredFiles ['file1,file2']`|Files that need to exist before building the project||

### Examples

1. Run every check except SEO checks:
    - Default technology: React
    - Default organization: Wolox
    
  `node index.js -p ../../test/`

2. Run every check with a project using VueJS

  `node index.js -p ../../vueProject/ -t vue -l vueproject-stage.com`

3. Run every check except SEO checks, specifying build script for development environment and create .env.development required file

  `node index.js -p ../../reactProject/ -b "build development" -f ".env.development"`

---

## Notes
- This project is a WIP, given time more functionalities and checks will be added.

- Beware that the **git check only works with Github** and in order to run them successfully you will need to add a .env variable called `OAUTH_TOKEN` with you Github API token in it, if this variable is not set you won't be able to run the Github checks due to missing credentials.

  If you do not already have a Github API token you can create it here https://github.com/settings/tokens

  
- Keep in mind that both repository name and organization name have to exist on Github and you need access to them, otherwise the Github API won't return any information of it.
---

## Integration with projects

- `[Only for React Projects]` Add Jest to package.json configuration:

```json
"env": {
  "jest/globals": true
},
"jest": {
  "verbose": true,
  "testURL": "http://localhost/",
  "collectCoverageFrom": [
    "src/**/*.{js,jsx}"
  ]
}
```

- Add `CI=true` to package.json test script (so it doesn't run the test in interactive mode and the script can run the tests).


- If it doesn't exist create a `jenkinsfile` on the root of the project with this content:

```groovy
@Library('wolox-ci') _
  node {
    checkout scm
    woloxCi('.woloxci/config.yml');
  }
```

### Inside .woloxci directory (create it if needed)

- Create a file called `metrics.json` which will be the settings used to run the checks, they are the same as the script parameters:

  - `link:` SEO checks will be ran against the specified development environment URL.

  - `branch:` The checks will be executed on the specified.branch after merging a PR into it.

  - `tech:` [angular|react|vue] [*Default if omitted*: react].

  - `buildScript:` Name and parameters used by the build script (without npm run) [*Default if omitted*: build].
  
  - `requiredFiles:` Files needed to build the project that are not present on the remote repository.

Example:
```json
{
  "link": "http://dev-project.com",
  "branch": "development",
  "tech": "vue",
  "buildScript": "build development",
  "requiredFiles": ".env.development,aws.js"
}
```

- Create a file called `config.yml` with the following content and replace ${repo-name} with github's repository name without "":

```yml
config:
  dockerfile: .woloxci/Dockerfile
  Project_name: ${repo-name}
steps:
  lint:
    - ln -sfn /home/node/node_modules node_modules
    - npm run lint
environment:
  GIT_COMMITTER_NAME: a
  GIT_COMMITTER_EMAIL: b
  LANG: C.UTF-8

```

- Create a file called `dockerfile` with the following content:

```dockerfile
FROM node:10.11.0-alpine
WORKDIR /home/node
COPY package.json .
RUN npm install
ENV PATH /home/node/node_modules/.bin:$PATH
WORKDIR /home/node/app
```

- Add webhook to github in order to run the script after every PR merge, using the following configuration. Ask a TL for help with this.

```
- Payload URL: **Ask a TL for this URL**

- Content Type: application/json

- Individual events: Pull requests

```

- Activate the webhook, and after it merge a PR and check with a TL if the metrics were persisted.

---
## About
[![Wolox](./assets/wolox_banner.png)](https://github.com/orgs/Wolox/teams/front-end-army/members)

This project is maintained by [Francisco Iglesias](https://github.com/FrankIglesias) and [Lucas Zibell](https://github.com/LucasZibell) and it was written by [Wolox](https://www.wolox.com.ar).

Contributors: [Francisco Iglesias](https://github.com/FrankIglesias), [Lucas Zibell](https://github.com/LucasZibell), [Martin Marussi](https://github.com/MMarussi), [Rodrigo Manuel Navarro Lajous](https://github.com/rlajous), [Carlos Hernandez](https://github.com/CarlosHWolox), [Ivan Cuadro Guzman](https://github.com/idcuadrowolox)

---

## Keywords
none
