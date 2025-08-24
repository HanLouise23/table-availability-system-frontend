module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  clearMocks: true,
  restoreMocks: true,

  collectCoverageFrom: [
    "app/**/*.{ts,tsx}",
    "!app/**/__tests__/**",
    "!app/types/**"
  ],
  coverageThreshold: {
    global: { statements: 80, branches: 80, functions: 80, lines: 80 }
  },
  coverageDirectory: "<rootDir>/coverage",
  coverageReporters: ["text", "text-summary", "lcov", "html", "json-summary"],

  testMatch: ["<rootDir>/app/**/__tests__/**/*.(spec|test).ts?(x)"],

  extensionsToTreatAsEsm: [".ts", ".tsx"],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      { useESM: true, tsconfig: "<rootDir>/tsconfig.jest.json" },
    ],
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    // mock static assets
    "\\.(png|jpe?g|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.ts",
    // support for "~/" alias
    "^~/(.*)$": "<rootDir>/app/$1",
    // allow absolute imports like "/img/left.png"
    "^/(.*)$": "<rootDir>/public/$1",
  },

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
};