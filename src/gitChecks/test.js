const { hasBaseBranches } = require('./index');
const { hasLowPRRebound } = require('./index');
const { hasBranchProtectionRules } = require('./index');

test('Expect to have required branches', () =>
  hasBaseBranches('Wolox', 'carvi-wolox').then(resp => {
    expect(resp).toBeTruthy();
  }));

test('Has low amount of rebounds', () =>
  hasLowPRRebound().then(rebounds => {
    expect(Number(rebounds)).toBe(14.61);
  }));

test('Has branch protection rules', () =>
  hasBranchProtectionRules().then(has => {
    expect(has).toBeTruthy();
  }));
