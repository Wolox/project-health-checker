const axios = require('axios');

const GITLAB_API = 'https://gitlab.com/api/graphql';

const config = {
  headers: {
    Authorization: `Bearer ${process.env.GITLAB_OAUTH_TOKEN}`
  }
};

const repositoryInfoQuery = (repository, namespace) => ({
  query: `
    {
      project(fullPath: "${namespace}/${repository}") {
        mergeRequests(last: 100) {
          edges {
            node {
              createdAt,
              mergedAt,
              state,
              discussions(first: 30) {
                edges {
                  node {
                    createdAt
                  }
                }
              }
            }
          }
        }
      }
    }`
});

exports.getRepositoryInfo = repository => axios.post(GITLAB_API, repositoryInfoQuery(repository), config);
