const { hasBaseBranches, hasLowPRRebound, hasBranchProtectionRules } = require('../checks/git');

test('Expect to have required branches', () =>
  hasBaseBranches('Wolox', 'carvi-wolox').then(resp => {
    expect(resp).toBeTruthy();
  }));

test('Has low amount of rebounds', () =>
  hasLowPRRebound().then(rebounds => {
    // eslint-disable-next-line no-magic-numbers
    expect(Number(rebounds)).toBe(14.61);
  }));

test('Has branch protection rules', () =>
  hasBranchProtectionRules().then(has => {
    expect(has).toBeTruthy();
  }));
