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
  ],
  plugins: [
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        presetConfig: {
          types: [
            { type: 'feat', section: 'Features' },
            { type: 'fix', section: 'Bug Fixes' },
            { type: 'perf', section: 'Performance Improvements' },
            { type: 'revert', section: 'Reverts' },
            { type: 'docs', section: 'Documentation' },
            { type: 'style', section: 'Styles' },
            { type: 'chore', section: 'Miscellaneous Chores' },
            { type: 'refactor', section: 'Code Refactoring' },
            { type: 'test', section: 'Tests' },
            { type: 'build', section: 'Build System' },
            { type: 'ci', section: 'Continuous Integration' },
          ],
        },
      },
    ],
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
