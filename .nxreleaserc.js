module.exports = {
  changelog: true,
  npm: false,
  github: true,
  commitMessage: 'chore(release): ${nextRelease.version} [skip ci]',
  repositoryUrl: 'https://github.com/jacobtipp/bloc-state.git',
  releaseRules: [
    { type: 'docs', scope: 'readme', release: 'patch' },
    { type: 'refactor', release: 'patch' },
    { type: 'style', release: 'patch' },
    { type: 'build', scope: 'deps', release: 'patch' },
    { type: 'revert', release: 'patch' },
    { type: 'perf', release: 'patch' },
  ],
  preset: 'conventionalcommits',
  presetConfig: {
    types: [
      { type: 'feat', section: 'Features' },
      { type: 'fix', section: 'Bug Fixes' },
      { type: 'perf', section: 'Performance Improvements' },
      { type: 'revert', section: 'Reverts' },
      { type: 'refactor', section: 'Code Refactoring' },
      { type: 'style', section: 'Styles' },
      { type: 'build', scope: 'deps', section: 'Build System' },
      { type: 'docs', scope: 'readme', section: 'Documentation' },
      { type: 'docs', section: 'Documentation', hidden: true },
      { type: 'chore', section: 'Miscellaneous Chores', hidden: true },
      { type: 'test', section: 'Tests', hidden: true },
      { type: 'ci', section: 'Continuous Integration', hidden: true },
    ],
  },
  plugins: [
    [
      '@semantic-release/npm',
      {
        npmPublish: false,
      },
    ],
  ],
  branches: [
    'main',
    {
      name: 'alpha',
      prerelease: true,
    },
    {
      name: 'beta',
      prerelease: true,
    },
    {
      name: 'rc',
      prerelease: true,
    },
    {
      name: 'fix-*',
      prerelease: true,
    },
    {
      name: 'feat-*',
      prerelease: true,
    },
  ],
};
