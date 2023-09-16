Thanks for your interest in contributing to this project.

These are some basic instructions to build and test the constructs.

## Dependencies

This project uses [Projen](https://projen.io/) to manage its lifecycle. Instead of using the `package.json` file to specify dependencies and other aspects of the project, you have to use the `.projenrc.js` file.

## Building

Run `npx projen build` if you want to build all the bindings in this project. This command will run tests and construct the multiple language libraries.

## Testing

This project uses [Jest](https://jestjs.io) for testing. You can find all the tests under the `tests` directory.

Run `npx projen test` if you only want to run the tests for this project. This will skip the language binding generation.