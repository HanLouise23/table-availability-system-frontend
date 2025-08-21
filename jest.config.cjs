module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",

  extensionsToTreatAsEsm: [".ts", ".tsx"],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      { useESM: true, tsconfig: "tsconfig.json" },
    ],
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^~/(.*)$": "<rootDir>/app/$1",   // resolves "~/components/..." imports
  },

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
};