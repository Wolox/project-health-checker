const axios = require('axios');
const flattenDeep = require('lodash/flattenDeep');
const { API, REVIEW_STATE }  = require('../constants');

const config = {
  headers: {
    Authorization: `bearer ${process.env.OAUTH_TOKEN}`,
  }
}

const requestChangesQuery = { // Owner and name should be typed between ""
  'query':
    `{repository(owner:"Wolox", name:"tech-guides") {
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

exports.requestChangesPercentage = () =>
  axios.post(API, requestChangesQuery, config)
    .then( res => {
      const findReviews = pullRequest => pullRequest.node.reviews.edges.map(edge => edge.node)
      const pullRequests = res.data.data.repository.pullRequests.edges
      const reviews = pullRequests.map(pullRequest => findReviews(pullRequest))
      const totalReviews = flattenDeep(reviews).length
      const totalChangesRequested = flattenDeep(reviews).filter(pr => pr.state === REVIEW_STATE.CHANGES_REQUESTED).length
      console.log(`Reviews requesting changes on last 100 PRs: ${(totalChangesRequested * 100 / totalReviews).toFixed(2)}%`)
    })
    .catch( error => console.log(`ERROR: ${error.response.data.message}`));
