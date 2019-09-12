# Project Health Checker

[![FEArmy](./assets/FEA_open_source_sm.png)](https://github.com/orgs/Wolox/teams/front-end-army/members)

## Summary

The objective of this package is to analyze, check and inform the health of different front-end projects regarding the use of good practices on the code, SEO, project and repository configurations depending on the technology being used on it.

---

## Usage

Once positioned on the root directory of the project run the following command:

>`node index.js`


#### Parameters

|<div style="width:250px">Parameter</div>|Description|If omitted|
|---|---|---|
|`-p [relativePath/to/project]`|Indicates the path to the project to check|The checks will be run against everything inside */test* directory.|
| `-t [angular/react/vue]`|Choose which technology checks applies to your project|Will use react as default technology|
|`-r [repository name]`|Specify the repository name on Github||
|`-o [organization name]`|Specify the organization which owns the repository||
|`--onlyGit`|If this argument is passed it will only run the checks regarding the Github repository|Will run all the checks|
|`-l`|This argument is necessary if you want to run a lighthouse audit against the project's site in any environment|Won't run the check|

---

## Notes
- This project is a WIP, given time more functionalities and checks will be added.
- Beware that the git check only works with github.

---

## About
[![Wolox](./assets/wolox_banner.png)](https://github.com/orgs/Wolox/teams/front-end-army/members)
<br>
This project is maintained by Francisco Iglesias and Lucas Zibell and it was written by Wolox.

---

## Keywords
none



