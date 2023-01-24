
module.exports = {
  changelog: true,
  npm: true,
  github: true,
  repositoryUrl: 'https://github.com/jacobtipp/bloc-state.git',
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
      name: 'rc-*',
      prerelease: true,
    },
  ],
};
