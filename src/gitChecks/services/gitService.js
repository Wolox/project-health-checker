/* eslint-disable no-console */
const axios = require('axios');
const { API } = require('../constants');

const config = {
  headers: {
    Authorization: `Bearer ${process.env.OAUTH_TOKEN}`
  }
};

// Owner and name should be typed between ""
const repositoryInfoQuery = (repository, organization) => ({
  query: `{
        repository(owner:"${organization}", name:"${repository}") {
         refs(refPrefix: "refs/heads/", first: 100) {
          edges {
            node {
              name
            }
          }
        }
         branchProtectionRules(first: 10) {
          edges {
            node {
              requiresApprovingReviews,
              pattern
            }
          }
        }
        pullRequests(first: 100) {
          edges {
            node {
              reviews(first: 30) {
                edges {
                  node {
                    state
                  }
                }
              }
            }
          }
        }
      }}`
});

module.exports = (repository, organization) =>
  axios.post(API, repositoryInfoQuery(repository, organization), config);
