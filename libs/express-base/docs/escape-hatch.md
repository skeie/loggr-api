# Escape hatch

This page describes how to proceed if conventions, included files and libraries does not work out for you. If it's not documented here, please [tell us about it](https://sch-chat.slack.com/messages/finn-framsie/), chances are that it should be.

## Remove the client

The client folder will not be necessary for all projects. You can clean up by:

- Deleting the "client" folder
- Removing "client/**/*.test.js" from `mocha.opts`
