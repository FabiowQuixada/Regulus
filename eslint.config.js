const jasmine    = require('eslint-plugin-jasmine');
const varspacing = require('eslint-plugin-varspacing');

module.exports = {
    'plugins': {
        jasmine,
        varspacing
    },
    'rules': {
        'space-before-blocks': ['error', 'always'],
        'space-infix-ops': ['error'],
        'no-console': ['off'],
        'indent': ['error'],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'eol-last': ['error', 'always'],
        'no-shadow' : ['error'],
        'eqeqeq': ['error', 'always'],
        'complexity': ['warn'],
        'no-trailing-spaces': ['error', { 'skipBlankLines': false }],
        'no-var': ['error'],
        'prefer-const': ['error'],
        'no-extra-parens': ['error'],
        'strict': ['error'],
        'no-mixed-requires': ['error'],
        'comma-spacing': ['error'],
        'max-depth': ['error'],
        'no-tabs': ['error']
    }
};
