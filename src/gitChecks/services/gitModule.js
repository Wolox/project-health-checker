const { request } = require('graphql-request');
const api = 'https://node-github-stats.herokuapp.com/graphql';

const generateGitStatsArgsString = args => {
  let stringArgs = '';
  Object.keys(args).forEach(key => {
    const auxString = `${key}: "${args[key]}"`;
    if (stringArgs === '') {
      stringArgs = stringArgs.concat(auxString);
    } else {
      stringArgs = stringArgs.concat(', ', auxString);
    }
  });
  return stringArgs;
};

const date = new Date();
const twoWeeksBefore = new Date(new Date().getTime() - 2 * 7 * 24 * 60 * 60 * 1000); //eslint-disable-line

module.exports = async repository => {
  const argsString = generateGitStatsArgsString({
    from: twoWeeksBefore.toISOString(),
    to: date.toISOString(),
    repository
  });
  const query = `query{stats {\
    pr_pick_up_time_avg(${argsString}) {\
      tech_name\
      value\
    }\
    pr_review_time_avg(${argsString}) {\
      tech_name\
      value\
    }\
  }}`;

  const response = await request(api, query);
  const pickUpTime = response.stats.pr_pick_up_time_avg[0] && response.stats.pr_pick_up_time_avg[0].value;
  const reviewTime = response.stats.pr_review_time_avg[0] && response.stats.pr_review_time_avg[0].value;

  return { pickUpTime, reviewTime };
};
