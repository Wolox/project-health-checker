const removeComments = match => 
  match.line.filter(line => line.substring(0,2) !== '//')

module.exports.analyzeMatches = 
  matches => Object.keys(matches).filter(key => removeComments(matches[key]).length)

