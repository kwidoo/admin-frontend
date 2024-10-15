import { Config } from 'stylelint';

const config: Config = {
  extends: ['stylelint-config-standard', 'stylelint-config-tailwindcss'],
  rules: {
    'at-rule-no-unknown': null,
  },
};

export default config;
