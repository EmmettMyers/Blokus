module.exports = {
    // Indicates which environment to use for testing
    testEnvironment: 'node',

    // An array of file extensions your tests use
    moduleFileExtensions: ['js', 'jsx', 'json', 'node'],

    // An array of directory names to be searched recursively up from the requiring module's location
    moduleDirectories: ['node_modules'],

    // An array of glob patterns indicating a set of files for which coverage information should be collected
    collectCoverageFrom: ['src/**/*.js'],

    // The directory where Jest should output its coverage files
    coverageDirectory: 'coverage',

    // A map from regular expressions to paths to transformers
    transform: {
        "^.+\\.(js|jsx)$": "babel-jest", // Use Babel for transpiling JavaScript and JSX files
    },
};