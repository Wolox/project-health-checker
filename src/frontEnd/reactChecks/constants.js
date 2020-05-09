const { createObject } = require('../../utils');

module.exports.reactMetrics = createObject(['REDUX_RECOMPOSE', 'INDEX_LINES', 'LAYOUT_LINES']);

module.exports.limits = {
  lines: 150
};
