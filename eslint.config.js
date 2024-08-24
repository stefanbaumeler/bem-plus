const stylistic = require('@stylistic/eslint-plugin')
const typescriptEslintParser = require('@typescript-eslint/parser');
const tsEslint = require('typescript-eslint')

module.exports = [
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: typescriptEslintParser,
        },
        plugins: {
            '@stylistic': stylistic,
            '@typescript-eslint': tsEslint.plugin
        },
        rules: {
            'object-curly-spacing': ['error', 'always'],
            'no-plusplus': 'off',
            'prefer-destructuring': ['error', {
                'array': false,
                'object': false,
            }],
            'no-param-reassign': [2, {
                'props': false
            }],
            'max-len': ['error', 120, 4, {
                ignoreUrls: true,
                ignoreComments: false,
                ignoreRegExpLiterals: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
            }],
            'quotes': ['error', 'single'],
            'object-curly-newline': ['error', {
                'ObjectExpression': {
                    'minProperties': 1
                },
                'ObjectPattern': {
                    'minProperties': 2
                },
                'ImportDeclaration': {
                    'minProperties': 20,
                    'multiline': true
                },
                'ExportDeclaration': {
                    'minProperties': 2
                }

            }],
            'curly': ['error', 'all'],
            'comma-spacing': 'error',
            'comma-dangle': 'error',
            'arrow-spacing': 'error',
            'arrow-parens': 'error',
            'space-before-function-paren': ['error', {
                'anonymous': 'never',
                'named': 'never',
                'asyncArrow': 'always'
            }],
            'space-infix-ops': 'error',
            'no-trailing-spaces': ['error', {
                'skipBlankLines': true
            }],
            'no-var': 'error',
            'semi': ['error', 'never'],
            'keyword-spacing': 'error',
            'space-before-blocks': 'error',
            'padded-blocks': ['error', 'never'],
            'array-bracket-newline': ['error', 'consistent'],
            'array-element-newline': ['error', 'consistent'],
            'no-duplicate-imports': 'error',
            'no-multiple-empty-lines': ['error', {
                'max': 1
            }],
            'no-alert': 'error',
            'no-const-assign': 'error',
            'no-extra-parens': 'error',
            'no-useless-return': 'error',
            'no-unused-vars': 'off',
            'no-self-compare': 'error',
            'no-self-assign': 'error',
            'no-multi-assign': 'error',
            'object-property-newline': 'error',
            'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
            'indent': ['error', 4, {
                'SwitchCase': 1
            }],
            'array-bracket-spacing': ['error', 'never'],
            'padding-line-between-statements': ['warn',
                {
                    blankLine: 'always',
                    prev: ['multiline-const', 'multiline-block-like', 'multiline-expression'],
                    next: '*'
                },
                {
                    blankLine: 'always',
                    prev: '*',
                    next: ['block-like', 'return']
                }],
            'prefer-template': 'error',
            'template-curly-spacing': ['error', 'never'],
            'no-nested-ternary': 'error',
            'no-console': ['warn', {
                allow: ['warn', 'error']
            }],
            'prefer-object-spread': 'error',
            'object-shorthand': 'error',
            'eqeqeq': ['error', 'always'],
            'max-params': ['error', 3],
            '@typescript-eslint/array-type': ['error', {
                default: 'array'
            }],
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-unused-vars': ['error', {
                'ignoreRestSiblings': true
            }],
            '@stylistic/type-annotation-spacing': ['error', {
                before: false,
                after: true,
                overrides: {
                    arrow: {
                        before: true,
                        after: true
                    }
                }
            }],
            'max-classes-per-file': ['error', 1],
            '@stylistic/indent': ['error', 4, {
                'SwitchCase': 1
            }],
            '@stylistic/semi': ['error', 'never'],
            '@stylistic/member-delimiter-style': ['error', {
                'multiline': {
                    'delimiter': 'none',
                    'requireLast': false
                },
                'singleline': {
                    'delimiter': 'comma',
                    'requireLast': false
                },
                'multilineDetection': 'brackets'
            }],
        }
    }
]
