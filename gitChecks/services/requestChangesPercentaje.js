const axios = require('axios');
const flattenDeep = require('lodash/flattenDeep');

const { API, REVIEW_STATE, ERROR } = require('../constants');

const config = {
  headers: {
    Authorization: `Bearer ${process.env.OAUTH_TOKEN}`,
  }
}

const repositoryInfoQuery = (organization, repoName) => { // Owner and name should be typed between ""
  return {
    'query':
      `{
        repository(owner:"${organization}", name:"${repoName}") {
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
  }
}

exports.getRepositoryInfo = (organization, repository) => {
  return axios.post(API, repositoryInfoQuery(organization, repository), config);
}


/*
verificar en caso de que varios revieers te requesteen por los mismos rebotes.
filtrar las request de commits repetidos
*/

exports.requestChangesPercentage = (organization, repoName) =>
  axios.post(API, repositoryInfoQuery(organization, repoName), config)
    .then(res => {
      const findReviews = pullRequest => pullRequest.node.reviews.edges.map(edge => edge.node)
      const pullRequests = res.data.data.repository.pullRequests.edges
      const reviews = pullRequests.map(pullRequest => findReviews(pullRequest))
      const totalReviews = flattenDeep(reviews).length
      const totalChangesRequested = flattenDeep(reviews).filter(pr => pr.state === REVIEW_STATE.CHANGES_REQUESTED).length
      return (totalChangesRequested * 100 / totalReviews).toFixed(2);
    })
    .catch(error => {
      if (error.response) {
        console.log(`ERROR: ${error.response.data.message}`)
      } else {
        console.log(ERROR.REPO_NOT_FOUND);
      }
    })
