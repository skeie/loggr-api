# Testing

Mocha is used as a test runner, with [power-assert](https://github.com/power-assert-js/power-assert) as assertion library. Tests are co-located with the implementation and gives the following benefits.

- Easy switch between impl and test without IDE support to help.
- Easily move/delete/extract/encapsulate entire modules (including tests).
- Avoids `require('../../../../src/my/foo/service');` in tests.

Run all test using `npm test`.

## Watch tests (multi-run)

To run tests when files change, run `npm run test:watch`.

## Coverage in console

`npm test:coverage` will run test and print test coverage.

## Coverage to HTML

`npm test:coverage:report` will run test and store test coverage. Open `coverage/index.html` to display results.

## Debug tests in IntelliJ / WebStorm

See [https://www.jetbrains.com/help/webstorm/2016.2/run-debug-configuration-mocha.html](https://www.jetbrains.com/help/webstorm/2016.2/run-debug-configuration-mocha.html) for detailed information.

When prompted for values, use defaults with the following exception.

- Select "File patterns" and enter `server/**/*.test.js client/**/*.test.js` as value.

## Debug tests in Chrome

Run `npm test:debug` to run Mocha in a debug session. Open the URL when prompted.

