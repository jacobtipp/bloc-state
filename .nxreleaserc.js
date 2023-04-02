module.exports = {
  changelog: true,
  npm: false,
  github: true,
  commitMessage: 'chore(release): ${nextRelease.version} [skip ci]',
  repositoryUrl: 'https://github.com/jacobtipp/bloc-state.git',
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
