#!/usr/bin/env ts-node

import { execSync } from "child_process";

const args = process.argv.slice(2);
const testType = args[0];

const testCommands = {
  token: "jest tests/token.test.ts",
  transaction: "jest tests/transaction.test.ts",
  account: "jest tests/account.test.ts",
  all: "jest tests/",
  coverage: "jest tests/ --coverage",
  watch: "jest tests/ --watch",
};

function runTests(command: string) {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error("Test execution failed:", error);
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
Test Runner Usage:
  npm run test:token      - Run TokenAPI tests
  npm run test:transaction - Run TransactionAPI tests
  npm run test:all        - Run all tests
  npm run test:coverage   - Run tests with coverage
  npm run test:watch      - Run tests in watch mode

Available commands:
  ${Object.keys(testCommands).join(", ")}
  `);
}

if (!testType || testType === "help" || testType === "--help") {
  showHelp();
  process.exit(0);
}

const command = testCommands[testType as keyof typeof testCommands];

if (!command) {
  console.error(`Unknown test type: ${testType}`);
  showHelp();
  process.exit(1);
}

runTests(command);
