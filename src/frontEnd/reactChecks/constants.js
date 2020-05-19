const { createObject } = require('../../utils');

module.exports.reactMetrics = createObject(['REDUX_RECOMPOSE', 'INDEX_LINES', 'LAYOUT_LINES', 'I18N']);

module.exports.limits = {
  lines: 150
};
