module.exports = results => {
  const errorCount = results.reduce((_errorCount, report) => _errorCount + report.errorCount, 0);

  return `Your code have ${errorCount} ${errorCount === 1 ? 'error' : 'errors'}`;
};
