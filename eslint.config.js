import NaomisConfig from "@nhcarrigan/eslint-config";

export default [
  ...NaomisConfig,
  {
    files: ["src/assets/*.ts"],
    rules: {
      "max-lines": "off",
    },
  },
];
