const hasBaseBranches = require('./index').hasBaseBranches;
const hasLowPRRebound = require('./index').hasLowPRRebound;
const hasBranchProtectionRules = require('./index').hasBranchProtectionRules;

test('Expect to have required branches', () => {
  return hasBaseBranches('Wolox', 'carvi-wolox').then(resp => {
    expect(resp).toBe(true);
  })
});

test('Has low amount of rebounds', () => {
  return hasLowPRRebound().then(rebounds => {
    expect(Number(rebounds)).toBe(14.61);
  })
});

test('Has branch protection rules', () => {
  return hasBranchProtectionRules().then(has => {
    expect(has).toBe(true);
  })
})
