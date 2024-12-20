/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  "testPathIgnorePatterns": ["build/*"],
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
  },
};