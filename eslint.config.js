import varspacing from 'eslint-plugin-varspacing';

export default {
    'plugins': {
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
