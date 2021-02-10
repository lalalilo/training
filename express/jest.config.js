module.exports = {
  roots: ['<rootDir>/src'],
  modulePaths: ['<rootDir>'],
  moduleDirectories: ['node_modules'],
  transform: {
    '^.+\\.tsx?$': '@swc-node/jest',
  },
  testMatch: ['**/?(*.)+(test).(js|ts)?(x)'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
};
