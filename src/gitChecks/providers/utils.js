// eslint-disable-next-line no-magic-numbers
const MILLISECONDS_IN_HOURS = 1000 * 3600;

module.exports.getHoursBetween = (startDate, endDate) =>
  (new Date(endDate) - new Date(startDate)) / MILLISECONDS_IN_HOURS;
