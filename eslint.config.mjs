import antfu from '@antfu/eslint-config';

export default antfu(
  { vue: true, typescript: true },
  {
    rules: {
      'style/semi': ['error', 'always'],
      'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'style/ban-ts-comment': 'off',
      'style/no-unsafe-member-access': 'off',
      'style/no-unsafe-assignment': 'off',
      'style/no-unsafe-return': 'off',
      'style/restrict-plus-operands': 'off',
      'style/no-unsafe-argument': 'off',
      'style/restrict-template-expressions': 'off',
      'style/no-invalid-this': 'off',
      'style/no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
      'ts/no-mixed-enums': 'off',
      'ts/no-unsafe-function-type': 'off',
      'no-unused-vars': 'off',
      'unused-imports/no-unused-vars': 'off',
      'unicorn/prefer-number-properties': 'off',
      'no-prototype-builtins': 'off',
    },
  },
);
