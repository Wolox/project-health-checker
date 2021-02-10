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
              pattern,
              dismissesStaleReviews
            }
          }
        }
        pullRequests(first: 100) {
          edges {
            node {
              closedAt,
              createdAt,
              merged,
              reviews(first: 30) {
                edges {
                  node {
                    state,
                    createdAt
                  }
                }
              }
            }
          }
        }
      }}`
});

const prToMasterQuery = (repository, organization) => ({
  query: `{
      repository(owner:"${organization}", name:"${repository}") {
        pullRequests(baseRefName: "master", first: 100) {
          edges {
            node {
              baseRefName
            }
          }
        }
        releases(first: 100) {
          edges {
            node {
              tagName
            }
          }
        }
      }
    }`
});

exports.getRepositoryInfo = (repository, organization) =>
  axios.post(API, repositoryInfoQuery(repository, organization), config);

exports.getReleaseInfo = (repository, organization) =>
  axios.post(API, prToMasterQuery(repository, organization), config);
