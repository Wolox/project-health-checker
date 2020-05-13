const { createObject } = require('../../utils');

module.exports.vueMetrics = createObject(['USE_CLI_SERVICE', 'SCOPED_STYLES', 'VUE_TEMPLATE', 'USE_VUEX']);

module.exports.VUE_BUILD_SCRIPT_REGEX = /^vue-cli-service build/;
