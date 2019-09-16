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
- Modifications to *development* are made via pull requests
- *master* is protected, commits can only be merged via pull requests
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
|`-r --repository [repository name]`|Specify the repository name on Github||
|`-o --organization [organization name]`|Specify the organization which owns the repository|The default value will be 'Wolox'|
|`--onlyGit`|If this argument is passed it will only run the checks regarding the Github repository|Will run all the checks|
|`-l --link [github.com]`|This argument is necessary if you want to run a lighthouse audit against the project's site in any environment|Won't run the check|

### Examples

1. Run only the github's repo configuration checks.
    - Default path: ./test
    - Default organization: Wolox

  `node index.js --onlyGit`

2. Run every check except SEO checks:
    - Default technology: React
    - Default organization: Wolox
    
  `node index.js -p ../../test/`

3. Run every check with a project using VueJS

  `node index.js -p ../../vueProject/ -t vue -l vueproject-stage.com`

---

## Notes
- This project is a WIP, given time more functionalities and checks will be added.


- Beware that the **git check only works with Github** and in order to run them successfully you will need to add a .env variable called `OAUTH_TOKEN` with you Github API token in it, if this variable is not set you won't be able to run the Github checks due to missing credentials.

  If you do not already have a Github API token you can create it here https://github.com/settings/tokens

  
- Keep in mind that both repository name and organization name have to exist on Github and you need access to them, otherwise the Github API won't return any information of it.
---

## About
[![Wolox](./assets/wolox_banner.png)](https://github.com/orgs/Wolox/teams/front-end-army/members)

This project is maintained by [Francisco Iglesias](https://github.com/FrankIglesias) and [Lucas Zibell](https://github.com/LucasZibell) and it was written by [Wolox](https://www.wolox.com.ar).

Contributors: [Francisco Iglesias](https://github.com/FrankIglesias), [Lucas Zibell](https://github.com/LucasZibell), [Martin Marussi](https://github.com/MMarussi), [Rodrigo Manuel Navarro Lajous](https://github.com/rlajous), [Carlos Hernandez](https://github.com/CarlosHWolox), [Ivan Cuadro Guzman](https://github.com/idcuadrowolox)

---

## Keywords
none



