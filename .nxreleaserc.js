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
